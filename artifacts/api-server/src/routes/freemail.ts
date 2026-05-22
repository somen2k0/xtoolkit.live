import { Router } from 'express';
const router = Router();

const PROXY = (url: string) =>
  'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);

const MAILGW = 'https://api.mail.gw';

const FALLBACK_DOMAINS = ['oakon.com', 'teihu.com'];

let cachedDomains: string[] = [];

async function getDomains(): Promise<string[]> {
  if (cachedDomains.length > 0) return cachedDomains;
  try {
    const response = await fetch(PROXY(`${MAILGW}/domains`));
    const data = await response.json() as Array<{ domain: string; isActive?: boolean }>;
    const active = data.filter(x => x.isActive !== false).map(x => x.domain);
    if (active.length > 0) cachedDomains = active;
    return active.length > 0 ? active : FALLBACK_DOMAINS;
  } catch {
    return FALLBACK_DOMAINS;
  }
}

// Get domains
router.get('/domains', async (req, res) => {
  try {
    const domains = await getDomains();
    res.json(domains);
  } catch {
    res.json(FALLBACK_DOMAINS);
  }
});

// Create new inbox — returns { email, login, domain, token }
router.get('/new', async (req, res) => {
  try {
    const domains = await getDomains();
    const { login: customLogin, domain: customDomain } = req.query as { login?: string; domain?: string };

    const login = customLogin ?? Math.random().toString(36).substring(2, 10);
    const domain = (customDomain && domains.includes(customDomain))
      ? customDomain
      : domains[Math.floor(Math.random() * domains.length)]!;

    const address = `${login}@${domain}`;
    const password = `Mx!${login.slice(0, 8)}9Zk`;

    // Create account (direct — POST with body, allorigins is GET-only)
    let actualAddress = address;
    let actualPassword = password;

    const ctrl1 = new AbortController();
    const t1 = setTimeout(() => ctrl1.abort(), 10000);
    let cr: Response;
    try {
      cr = await fetch(`${MAILGW}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ address, password }),
        signal: ctrl1.signal,
      });
    } finally {
      clearTimeout(t1);
    }

    if (cr.ok) {
      const cd = await cr.json() as { address?: string };
      if (cd.address) actualAddress = cd.address;
    } else {
      // Collision — try a fresh random login
      const altLogin = Math.random().toString(36).substring(2, 10);
      actualPassword = `Mx!${altLogin.slice(0, 8)}9Zk`;
      const ctrl2 = new AbortController();
      const t2 = setTimeout(() => ctrl2.abort(), 10000);
      let cr2: Response;
      try {
        cr2 = await fetch(`${MAILGW}/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ address: `${altLogin}@${domain}`, password: actualPassword }),
          signal: ctrl2.signal,
        });
      } finally {
        clearTimeout(t2);
      }
      if (!cr2.ok) { res.status(502).json({ error: 'Could not create inbox' }); return; }
      const cd2 = await cr2.json() as { address?: string };
      actualAddress = cd2.address ?? `${altLogin}@${domain}`;
    }

    const [actualLogin, actualDomain] = actualAddress.split('@') as [string, string];

    // Get JWT token (direct — POST)
    const ctrl3 = new AbortController();
    const t3 = setTimeout(() => ctrl3.abort(), 10000);
    let tr: Response;
    try {
      tr = await fetch(`${MAILGW}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ address: actualAddress, password: actualPassword }),
        signal: ctrl3.signal,
      });
    } finally {
      clearTimeout(t3);
    }

    if (!tr.ok) { res.status(502).json({ error: 'Could not authenticate' }); return; }
    const td = await tr.json() as { token?: string };
    if (!td.token) { res.status(502).json({ error: 'No token returned' }); return; }

    res.json({ email: actualAddress, login: actualLogin, domain: actualDomain ?? domain, token: td.token });
  } catch {
    res.status(502).json({ error: 'Provider temporarily unavailable' });
  }
});

// Get inbox (requires JWT token — direct fetch with Authorization header)
router.get('/inbox', async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) { res.status(400).json({ error: 'token required' }); return; }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    let r: Response;
    try {
      r = await fetch(`${MAILGW}/messages`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (r.status === 401) { res.status(401).json({ error: 'Session expired' }); return; }
    if (!r.ok) { res.status(502).json({ error: 'Provider temporarily unavailable' }); return; }
    type GwMsg = { id: string; from?: { address?: string; name?: string }; subject?: string; createdAt?: string };
    type GwResp = { 'hydra:member'?: GwMsg[] };
    const d = await r.json() as GwResp;
    const members = d['hydra:member'] ?? [];
    const msgs = members.map(m => ({
      id: m.id,
      from: m.from?.name ? `${m.from.name} <${m.from.address ?? ''}>` : (m.from?.address ?? ''),
      subject: m.subject ?? '',
      date: m.createdAt ?? '',
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(msgs);
  } catch {
    res.status(502).json({ error: 'Provider temporarily unavailable' });
  }
});

// Get single message (requires JWT token — direct fetch with Authorization header)
router.get('/message/:id', async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) { res.status(400).json({ error: 'token required' }); return; }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    let r: Response;
    try {
      r = await fetch(`${MAILGW}/messages/${encodeURIComponent(req.params.id)}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (r.status === 401) { res.status(401).json({ error: 'Session expired' }); return; }
    if (!r.ok) { res.status(502).json({ error: 'Message not found' }); return; }
    type GwFullMsg = { id: string; from?: { address?: string; name?: string }; subject?: string; createdAt?: string; html?: string[]; text?: string };
    const d = await r.json() as GwFullMsg;
    const htmlParts = d.html ?? [];
    const body = htmlParts.length > 0 ? htmlParts.join('') : (d.text ?? '');
    res.json({
      id: d.id,
      from: d.from?.name ? `${d.from.name} <${d.from.address ?? ''}>` : (d.from?.address ?? ''),
      subject: d.subject ?? '',
      date: d.createdAt ?? '',
      body,
      isHtml: htmlParts.length > 0,
    });
  } catch {
    res.status(502).json({ error: 'Provider temporarily unavailable' });
  }
});

export default router;
