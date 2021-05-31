#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// https://substrate.dev/docs/en/knowledgebase/runtime/frame

use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch, traits::{Get, Randomness}};
use sp_runtime::{ traits::StaticLookup, DispatchError, DispatchResult };
use core::{convert::TryInto, fmt};
use parity_scale_codec::{Decode, Encode};
use self::__private as export;
// use frame_system::ensure_signed;

use frame_system::{
	self as system, ensure_none, ensure_signed,
	offchain::{
		AppCrypto, CreateSignedTransaction, SendSignedTransaction, SendUnsignedTransaction,
		SignedPayload, SigningTypes, Signer, SubmitTransaction,
	},
};

use sp_core::crypto::KeyTypeId;
use sp_runtime::{
	RuntimeDebug,
	offchain as rt_offchain,
	offchain::{
		storage::StorageValueRef,
		storage_lock::{StorageLock, BlockAndTime},
	},
	transaction_validity::{
		InvalidTransaction, TransactionSource, TransactionValidity,
		ValidTransaction,
	},
};
use sp_std::{
	prelude::*, str,
	collections::vec_deque::VecDeque,
};


use sp_core::H256;
use sp_std::vec::Vec;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub use pallet_nft;

use frame_support::traits::Vec;

// We use `alt_serde`, and Xanewok-modified `serde_json` so that we can compile the program
//   with serde(features `std`) and alt_serde(features `no_std`).
use alt_serde::{Deserialize, Deserializer};

/// Defines application identifier for crypto keys of this module.
///
/// Every module that deals with signatures needs to declare its unique identifier for
/// its crypto keys.
/// When an offchain worker is signing transactions it's going to request keys from type
/// `KeyTypeId` via the keystore to sign the transaction.
/// The keys can be inserted manually via RPC (see `author_insertKey`).
pub const KEY_TYPE: KeyTypeId = KeyTypeId(*b"test");
pub const NUM_VEC_LEN: usize = 10;
/// The type to sign and send transactions.
pub const UNSIGNED_TXS_PRIORITY: u64 = 100;
pub const HTTP_REMOTE_REQUEST: &str = "http://127.0.0.1:3030/api/v1/showUsers";
pub const HTTP_HEADER_USER_AGENT: &str = "test555";
pub const FETCH_TIMEOUT_PERIOD: u64 = 3000; // in milli-seconds
pub const LOCK_TIMEOUT_EXPIRATION: u64 = FETCH_TIMEOUT_PERIOD + 1000; // in milli-seconds
pub const LOCK_BLOCK_EXPIRATION: u32 = 3; // in block number


/// Based on the above `KeyTypeId` we need to generate a pallet-specific crypto type wrapper.
/// We can utilize the supported crypto kinds (`sr25519`, `ed25519` and `ecdsa`) and augment
/// them with the pallet-specific identifier.
pub mod crypto {
	use crate::KEY_TYPE;
	use sp_core::sr25519::Signature as Sr25519Signature;
	use sp_runtime::app_crypto::{app_crypto, sr25519};
	use sp_runtime::{
		traits::Verify,
		MultiSignature, MultiSigner,
	};

	app_crypto!(sr25519, KEY_TYPE);

	pub struct TestAuthId;

	impl frame_system::offchain::AppCrypto<MultiSigner, MultiSignature> for TestAuthId {
		type RuntimeAppPublic = Public;
		type GenericSignature = sp_core::sr25519::Signature;
		type GenericPublic = sp_core::sr25519::Public;
	}

	impl frame_system::offchain::AppCrypto<<Sr25519Signature as Verify>::Signer, Sr25519Signature>
		for TestAuthId
	{
		type RuntimeAppPublic = Public;
		type GenericSignature = sp_core::sr25519::Signature;
		type GenericPublic = sp_core::sr25519::Public;
	}
}

/// data required to submit a transaction.
#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug)]
pub struct TopStreamersPayload<Public, AccountId, BlockNumber> {
	block_number: BlockNumber,
	distribution: Vec<AccountId>,
	public: Public
}

impl <T: SigningTypes> SignedPayload<T> for Payload<T::Public> {
	fn public(&self) -> T::Public {
		self.public.clone()
	}
}

// Specifying serde path as `alt_serde`
// ref: https://serde.rs/container-attrs.html#crate
#[serde(crate = "alt_serde")]
#[derive(Deserialize, Encode, Decode, Default)]
struct PolkaMStats {
	// Specify our own deserializing function to convert JSON string to vector of bytes
	#[serde(deserialize_with = "de_string_to_bytes")]
	top_streamers: Vec<AccountId>,
}

pub fn de_string_to_bytes<'de, D>(de: D) -> Result<Vec<u8>, D::Error>
where
	D: Deserializer<'de>,
{
	let s: &str = Deserialize::deserialize(de)?;
	Ok(s.as_bytes().to_vec())
}

impl fmt::Debug for PolkaMStats {
	// `fmt` converts the vector of bytes inside the struct back to string for
	//   more friendly display.
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		write!(
			f,
			"{top_streamers: {}}",
			str::from_utf8(&self.top_streamers).map_err(|_| fmt::Error)?
		)
	}
}

/// Configure the pallet by specifying the parameters and types on which it depends.
pub trait Trait: frame_system::Trait + pallet_nft::Trait + CreateSignedTransaction<Call<Self>>  {
	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
	/// The identifier type for an offchain worker.
	type AuthorityId: AppCrypto<Self::Public, Self::Signature>;
	/// The overarching dispatch call type.
	type Call: From<Call<Self>>;
	// Hash
	type RandomnessSource: Randomness<H256>;

}

// The pallet's runtime storage items.
// https://substrate.dev/docs/en/knowledgebase/runtime/storage
decl_storage! {
	// A unique name is used to ensure that the pallet's storage items are isolated.
	// This name may be updated, but each pallet in the runtime must use a unique name.
	// ---------------------------------vvvvvvvvvvvvvv
	trait Store for Module<T: Trait> as TemplateModule {
		// Learn more about declaring storage items:
		// https://substrate.dev/docs/en/knowledgebase/runtime/storage#declaring-storage-items
		
		/// A nonce to use as a subject when drawing randomness
		Nonce get(fn nonce): u32;
		
	}
}

// Pallets use events to inform users when important changes are made.
// https://substrate.dev/docs/en/knowledgebase/runtime/events
decl_event!(
	pub enum Event<T>  where
		AccountId = <T as frame_system::Trait>::AccountId, 
		ClassId = <T as pallet_nft::Trait>::ClassId,
		TokenId = <T as pallet_nft::Trait>::TokenId {
		NftClassCreated(AccountId, ClassId),
		NftTokenMinted(AccountId, TokenId),
		NftTokenTransferred(AccountId, AccountId, ClassId, TokenId),
		NewEvent(Option<AccountId>, Vec<AccountId>),
	}
);

// Errors inform users that something went wrong.
decl_error! {
	pub enum Error for Module<T: Trait> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
		StorageOverflow,
	}
}

// Dispatchable functions allows users to interact with the pallet and invoke state changes.
// These functions materialize as "extrinsics", which are often compared to transactions.
// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		// Errors must be initialized if they are used by the pallet.
		type Error = Error<T>;

		// Events must be initialized if they are used by the pallet.
		fn deposit_event() = default;

		#[weight = 10_000 + T::DbWeight::get().reads_writes(1,1)]
		pub fn create_nft_class(
			origin,
			class_metadata: Vec<u8>, 
			class_data : <T as pallet_nft::Trait>::ClassData
		) -> dispatch::DispatchResult {
			let who = ensure_signed(origin)?;
			let r: Result<T::ClassId, DispatchError> = pallet_nft::Module::<T>::create_class(&who, class_metadata, class_data);
			Self::deposit_event(RawEvent::NftClassCreated(who, r.unwrap()));
			Ok(())
		}

		#[weight = 10_000 + T::DbWeight::get().reads_writes(1,1)]
		pub fn mint_nft_token(
			origin, 
			class_id: T::ClassId, metadata: Vec<u8>, 
			data: <T as pallet_nft::Trait>::TokenData
		) -> dispatch::DispatchResult {
			let who = ensure_signed(origin)?;
			let r: Result<T::TokenId, DispatchError> = pallet_nft::Module::<T>::mint(&who, class_id, metadata, data);
			Self::deposit_event(RawEvent::NftTokenMinted(who, r.unwrap()));
			Ok(())
		}
		
		#[weight = 10_000 + T::DbWeight::get().reads_writes(1,1)]
		pub fn nft_transfer(origin, 
			dest: <T::Lookup as StaticLookup>::Source, 
			token_class_id: T::ClassId, 
			token_id: T::TokenId
		) -> DispatchResult {
			let who = ensure_signed(origin)?;
			let to: T::AccountId = T::Lookup::lookup(dest)?;
			let _r = pallet_nft::Module::<T>::transfer(&who, &to, (token_class_id, token_id));
			Self::deposit_event(RawEvent::NftTokenTransferred(who, to, token_class_id, token_id));
			Ok(())
		}

		#[weight = 10_000 + T::DbWeight::get().reads_writes(1,1)]
		pub fn submit_unsigned_nft_distributions(
			origin,
			top_streamers: distribution) -> DispatchResult {
			// TODO :: distribution model

			let _ = ensure_none(origin)?;
			let subject = Self::encode_and_update_nonce();

			let random_seed = T::RandomnessSource::random_seed();
			let random_result = T::RandomnessSource::random(&subject);

			Self::check_distributions(
				top_streamers,
			)?
		}

		#[weight = 10000]
		pub fn submit_unsigned_with_signed_payload(origin, payload: TopStreamersPayload<T::Public>,
			_signature: T::Signature) -> DispatchResult
		{
			let _ = ensure_none(origin)?;
			let Payload { distribution, public } = payload;
			debug::info!("submit_unsigned_with_signed_payload: ({}, {:?})", distribution, public);
			Self::append_or_replace_addresses(distribution);`

			Self::deposit_event(RawEvent::NewEvent(None, distribution));
			Ok(())
		}

		/// Offchain Worker entry point.
		/// Note that it's not guaranteed for offchain workers to run on EVERY block, there might
		/// be cases where some blocks are skipped, or for some the worker runs twice (re-orgs),
		/// so the code should be able to handle that.

		fn offchain_worker(block_number: T::BlockNumber) {
			debug::info!("Entering off-chain worker");

			// TODO: Transaction types 

			const TRANSACTION_TYPES: usize = 4;
			let result = match block_number.try_into()
				.map_or(TRANSACTION_TYPES, |bn| bn % TRANSACTION_TYPES)
			{
				0 => Self::offchain_unsigned_tx(block_number),
				1 => Self::offchain_unsigned_tx_signed_payload(block_number),
				2 => Self::fetch_polkamusic_stats(),
				_ => Err(Error::<T>::UnknownOffchainMux),
			};

			if let Err(e) = result {
				debug::error!("offchain_worker error: {:?}", e);
			}
		}
	}
}

impl<T: Trait> Module<T> {
	/// Reads the nonce from storage, increments the stored nonce, and returns
	/// the encoded nonce to the caller.
	fn encode_and_update_nonce() -> Vec<u8> {
		let nonce = Nonce::get();
		Nonce::put(nonce.wrapping_add(1));
		nonce.encode()
	}

	fn fetch_pm_info() -> Result<(), Error<T>> {
		// Create a reference to Local Storage value.
		// Since the local storage is common for all offchain workers, it's a good practice
		// to prepend our entry with the pallet name.
		let s_info = StorageValueRef::persistent(b"offchain-distribution::pm-info");

		if let Some(Some(pm_info)) = s_info.get::<PolkaStatsInfo>() {
			debug::info!("cached pm-info: {:?}", pm_info);
			return Ok(());
		}

		// Since off-chain storage can be accessed by off-chain workers from multiple runs, it is important to lock
		//   it before doing heavy computations or write operations.
		// ref: https://substrate.dev/rustdocs/v2.0.0-rc3/sp_runtime/offchain/storage_lock/index.html
		//
		// There are four ways of defining a lock:
		//   1) `new` - lock with default time and block exipration
		//   2) `with_deadline` - lock with default block but custom time expiration
		//   3) `with_block_deadline` - lock with default time but custom block expiration
		//   4) `with_block_and_time_deadline` - lock with custom time and block expiration
		// Here we choose the most custom one for demonstration purpose.
		let mut lock = StorageLock::<BlockAndTime<Self>>::with_block_and_time_deadline(
			b"offchain-demo::lock", LOCK_BLOCK_EXPIRATION,
			rt_offchain::Duration::from_millis(LOCK_TIMEOUT_EXPIRATION)
		);

		if let Ok(_guard) = lock.try_lock() {
			match Self::fetch_n_parse() {
				Ok(pm_info) => { s_info.set(&pm_info); }
				Err(err) => { return Err(err); }
			}
		}
		Ok(())
	}

	/// Fetch from remote and deserialize the JSON to a struct
	fn fetch_n_parse() -> Result<PolkaMStats, Error<T>> {
		let resp_bytes = Self::fetch_from_remote().map_err(|e| {
			debug::error!("fetch_from_remote error: {:?}", e);
			<Error<T>>::HttpFetchingError
		})?;

		let resp_str = str::from_utf8(&resp_bytes).map_err(|_| <Error<T>>::HttpFetchingError)?;
		// Print out our fetched JSON string
		debug::info!("{}", resp_str);

		// Deserializing JSON to struct, thanks to `serde` and `serde_derive`
		let pm_info: PolkaMStats =
			serde_json::from_str(&resp_str).map_err(|_| <Error<T>>::HttpFetchingError)?;
		Ok(pm_info)
	}

	/// This function uses the `offchain::http` API to query the streamers AccountId,
	///   and returns the JSON response as vector of bytes.
	fn fetch_from_remote() -> Result<Vec<u8>, Error<T>> {
		debug::info!("sending request to: {}", HTTP_REMOTE_REQUEST);

		// Initiate an external HTTP GET request. This is using high-level wrappers from `sp_runtime`.
		let request = rt_offchain::http::Request::get(HTTP_REMOTE_REQUEST);

		// Keeping the offchain worker execution time reasonable, so limiting the call to be within 3s.
		let timeout = sp_io::offchain::timestamp()
			.add(rt_offchain::Duration::from_millis(FETCH_TIMEOUT_PERIOD));

		let pending = request
			.add_header("User-Agent", HTTP_HEADER_USER_AGENT)
			.deadline(timeout) // Setting the timeout time
			.send() // Sending the request out by the host
			.map_err(|_| <Error<T>>::HttpFetchingError)?;

		// The returning value here is a `Result` of `Result`, so we are unwrapping it twice by two `?`
		//   ref: https://substrate.dev/rustdocs/v2.0.0/sp_runtime/offchain/http/struct.PendingRequest.html#method.try_wait
		let response = pending
			.try_wait(timeout)
			.map_err(|_| <Error<T>>::HttpFetchingError)?
			.map_err(|_| <Error<T>>::HttpFetchingError)?;

		if response.code != 200 {
			debug::error!("Unexpected http request status code: {}", response.code);
			return Err(<Error<T>>::HttpFetchingError);
		}

		// Next we fully read the response body and collect it to a vector of bytes.
		Ok(response.body().collect::<Vec<u8>>())
	}

	fn offchain_unsigned_tx_signed_payload(block_number: T::BlockNumber) -> Result<(), Error<T>> {
		// Retrieve the signer to sign the payload
		let signer = Signer::<T, T::AuthorityId>::any_account();

		let distribution: Vec<AccountId> = block_number.try_into().unwrap_or(0) as Vec<u8>;

		if let Some((_, res)) = signer.send_unsigned_transaction(
			|acct| Payload { distribution, public: acct.public.clone() },
			Call::submit_unsigned_with_signed_payload
		) {
			return res.map_err(|_| {
				debug::error!("Failed in offchain_unsigned_tx_signed_payload");
				<Error<T>>::OffchainUnsignedTxSignedPayloadError
			});
		}

		debug::error!("No local account available");
		Err(<Error<T>>::NoLocalAcctForSigning)
	}

	fn offchain_unsigned_tx(block_number: T::BlockNumber) -> Result<(), Error<T>> {
		let distribution: Vec<u8> = block_number.try_into().unwrap_or(0) as Vec<u8>;
		let call = Call::submit_unsigned_nft_distributions(distribution);

			SubmitTransaction::<T, Call<T>>::submit_unsigned_transaction(call.into())
			.map_err(|_| {
				debug::error!("Failed in offchain_unsigned_tx");
				<Error<T>>::OffchainUnsignedTxError
			})
	}
}

impl<T: Trait> frame_support::unsigned::ValidateUnsigned for Module<T> {
	type Call = Call<T>;

	fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
		let valid_tx = |provide| ValidTransaction::with_tag_prefix("pm-nft")
			.priority(UNSIGNED_TXS_PRIORITY)
			.and_provides([&provide])
			.longevity(3)
			.propagate(true)
			.build();

		match call {
			Call::submit_unsigned_nft_distributions(_distribution) => valid_tx(b"submit_unsigned".to_vec()),
			Call::submit_unsigned_with_signed_payload(ref payload, ref signature) => {
				if !SignedPayload::<T>::verify::<T::AuthorityId>(payload, signature.clone()) {
					return InvalidTransaction::BadProof.into();
				}
				valid_tx(b"submit_unsigned_with_signed_payload".to_vec())
			},
			_ => InvalidTransaction::Call.into(),
		}
	}


