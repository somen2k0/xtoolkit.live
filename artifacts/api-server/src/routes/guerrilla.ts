import { Router } from 'express';
const router = Router();

const BASE = 'https://api.guerrillamail.com/ajax.php';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.guerrillamail.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
};

router.get('/health', async (_req, res) => {
  try {
    const r = await fetch(`${BASE}?f=get_email_address&lang=en`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(10000),
    });
    res.json({ ok: r.ok });
  } catch {
    res.json({ ok: false });
  }
});

router.get('/new', async (_req, res) => {
  try {
    console.log('Calling GuerrillaMail /new...');
    const r = await fetch(`${BASE}?f=get_email_address&lang=en`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(10000),
    });
    console.log('GuerrillaMail response status:', r.status);
    const data = await r.json() as Record<string, unknown>;
    console.log('GuerrillaMail data keys:', Object.keys(data));
    res.json(data);
  } catch (e: any) {
    console.error('GuerrillaMail /new error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

router.post('/set-user', async (req, res) => {
  try {
    const { user, sid_token, domain } = req.body as { user: string; sid_token: string; domain?: string };
    const domainParam = domain ? `&domain=${encodeURIComponent(domain)}` : '';
    const r = await fetch(
      `${BASE}?f=set_email_user&email_user=${encodeURIComponent(user)}&sid_token=${sid_token}&lang=en${domainParam}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) },
    );
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/inbox', async (req, res) => {
  try {
    const { sid_token, seq } = req.query as { sid_token?: string; seq?: string };
    const r = await fetch(
      `${BASE}?f=get_email_list&offset=0&sid_token=${sid_token ?? ''}&seq=${seq ?? '0'}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) },
    );
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/message/:id', async (req, res) => {
  try {
    const { sid_token } = req.query as { sid_token?: string };
    const r = await fetch(
      `${BASE}?f=fetch_email&email_id=${req.params.id}&sid_token=${sid_token ?? ''}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) },
    );
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
