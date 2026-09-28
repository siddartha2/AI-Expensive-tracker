import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { Toaster } from "react-hot-toast";

console.log("main.jsx: script executing");
const rootEl = document.getElementById("root");
console.log("main.jsx: Root element found:", rootEl);

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log("main.jsx: createRoot and render called successfully");
} catch (e) {
  console.error("main.jsx: Error during render", e);
}