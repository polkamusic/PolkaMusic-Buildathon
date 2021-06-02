import { ChakraProvider } from "@chakra-ui/react";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import connectToChain from "./chainApis/connectToChain";
import { polmNftTypes } from "./chainApis/customTypes";
import { ACTIONS } from "./redux/Actions";
import { stringToHex } from "@polkadot/util";
import { keyring } from '@polkadot/ui-keyring';
import {
  u8aToString
} from '@polkadot/util';
const { Keyring } = require("@polkadot/keyring");


function App(props) {
  const dispatch = useDispatch();

  // use redux to store node api, e.g. local 'ws://127.0.0.1:9944'
  // bob's node, wss://polkamusic.in/bob
  connectToChain('wss://polkamusic.in/alice', (chainApi) => {
    console.log('node api', chainApi);
    // store node api ,redux
    dispatch({
      type: ACTIONS.SET_NODE_API,
      payload: {
        newNodeApi: chainApi
      }
    })


    async function setInitNftClass(api) {
      // create initial nft class, e.g. class id 0
      // Constuct the keying after the API (crypto has an async init)
      const keyRing = new Keyring({ type: "sr25519" });

      // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
      const source = keyRing.addFromUri("//Alice");

      const sourceKrpair = keyring.getPair(source.address);
      console.log("app-source Kr pair", sourceKrpair);

      keyring.getAddresses().forEach((kra) => {
        if (kra.address?.toString() === sourceKrpair.address?.toString()) {
          console.log("app-Keyring source address already saved...");
        } else {
          keyring.saveAddress(sourceKrpair.address, {
            name: sourceKrpair.meta.name,
          });
        }
      })

      // check if we have an init class already
      const classes = await api.query.nftModule.classes(0)

      console.log('app-nft classes', classes);

      if (classes && u8aToString(classes.value.metadata) === "polmNftDay1") return


      const nft_class_init = api.tx.pmNftModule.createNftClass(
        stringToHex("polmNftDay1"),
        0
      );

      const tx = await nft_class_init.signAndSend(source, { nonce: -1 });
      console.log(`NFT class 0 ${stringToHex("polmNftDay1")} init with hash ${tx}`);
    }

    setInitNftClass(chainApi)


  }, polmNftTypes)
    .catch(console.error);


  // store keyring accounts
  dispatch({
    type: ACTIONS.SET_KEYRING_ACCOUNTS,
    payload: {
      newKeyringAccounts: props.keyringAccts
    }
  });



  return (
    <Router>
      <ChakraProvider>
          <Main />
      </ChakraProvider>
    </Router>
  );
}

export default App;
