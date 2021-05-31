import keyring from '@polkadot/ui-keyring';
import { web3FromSource } from '@polkadot/extension-dapp';

async function callTransferFromSource(keyringSourceAccount, nodeApi, classID, tokenID, keyringAccount) {
    if (keyringSourceAccount && nodeApi && keyringAccount) {

      const krpair = keyring.getPair(keyringAccount.address);
      // console.log('reg krpair', krpair);
      const sourceKrpair = keyring.getPair(keyringSourceAccount.address);
      console.log('source Kr pair', sourceKrpair);

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
        // nodeApi.setSigner(injected.signer); // signature by alice
      } else {
        fromAcct = krpair;
      }

    //   nodeApi.setSigner(sourceKrpair.signer); // signature by alice

      // ipfs hash needs to be saved somewhere
      const transfer = nodeApi.tx.pmNftModule
        // .burn, temporarily just nftTransfer to burn address
        // 1st param, who , alice or source of nft
        // 2nd param,  to , destination 
        // 3rd param, tuple , classID, tokenID
        .nftTransfer(
          fromAcct,  
          classID,
          tokenID
        );

      // send the transaction using our account
      // sign by alice/source?
      sourceKrpair.sign(transfer);
      await transfer.send(sourceKrpair)
     

    }
  }


export default callTransferFromSource

