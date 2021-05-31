import keyring from '@polkadot/ui-keyring';
import { web3FromSource } from '@polkadot/extension-dapp';

async function callBurnEasyNfts(keyringBurnAccount, nodeApi, classID, tokenID, keyringAccount, notify) {
    if (keyringBurnAccount && nodeApi && keyringAccount) {

      const krpair = keyring.getPair(keyringAccount.address);
      console.log('krpair', krpair);
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
        nodeApi.setSigner(injected.signer); // signature by alice
      } else {
        fromAcct = krpair;
      }

      const transfer = nodeApi.tx.pmNftModule
        // .burn, temporarily just nftTransfer to burn address
        .nftTransfer(
          burnKrpair.address,
          classID,
          tokenID
        );

      // send the transaction using our account
      const tx = await transfer.signAndSend(fromAcct,{ nonce: -1})
      if (notify) notify(`NFT claimed with hash ${tx}`)
      console.log((`NFT claimed with hash ${tx}`));
    }
  }

export default callBurnEasyNfts

