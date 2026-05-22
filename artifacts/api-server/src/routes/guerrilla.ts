import { Router } from 'express';
const router = Router();

const PROXY = (url: string) =>
  'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);

// Health check
router.get('/health', async (_req, res) => {
  try {
    const response = await fetch(PROXY('https://api.guerrillamail.com/ajax.php?f=get_email_address'));
    res.json({ ok: response.ok });
  } catch {
    res.json({ ok: false });
  }
});

// Get new email address
router.get('/new', async (req, res) => {
  try {
    const response = await fetch(PROXY(
      'https://api.guerrillamail.com/ajax.php?f=get_email_address'
    ));
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'GuerrillaMail unavailable' });
  }
});

// Set custom username
router.post('/set-user', async (req, res) => {
  try {
    const { user, sid_token } = req.body as { user: string; sid_token: string };
    const response = await fetch(PROXY(
      `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(user)}&sid_token=${encodeURIComponent(sid_token)}&lang=en`
    ));
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'GuerrillaMail unavailable' });
  }
});

// Get inbox
router.get('/inbox', async (req, res) => {
  try {
    const { sid_token, seq } = req.query as { sid_token?: string; seq?: string };
    const response = await fetch(PROXY(
      `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${encodeURIComponent(sid_token ?? '')}&seq=${encodeURIComponent(seq ?? '0')}`
    ));
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'GuerrillaMail unavailable' });
  }
});

// Get single message
router.get('/message/:id', async (req, res) => {
  try {
    const { sid_token } = req.query as { sid_token?: string };
    const response = await fetch(PROXY(
      `https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${encodeURIComponent(req.params.id)}&sid_token=${encodeURIComponent(sid_token ?? '')}`
    ));
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'GuerrillaMail unavailable' });
  }
});

export default router;
