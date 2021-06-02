import { ACTIONS } from "./Actions";

const initialState = {
  account: '',
  accountDisplay: '',
  nodeApi: null,
  keyringAccounts: [],
  keyringAccount: null,
  keyringBurnAccount: null,
  keyringSourceAccount: null,
  trackIndex: { idx: 0, clicked: false },
  mintTransferRunValue: ''
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

    case ACTIONS.SET_ACCOUNT_DISPLAY: {
      const { newAcctDisplay } = action.payload;

      return {
        ...state,
        accountDisplay: newAcctDisplay,
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

    case ACTIONS.SET_KEYRING_ACCOUNT: {
      const { newKeyringAccount } = action.payload;

      return {
        ...state,
        keyringAccount: newKeyringAccount,
      };
    }

    case ACTIONS.SET_KEYRING_BURN_ACCOUNT: {
      const { newKeyringBurnAccount } = action.payload;

      return {
        ...state,
        keyringBurnAccount: newKeyringBurnAccount,
      };
    }

    case ACTIONS.SET_KEYRING_SOURCE_ACCOUNT: {
      const { newKeyringSourceAccount } = action.payload;

      return {
        ...state,
        keyringSourceAccount: newKeyringSourceAccount,
      };
    }

    case ACTIONS.SET_TRACK_INDEX: {
      const { newTrackIndex } = action.payload;

      return {
        ...state,
        trackIndex: { ...state.trackIndex, ...newTrackIndex },
      };
    }

    case ACTIONS.SET_MINT_TRANSFER_RUN_VAL: {
      const { newMintTransferRunValue } = action.payload;

      return {
        ...state,
        mintTransferRunValue: newMintTransferRunValue,
      };
    }

  }
}

export default accountReducer