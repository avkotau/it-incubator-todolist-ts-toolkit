import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "common/store";
import { Provider } from "react-redux";
import { App } from "features/App/ui/App";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
