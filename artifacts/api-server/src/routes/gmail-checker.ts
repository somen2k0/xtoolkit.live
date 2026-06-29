import { Router, type IRouter } from "express";

const router: IRouter = Router();

const GMAIL_LOCAL_RE = /^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*$/;

function validateGmailFormat(email: string): boolean {
  const lower = email.toLowerCase();
  if (!lower.endsWith("@gmail.com")) return false;
  const local = lower.slice(0, -10); // strip @gmail.com
  if (local.length < 6 || local.length > 30) return false;
  if (!GMAIL_LOCAL_RE.test(local)) return false;
  return true;
}

async function checkGmailExists(
  email: string
): Promise<"valid" | "invalid" | "unknown"> {
  if (!validateGmailFormat(email)) return "invalid";

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 6000);

    const url = `https://mail.google.com/mail/gxlu?email=${encodeURIComponent(email.toLowerCase())}`;
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(tid);

    // Valid account: Google sets GMAIL_AT cookie and returns 200
    if (res.status === 200) {
      const cookie = res.headers.get("set-cookie") ?? "";
      if (cookie.includes("GMAIL_AT")) return "valid";
      // 200 without cookie = account doesn't exist
      return "invalid";
    }

    // Redirect (302/307): valid account — Google redirects to sign-in
    if (res.status === 302 || res.status === 307) {
      const loc = res.headers.get("location") ?? "";
      // Redirect to accounts.google.com = account exists
      if (loc.includes("accounts.google.com") || loc.includes("checkCookie")) {
        return "valid";
      }
      return "unknown";
    }

    // 404 = account does not exist
    if (res.status === 404) return "invalid";

    return "unknown";
  } catch {
    return "unknown";
  }
}

router.post("/gmail-checker/check", async (req, res) => {
  const { emails } = req.body as { emails?: unknown };

  if (!Array.isArray(emails) || emails.length === 0) {
    res.status(400).json({ error: "emails array is required" });
    return;
  }
  if (emails.length > 50) {
    res.status(400).json({ error: "Maximum 50 emails per request" });
    return;
  }

  const sanitized: string[] = emails
    .map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
    .filter(Boolean);

  const results = await Promise.all(
    sanitized.map(async (email) => ({
      email,
      status: await checkGmailExists(email),
    }))
  );

  res.json({ results });
});

export default router;
