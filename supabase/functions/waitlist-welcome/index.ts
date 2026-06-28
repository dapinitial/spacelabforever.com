// waitlist-welcome — sends a branded "you're on the list" email via Resend.
// Triggered by a Supabase Database Webhook on INSERT into public.waitlist.
// The Resend key lives in Supabase secrets (RESEND_API_KEY) — never in the repo.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM = "SuperAudio <us@spacelabforever.com>";

const html = `<!doctype html><html><body style="margin:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;color:#ececf1">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#14141c;border:1px solid #23232e;border-radius:18px;overflow:hidden">
        <tr><td style="padding:36px 36px 8px">
          <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#ff6a3d;font-weight:700">SuperAudio</div>
          <h1 style="margin:14px 0 0;font-size:26px;line-height:1.2;color:#fff">You're on the list. 🎧</h1>
        </td></tr>
        <tr><td style="padding:14px 36px 8px;font-size:15px;line-height:1.6;color:#c9c9d4">
          <p style="margin:0 0 14px">Thanks for signing up. Here's our promise: <strong style="color:#ececf1">exactly two emails, ever</strong> — one when the Mac beta opens, and one at launch. No newsletter, no marketing, no nonsense.</p>
          <p style="margin:0 0 8px">Then you'll have every speaker in your house playing in sync — <em>including the old AirPlay&nbsp;1 and Sonos ones the modern ecosystem forgot.</em></p>
        </td></tr>
        <tr><td style="padding:18px 36px 36px">
          <a href="https://spacelabforever.com" style="display:inline-block;background:#ff6a3d;color:#fff;text-decoration:none;font-weight:600;padding:11px 18px;border-radius:10px;font-size:14px">spacelabforever.com</a>
        </td></tr>
      </table>
      <div style="max-width:480px;color:#5a5a66;font-size:12px;margin-top:18px;line-height:1.5">You're receiving this because you joined the SuperAudio waitlist at spacelabforever.com.</div>
    </td></tr>
  </table>
</body></html>`;

const text =
  "You're on the SuperAudio list.\n\n" +
  "Our promise: exactly two emails, ever — one when the Mac beta opens, one at launch. No newsletter, no nonsense.\n\n" +
  "Every speaker in your house, in sync — including the old AirPlay 1 and Sonos ones the modern ecosystem forgot.\n\n" +
  "spacelabforever.com";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    // Supabase DB webhook payload: { type, table, record, old_record }
    const email = body?.record?.email ?? body?.email;
    if (!email) return new Response(JSON.stringify({ error: "no email in payload" }), { status: 400 });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: "You're on the SuperAudio list 🎧",
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ error: "resend failed", detail }), { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
