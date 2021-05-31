import { ChakraProvider } from "@chakra-ui/react";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import connectToChain from "./chainApis/connectToChain";
import { polmNftTypes } from "./chainApis/customTypes";
import { ACTIONS } from "./redux/Actions";

function App(props) {
  const dispatch = useDispatch();

  // use redux to store node api
  connectToChain('ws://127.0.0.1:9944', (chainApi) => {
    console.log('node api', chainApi);
    // store node api ,redux
    dispatch({
      type: ACTIONS.SET_NODE_API,
      payload: {
        newNodeApi: chainApi
      }
    });
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
