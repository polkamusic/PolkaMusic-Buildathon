import { ACTIONS } from "./Actions";

const initialState = {
  account: '',
  nodeApi: null,
  keyringAccounts: [],
}

function accountReducer(state = initialState, action) {
  // rest of the code
  switch (action.type) {
    case ACTIONS.SET_ACCOUNT: {
      const { newAcct } = action.payload;

      return {
        ...state,
        account: newAcct,
      };
    }
    // other cases
    case ACTIONS.SET_NODE_API: {
      const { newNodeApi } = action.payload;

      return {
        ...state,
        nodeApi: newNodeApi,
      };
    }

    case ACTIONS.SET_KEYRING_ACCOUNTS: {
      const { newKeyringAccounts } = action.payload;

      return {
        ...state,
        keyringAccounts: newKeyringAccounts,
      };
    }
  }
}

export default accountReducer