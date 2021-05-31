import { stringToHex } from "@polkadot/util";
import keyring from '@polkadot/ui-keyring';
import { web3FromSource } from '@polkadot/extension-dapp';

async function callMintFromSource(keyringSourceAccount, nodeApi, keyringAccount, tokenCategory="token", tokenData=0, classID=0) {
    if (keyringSourceAccount && nodeApi && keyringAccount) {
  
      // Constuct the keying after the API (crypto has an async init)
      const keyRing = new Keyring({ type: 'sr25519' });
  
      // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
      const alice = keyRing.addFromUri('//Alice');
  
   
      const sourceKrpair = keyring.getPair(keyringSourceAccount.address);
      console.log('source Kr pair', sourceKrpair);
  
  
      keyring.getAddresses().forEach(kra => {
        if (kra.address?.toString() === sourceKrpair.address?.toString()) {
          console.log('Keyring source address already saved...');
        } else {
          keyring.saveAddress(sourceKrpair.address, { name: sourceKrpair.meta.name });
        }
      });
  
  
      console.log(typeof classID, typeof tokenID);
      console.log(classID, tokenID);
      const nftMint = nodeApi.tx.pmNftModule
        .mintNftToken(
          classID,
          stringToHex(tokenCategory),
          tokenData
        );
  
      const tx = await nftMint.signAndSend(alice,{ nonce: -1});
      notify(`NFT minted with hash `)
      console.log((`NFT minted with hash ${tx}`));
    }
  }

  export default callMintFromSource