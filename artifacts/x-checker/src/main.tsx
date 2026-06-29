import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

if (import.meta.env.PROD) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}

// Fade in after React mounts — hides prerender flash
requestAnimationFrame(() => root.classList.add("hydrated"));

