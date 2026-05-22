import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "public/icons");
const srcDir = resolve(__dirname, "../../artifacts/x-checker/public");

mkdirSync(outDir, { recursive: true });

// Copy the website's exact favicon PNGs so the extension icon matches the site logo perfectly
copyFileSync(resolve(srcDir, "favicon-192.png"), resolve(outDir, "icon128.png"));
copyFileSync(resolve(srcDir, "favicon-48.png"),  resolve(outDir, "icon48.png"));
copyFileSync(resolve(srcDir, "favicon-48.png"),  resolve(outDir, "icon32.png"));
copyFileSync(resolve(srcDir, "favicon-48.png"),  resolve(outDir, "icon16.png"));

console.log("Icons ready.");
