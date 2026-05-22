import { Router, type IRouter } from "express";
import { aiRateLimiter } from "../middlewares/security";
import {
  aiDailyRateLimiter,
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
import tempmailGuerrillaRouter from "./tempmail-guerrilla";
import tempmailOnesecmailRouter from "./tempmail-onesecmail";
import tempmailFreemailRouter from "./tempmail-freemail";
import tempmailMailgwRouter from "./tempmail-mailgw";
import tempmailTemptfRouter from "./tempmail-temptf";

const router: IRouter = Router();

router.use(healthRouter);
router.use(accountsRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(brandingRouter);
router.use(analyticsRouter);
router.use(ogPreviewRouter);
router.use(tempmailGuerrillaRouter);
router.use(tempmailOnesecmailRouter);
router.use(tempmailFreemailRouter);
router.use(tempmailMailgwRouter);
router.use(tempmailTemptfRouter);

// ─── AI routes — full protection stack ────────────────────────────────────────
// Layer 1: 5 req/IP/hour     (express-rate-limit, standardHeaders)
// Layer 2: 50 req/IP/day     (Map-based custom limiter)
// Layer 3: input validation  (500 chars, HTML strip, prompt-injection block)
// Layer 4: response cache    (in-memory 1-hour, saves API cost on repeated inputs)
// Layer 5: usage logger      (logs every call + alerts on spikes)
const aiProtection = [
  aiRateLimiter,
  aiDailyRateLimiter,
  aiInputValidator,
  aiResponseCache,
  logAiUsage,
];

// Bio generation must NOT be cached — every request must hit Groq to return
// unique bios. Caching is intentionally omitted from this stack.
const aiProtectionNoCache = [
  aiRateLimiter,
  aiDailyRateLimiter,
  aiInputValidator,
  logAiUsage,
];

router.use(...aiProtectionNoCache, bioRouter);
router.use(...aiProtection, aiDetectorRouter);

export default router;
