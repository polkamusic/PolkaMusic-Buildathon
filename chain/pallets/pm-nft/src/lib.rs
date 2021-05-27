#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// https://substrate.dev/docs/en/knowledgebase/runtime/frame

use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch, traits::Get};
use frame_system::ensure_signed;
use sp_runtime::{ traits::StaticLookup, DispatchError, DispatchResult };


#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub use pallet_nft;

use frame_support::traits::Vec;

/// Configure the pallet by specifying the parameters and types on which it depends.
pub trait Trait: frame_system::Trait + pallet_nft::Trait  {
	/// Because this pallet emits events, it depends on the runtime's definition of an event.
	type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
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
	}
}
