// Cloudflare Pages Function: POST /api/contact
// The destination email lives only in the TO_EMAIL environment variable,
// so it never appears in the page or the repo.
export async function onRequestPost({ request, env }) {
  const json = (o, s = 200) =>
    new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }

  if (d.website) return json({ ok: true }); // honeypot: bots fill this hidden field

  const clean = (v, n) => String(v ?? '').trim().slice(0, n);
  const f = {
    org: clean(d.org, 150), country: clean(d.country, 80), area: clean(d.area, 60),
    email: clean(d.email, 150), amt: clean(d.amt, 12), p: clean(d.p, 3000)
  };
  if (!f.org || !f.p || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return json({ ok: false, error: 'Please enter your organisation, a valid email and a project description.' }, 400);
  }
  if (!env.RESEND_API_KEY || !env.TO_EMAIL) return json({ ok: false, error: 'Form is not configured yet.' }, 500);

  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const html = `<h2>New concept note</h2>
<p><b>Organisation:</b> ${esc(f.org)}<br><b>Country:</b> ${esc(f.country)}<br><b>Focus:</b> ${esc(f.area)}<br>
<b>Email:</b> ${esc(f.email)}<br><b>Amount (USD):</b> ${esc(f.amt)}</p>
<p>${esc(f.p).replace(/\n/g, '<br>')}</p>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.FROM_EMAIL || 'onboarding@resend.dev',
      to: [env.TO_EMAIL],
      reply_to: f.email,
      subject: `New concept note: ${f.org}`.replace(/[\r\n]+/g, ' '),
      html
    })
  });
  if (!r.ok) return json({ ok: false, error: 'Could not send right now. Please try again later.' }, 502);
  return json({ ok: true });
}
