// @ts-ignore
import handler from "../artifacts/api-server/dist/handler.mjs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// When GMAIL_API_URL is set (e.g. https://xtoolkit-api.fly.dev), gmail-checker
// requests are forwarded to that host instead of running locally — because
// Vercel blocks outbound TCP port 25 (SMTP) but Fly.io allows it.
const GMAIL_API_URL = process.env.GMAIL_API_URL?.replace(/\/$/, "");

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
  // ── Proxy gmail-checker to Fly.io (port 25 is blocked on Vercel) ────────────
  if (GMAIL_API_URL && req.url?.includes("/gmail-checker/")) {
    try {
      const targetUrl = `${GMAIL_API_URL}${req.url}`;
      const upstream = await fetch(targetUrl, {
        method: req.method ?? "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
        signal: AbortSignal.timeout(30_000),
      });

      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch (err: any) {
      res.status(502).json({
        error: "Gmail checker upstream error",
        detail: err?.message ?? "Unknown error",
      });
    }
    return;
  }

  // ── All other routes handled by the Express app ──────────────────────────────
  const expressApp = await loadApp();
  if (!expressApp) {
    return res.status(500).json({
      error: "Server failed to initialize",
      hint: "Check Vercel function logs for STARTUP CRASH"
    });
  }
  return expressApp(req, res);
}
