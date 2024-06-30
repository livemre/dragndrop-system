import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MainContext, MainProvider } from "./Context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MainProvider>
    <App />
  </MainProvider>
);
