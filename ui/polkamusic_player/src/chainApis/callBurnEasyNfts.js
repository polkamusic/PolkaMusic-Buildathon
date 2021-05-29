import keyring from '@polkadot/ui-keyring';
import { web3FromSource } from '@polkadot/extension-dapp';

async function callBurnEasyNfts(keyringBurnAccount, nodeApi, classID, tokenID, keyringAccount) {
    if (keyringBurnAccount && nodeApi && keyringAccount) {

      const krpair = keyring.getPair(keyringAccount.address);
      // console.log('reg krpair', krpair);
      const burnKrpair = keyring.getPair(keyringBurnAccount.address);

      keyring.getAddresses().forEach(kra => {

        if (kra.address?.toString() === krpair.address?.toString()) {
          console.log('Keyring address already saved...');
        } else {
          keyring.saveAddress(krpair.address, { name: krpair.meta.name });
        }
      });

      // signer is from Polkadot-js browser extension
      const {
        address,
        meta: { source, isInjected }
      } = krpair;
      let fromAcct;

      if (isInjected) {
        console.log('is injected', isInjected);
        const injected = await web3FromSource(source);
        fromAcct = address;
        nodeApi.setSigner(injected.signer);
      } else {
        fromAcct = krpair;
      }

      // ipfs hash needs to be saved somewhere
      const transfer = nodeApi.tx.pmNftModule
        // .burn, temporarily just nftTransfer to burn address
        .nftTransfer(
          burnKrpair.address,
          classID,
          tokenID
        );

      // send the transaction using our account
      await transfer.signAndSend(fromAcct)
        // ({ status, events }) => {
        // events
        //   // find/filter for failed events
        //   .filter(({ event }) =>
        //     nodeApi.events.system.ExtrinsicFailed.is(event)
        //   )
        //   // we know that data for system.ExtrinsicFailed is
        //   // (DispatchError, DispatchInfo)
        //   .forEach(({ event: { data: [error, info] } }) => {
        //     if (error.isModule) {
        //       // for module errors, we have the section indexed, lookup
        //       const decoded = nodeApi.registry.findMetaError(error.asModule);
        //       const { documentation, method, section } = decoded;

        //       console.log(`${section}.${method}: ${documentation.join(' ')}`);
        //     } else {
        //       // Other, CannotLookup, BadOrigin, no extra info
        //       console.log(error.toString());
        //     }
        //   });

        // // success
        // events.filter(({ event }) =>
        //   nodeApi.events.system.ExtrinsicSuccess.is(event)
        // ).forEach(({ event: { data: [info] } }) => {
        //   if (info) {
        //     console.log('Easy NFT burn success!');
        //   }
        // });

     // });

    }
  }


// async function burnEasyNftsAtNode(addr, api, classAndTokenID) {
//     if (!api || !addr) {
//         console.log('api or address is missing')
//         return
//     }

//     const [response] = await Promise.all([
//         api.query.nftModule.burn(addr, classAndTokenID) // addr = account id
//     ]);

//     console.log('burn ez tokens', response);

//     return response
// }

// export default burnEasyNftsAtNode

export default callBurnEasyNfts

