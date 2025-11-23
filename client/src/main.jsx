import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

export const serverUrl = import.meta.env.VITE_SERVER_URL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
