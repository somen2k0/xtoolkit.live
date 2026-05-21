import { checkEnv } from "./lib/env-check";
import app from "./app";
import { logger } from "./lib/logger";

// Validate environment variables before anything else.
// Crashes with a clear error message if required vars are missing.
checkEnv();

// FIXED: AI tools - startup check for GROQ_API_KEY presence
console.log("GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
