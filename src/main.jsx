import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { dataStore, persistor } from "./store/redux-persist";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// ----------> root rendering of react app with redux provider and persist gate for redux-persist.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={dataStore}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
