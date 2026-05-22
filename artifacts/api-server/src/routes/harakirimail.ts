import { Router } from 'express';
const router = Router();

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchWithFallback(url: string): Promise<unknown> {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
      if (res.ok) return await res.json();
    } catch { continue; }
  }
  throw new Error('All proxies failed');
}

// Health check
router.get('/health', async (_req, res) => {
  try {
    await fetchWithFallback('https://www.harakirimail.com/api/v1/inbox/new');
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

// Get new inbox
router.get('/new', async (_req, res) => {
  try {
    const data = await fetchWithFallback('https://www.harakirimail.com/api/v1/inbox/new');
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Harakirimail unavailable' });
  }
});

// Get inbox messages
router.get('/inbox', async (req, res) => {
  try {
    const { token } = req.query as { token?: string };
    const data = await fetchWithFallback(
      `https://www.harakirimail.com/api/v1/inbox?token=${encodeURIComponent(token ?? '')}`
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Harakirimail unavailable' });
  }
});

// Get single message
router.get('/message/:id', async (req, res) => {
  try {
    const { token } = req.query as { token?: string };
    const data = await fetchWithFallback(
      `https://www.harakirimail.com/api/v1/inbox/${encodeURIComponent(req.params.id)}?token=${encodeURIComponent(token ?? '')}`
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Harakirimail unavailable' });
  }
});

export default router;
