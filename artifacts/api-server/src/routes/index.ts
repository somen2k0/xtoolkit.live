import { Router, type IRouter } from "express";
import {
  aiInputValidator,
  aiResponseCache,
  logAiUsage,
} from "../middlewares/ai-protection";
import healthRouter from "./health";
import accountsRouter from "./accounts";
import bioRouter from "./bio";
import contactRouter from "./contact";
import adminRouter from "./admin";
import brandingRouter from "./branding";
import analyticsRouter from "./analytics";
import ogPreviewRouter from "./og-preview";
import aiDetectorRouter from "./ai-detector";
import tempmailTemptfRouter from "./tempmail-temptf";
import guerrillaRouter from "./guerrilla";
import freemailRouter from "./freemail";
import onesecmailRouter from "./onesecmail";
import harakirimailRouter from "./harakirimail";
import gmailCheckerRouter from "./gmail-checker";
import resumeRouter from "./resume";

const router: IRouter = Router();

router.get("/groq-debug", (req, res) => {
  const pw = req.query["pw"];
  if (!pw || pw !== process.env.ADMIN_PASSWORD) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const raw = process.env.GROQ_API_KEY ?? "";
  const keys = raw.split(",").map((k) => k.trim()).filter(Boolean);
  res.json({
    totalKeys: keys.length,
    keyLengths: keys.map((k) => k.length),
    firstChars: keys.map((k) => k.substring(0, 8) + "..."),
  });
});

router.use(healthRouter);
router.use(accountsRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(brandingRouter);
router.use(analyticsRouter);
router.use(ogPreviewRouter);
router.use(tempmailTemptfRouter);
router.use('/guerrilla', guerrillaRouter);
router.use('/freemail', freemailRouter);
router.use('/onesecmail', onesecmailRouter);
router.use('/harakirimail', harakirimailRouter);
router.use(gmailCheckerRouter);

// ─── AI routes ────────────────────────────────────────────────────────────────
// Input validation, response cache (detector only), and usage logging.
// No per-IP rate limiting — Groq key exhaustion is the natural throttle.
const aiProtection = [
  aiInputValidator,
  aiResponseCache,
  logAiUsage,
];

// Bio generation must NOT be cached — every request must hit Groq to return
// unique bios. Caching is intentionally omitted from this stack.
const aiProtectionNoCache = [
  aiInputValidator,
  logAiUsage,
];

router.use(...aiProtectionNoCache, bioRouter);
router.use(...aiProtection, aiDetectorRouter);
router.use(...aiProtectionNoCache, resumeRouter);

export default router;
