import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { dataStore, persistor } from "./store/redux-persist";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// ----------> root rendering of react app with redux provider and persist gate for redux-persist.
// The Provider component makes the Redux store available to any nested components that need to access the Redux store.
// The PersistGate delays the rendering of the app's UI until the persisted state has been retrieved and saved to redux.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={dataStore}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
