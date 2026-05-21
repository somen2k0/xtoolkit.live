// @ts-ignore
import handler from "../artifacts/api-server/dist/handler.mjs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;

async function loadApp() {
  if (!app) {
    try {
      // @ts-ignore
      const mod = await import("../artifacts/api-server/dist/handler.mjs");
      app = mod.default;
    } catch (err: any) {
      console.error("STARTUP CRASH:", err?.message, err?.stack);
    }
  }
  return app;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const expressApp = await loadApp();
  if (!expressApp) {
    return res.status(500).json({
      error: "Server failed to initialize",
      hint: "Check Vercel function logs for STARTUP CRASH"
    });
  }
  return expressApp(req, res);
}
