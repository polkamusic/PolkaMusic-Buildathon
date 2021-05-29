import accountReducer from './accountReducer'
import { createStore } from "redux";

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export function createReduxStore() {
  const store = createStore(accountReducer, enableReduxDevTools);
  return store;
}