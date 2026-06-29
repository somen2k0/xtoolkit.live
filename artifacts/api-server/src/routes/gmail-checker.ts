import { Router, type IRouter } from "express";
import net from "net";

const router: IRouter = Router();

const GMAIL_MX = "aspmx.l.google.com";

const GMAIL_LOCAL_RE = /^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*$/;

function validateGmailFormat(email: string): boolean {
  const lower = email.toLowerCase();
  if (!lower.endsWith("@gmail.com")) return false;
  const local = lower.slice(0, -10);
  if (local.length < 6 || local.length > 30) return false;
  if (!GMAIL_LOCAL_RE.test(local)) return false;
  return true;
}

async function smtpCheck(
  email: string
): Promise<"valid" | "invalid" | "disabled" | "unknown"> {
  if (!validateGmailFormat(email)) return "invalid";

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve("unknown");
    }, 10000);

    const socket = net.createConnection(25, GMAIL_MX);
    let stage = 0;
    let buffer = "";

    socket.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\r\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const code = parseInt(line.substring(0, 3));
        if (isNaN(code)) continue;

        if (stage === 0 && code === 220) {
          socket.write("EHLO mail.xtoolkit.live\r\n");
          stage = 1;
        } else if (stage === 1 && (code === 250 || line.startsWith("250"))) {
          if (!line.startsWith("250-")) {
            socket.write("MAIL FROM:<verify@xtoolkit.live>\r\n");
            stage = 2;
          }
        } else if (stage === 2 && code === 250) {
          socket.write(`RCPT TO:<${email}>\r\n`);
          stage = 3;
        } else if (stage === 3) {
          clearTimeout(timeout);
          socket.write("QUIT\r\n");
          socket.destroy();
          if (code === 250 || code === 251) {
            resolve("valid");
          } else if (code === 550 || code === 551 || code === 553) {
            if (line.toLowerCase().includes("disabled")) {
              resolve("disabled");
            } else {
              resolve("invalid");
            }
          } else if (code === 552 || code === 554) {
            resolve("disabled");
          } else {
            resolve("unknown");
          }
        }
      }
    });

    socket.on("error", () => {
      clearTimeout(timeout);
      resolve("unknown");
    });
  });
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
      status: await smtpCheck(email),
    }))
  );

  res.json({ results });
});

export default router;
