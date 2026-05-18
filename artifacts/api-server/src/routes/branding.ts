import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_PUBLIC = path.resolve(__dirname, "../../x-checker/public");
const EXT_ICONS = path.resolve(__dirname, "../../x-toolkit-extension/public/icons");

const ALLOWED_ASSETS: Record<string, string> = {
  "favicon.ico": FRONTEND_PUBLIC,
  "favicon.svg": FRONTEND_PUBLIC,
  "favicon-48.png": FRONTEND_PUBLIC,
  "favicon-192.png": FRONTEND_PUBLIC,
  "favicon-512.png": FRONTEND_PUBLIC,
  "opengraph.png": FRONTEND_PUBLIC,
  "opengraph.jpg": FRONTEND_PUBLIC,
  "icon16.png": EXT_ICONS,
  "icon32.png": EXT_ICONS,
  "icon48.png": EXT_ICONS,
  "icon128.png": EXT_ICONS,
};

function checkAuth(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return req.headers["x-admin-password"] === adminPassword;
}

router.get("/admin/branding/assets", (req, res) => {
  if (!checkAuth(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const assets = Object.keys(ALLOWED_ASSETS).map((filename) => {
    const dir = ALLOWED_ASSETS[filename]!;
    const filePath = path.join(dir, filename);
    const exists = fs.existsSync(filePath);
    let updatedAt: string | null = null;
    if (exists) {
      try {
        updatedAt = fs.statSync(filePath).mtime.toISOString();
      } catch { /* ignore */ }
    }
    return { filename, exists, updatedAt };
  });

  res.json({ assets });
});

router.post("/admin/branding/upload", upload.single("file"), (req, res) => {
  if (!checkAuth(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const filename = (req.body as { filename?: string }).filename ?? "";
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  if (!filename || !(filename in ALLOWED_ASSETS)) {
    res.status(400).json({ error: "Invalid target filename." });
    return;
  }

  const destDir = ALLOWED_ASSETS[filename]!;
  const destPath = path.join(destDir, filename);

  try {
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destPath, file.buffer);
    res.json({ ok: true, filename });
  } catch (err) {
    res.status(500).json({ error: "Failed to save file." });
  }
});

export default router;
