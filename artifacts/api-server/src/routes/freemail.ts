import { Router } from 'express';
const router = Router();

const MAILTM_BASE = 'https://api.mail.tm';
const MAILGW_BASE = 'https://api.mail.gw';

const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

router.get('/domains', (_req, res) => {
  res.json([
    { domain: 'mail.gw', provider: 'mailgw' },
  ]);
});

router.get('/new', async (req, res) => {
  try {
    const provider = (req.query.provider as string) || 'mailtm';
    const base = provider === 'mailgw' ? MAILGW_BASE : MAILTM_BASE;

    const domainsRes = await fetch(`${base}/domains`, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
    const domainsData = await domainsRes.json() as { 'hydra:member'?: { domain: string }[] };
    const available = domainsData['hydra:member'] ?? [];
    if (!available.length) throw new Error('No domains available');

    const domain = available[0].domain;
    const login = Math.random().toString(36).substring(2, 10);
    const address = `${login}@${domain}`;
    const password = Math.random().toString(36).substring(2, 15) + 'A1!';

    const createRes = await fetch(`${base}/accounts`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ address, password }),
      signal: AbortSignal.timeout(8000),
    });
    if (!createRes.ok) {
      const err = await createRes.json() as { 'hydra:description'?: string };
      throw new Error(err['hydra:description'] || 'Account creation failed');
    }

    const tokenRes = await fetch(`${base}/token`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ address, password }),
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenRes.ok) throw new Error('Token fetch failed');
    const tokenData = await tokenRes.json() as { token?: string };
    if (!tokenData.token) throw new Error('No token returned');

    res.json({ address, token: tokenData.token, provider });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/inbox', async (req, res) => {
  try {
    const { token, provider } = req.query as { token?: string; provider?: string };
    const base = provider === 'mailgw' ? MAILGW_BASE : MAILTM_BASE;
    const r = await fetch(`${base}/messages`, {
      headers: { ...HEADERS, Authorization: `Bearer ${token ?? ''}` },
      signal: AbortSignal.timeout(8000),
    });
    const data = await r.json() as { 'hydra:member'?: unknown[] };
    res.json(data['hydra:member'] ?? []);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/message/:id', async (req, res) => {
  try {
    const { token, provider } = req.query as { token?: string; provider?: string };
    const base = provider === 'mailgw' ? MAILGW_BASE : MAILTM_BASE;
    const r = await fetch(`${base}/messages/${req.params.id}`, {
      headers: { ...HEADERS, Authorization: `Bearer ${token ?? ''}` },
      signal: AbortSignal.timeout(8000),
    });
    const data = await r.json() as {
      id?: string;
      from?: unknown;
      subject?: string;
      createdAt?: string;
      html?: string[];
      text?: string;
    };
    const htmlBody = data.html?.[0] ?? "";
    const body = htmlBody || data.text || "";
    const isHtml = !!htmlBody;
    res.json({
      id: data.id,
      from: data.from,
      subject: data.subject,
      date: data.createdAt,
      body,
      isHtml,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
