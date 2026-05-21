import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
createRoot(root).render(<App />);

root.style.animation = "app-fadein 0.2s ease-out both";
