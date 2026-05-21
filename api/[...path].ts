console.log('=== VERCEL FUNCTION STARTING ===');
console.log('NODE_ENV:', process.env['NODE_ENV']);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;

try {
  console.log('Importing Express app from handler.mjs...');
  // Dynamic import prevents @vercel/node from re-bundling the pre-built esbuild
  // output. The pre-built handler.mjs is a self-contained bundle that includes
  // all dependencies; re-bundling it causes pino worker files to be lost.
  const mod = await import('../artifacts/api-server/dist/handler.mjs');
  app = mod.default;
  console.log('Express app imported successfully');
} catch (err) {
  console.error('STARTUP CRASH:', err);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (!app) {
    return res.status(500).json({
      error: 'Server failed to start',
      hint: 'Check Vercel function logs for STARTUP CRASH message',
    });
  }
  return app(req, res);
}
