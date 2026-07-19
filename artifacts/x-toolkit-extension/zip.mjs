import { execSync } from "child_process";
import { readFileSync, existsSync, unlinkSync } from "fs";
import { resolve } from "path";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const version = pkg.version;
const zipName = `x-toolkit-extension-v${version}.zip`;
const outputPath = resolve(`../${zipName}`);

if (existsSync(outputPath)) unlinkSync(outputPath);

execSync(
  `powershell -Command "Compress-Archive -Path 'dist\\*' -DestinationPath '${outputPath}'"`,
  { stdio: "inherit" }
);

console.log(`\n✓ Ready to upload: artifacts/${zipName}`);
