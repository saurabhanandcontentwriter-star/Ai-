export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'POST only' });
  try {
    const { text, visibility='PUBLIC' } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ ok:false, error:'Post text is required' });
    if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_AUTHOR_URN) {
      return res.status(503).json({ ok:false, error:'LinkedIn backend is not configured. Add LINKEDIN_ACCESS_TOKEN and LINKEDIN_AUTHOR_URN in Vercel Environment Variables.' });
    }
    const r = await fetch('https://api.linkedin.com/rest/posts', {
      method:'POST',
      headers:{
        'Authorization':`Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type':'application/json',
        'X-Restli-Protocol-Version':'2.0.0',
        'LinkedIn-Version':process.env.LINKEDIN_VERSION || '202601'
      },
      body:JSON.stringify({author:process.env.LINKEDIN_AUTHOR_URN,commentary:text,visibility,lifecycleState:'PUBLISHED',distribution:{feedDistribution:'MAIN_FEED',targetEntities:[],thirdPartyDistributionChannels:[]}})
    });
    const data = await r.text();
    if (!r.ok) return res.status(r.status).json({ ok:false, error:data || 'LinkedIn rejected the post' });
    return res.status(200).json({ ok:true, id:r.headers.get('x-restli-id') || null });
  } catch (e) { return res.status(500).json({ ok:false, error:'LinkedIn service error' }); }
}
