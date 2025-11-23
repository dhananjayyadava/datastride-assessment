import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null,
  token: "",
  collapse: false,
  userType: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.user,
        token: action.token,
        collapse: false,
      };

    case "logout":
      return initialState;

    case "toggle":
      return {
        ...state,
        collapse: action.value,
      };

    case "userType":
      return {
        ...state,
        userType: action.userType,
      };

    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, loginReducer);

const dataStore = createStore(persistedReducer);
const persistor = persistStore(dataStore);

export { dataStore, persistor };
