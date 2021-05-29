import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// temp, these wallet pkgs should be on main or app.js, use redux insted of drill
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { keyring } from '@polkadot/ui-keyring';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Provider } from 'react-redux'
import { createReduxStore } from './redux/Redux';

// use redux insted of prop drill
cryptoWaitReady()
  .then(() => {
    try {     
      async function getAccounts() {
        await web3Enable('PolkaMusic Player');
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) =>
          ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
        keyring.loadAll({ isDevelopment: true }, allAccounts);
        const krAccts = keyring.getAccounts();

        ReactDOM.render(
          <React.StrictMode>
            <Provider store={createReduxStore()}>
              <App keyringAccts={krAccts} />
            </Provider>
          </React.StrictMode>
          , document.getElementById('root'));
      }
      getAccounts();
    } catch (err) {
      console.log(err);
    }
  })
  .catch(console.error);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );
