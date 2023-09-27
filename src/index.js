import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./components/reducers/authReducer ";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary"
const store = configureStore({
  reducer: rootReducer,
});
const container = document.getElementById("root");

const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>
);
