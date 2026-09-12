export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'POST only' });
  try {
    const { to, subject, text, html } = req.body || {};
    if (!to || !subject || (!text && !html)) return res.status(400).json({ ok:false, error:'to, subject and text/html are required' });
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
      return res.status(503).json({ ok:false, error:'Email backend is not configured. Add RESEND_API_KEY and RESEND_FROM in Vercel Environment Variables.' });
    }
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({ from:process.env.RESEND_FROM, to:[to], subject, text, html })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ ok:false, error:data?.message || 'Resend rejected the email' });
    return res.status(200).json({ ok:true, id:data.id });
  } catch (e) { return res.status(500).json({ ok:false, error:'Email service error' }); }
}
