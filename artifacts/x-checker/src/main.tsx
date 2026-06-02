import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

if (import.meta.env.PROD) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}

root.style.animation = "app-fadein 0.2s ease-out both";
