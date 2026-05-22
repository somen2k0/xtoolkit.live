import { Router } from 'express';
const router = Router();

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${url}`,
];

async function fetchWithFallback(url: string): Promise<unknown> {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const text = await res.text();
        return JSON.parse(text);
      }
    } catch (e) {
      continue;
    }
  }
  throw new Error('All proxies failed');
}

const FALLBACK_DOMAINS = [
  '1secmail.com', '1secmail.net', '1secmail.org',
  'wwjmp.com', 'esiix.com', 'xojxe.com', 'yoggm.com'
];

// Get domains
router.get('/domains', async (_req, res) => {
  try {
    const data = await fetchWithFallback('https://www.1secmail.com/api/v1/?action=getDomainList');
    res.json(Array.isArray(data) && (data as string[]).length ? data : FALLBACK_DOMAINS);
  } catch {
    res.json(FALLBACK_DOMAINS);
  }
});

// Health check
router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Create new inbox (accepts optional ?domain= to pin the domain)
router.get('/new', (req, res) => {
  try {
    const { domain: requestedDomain } = req.query as { domain?: string };
    const login = Math.random().toString(36).substring(2, 10);
    const domain = (requestedDomain && FALLBACK_DOMAINS.includes(requestedDomain))
      ? requestedDomain
      : FALLBACK_DOMAINS[Math.floor(Math.random() * FALLBACK_DOMAINS.length)]!;
    res.json({ login, domain, address: `${login}@${domain}` });
  } catch {
    res.status(500).json({ error: '1secmail unavailable' });
  }
});

// Set custom address
router.post('/set-address', (req, res) => {
  try {
    const { login, domain } = req.body as { login: string; domain: string };
    res.json({ login, domain, address: `${login}@${domain}` });
  } catch {
    res.status(500).json({ error: '1secmail unavailable' });
  }
});

// Get inbox
router.get('/inbox', async (req, res) => {
  try {
    const { login, domain } = req.query as { login?: string; domain?: string };
    const data = await fetchWithFallback(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${encodeURIComponent(login ?? '')}&domain=${encodeURIComponent(domain ?? '')}`
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: '1secmail unavailable' });
  }
});

// Get single message
router.get('/message/:id', async (req, res) => {
  try {
    const { login, domain } = req.query as { login?: string; domain?: string };
    const data = await fetchWithFallback(
      `https://www.1secmail.com/api/v1/?action=readMessage&login=${encodeURIComponent(login ?? '')}&domain=${encodeURIComponent(domain ?? '')}&id=${encodeURIComponent(req.params.id)}`
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: '1secmail unavailable' });
  }
});

export default router;
