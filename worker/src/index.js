// Siko waitlist endpoint.
//
// Accepts a form POST (or JSON) from trysiko.com with:
//   email   — required, validated for shape
//   company — honeypot, must be empty (bots fill it; humans don't see it)
//
// On success: adds the contact to the Resend "Waitlist" audience and sends
// a confirmation email. Returns { ok: true } as JSON. CORS is locked to the
// trysiko.com apex and www subdomain.
//
// Secrets (set via `wrangler secret put`):
//   RESEND_API_KEY      — re_… key with Full Access
//   RESEND_AUDIENCE_ID  — UUID of the "Waitlist" audience

const ALLOWED_ORIGINS = new Set([
  'https://trysiko.com',
  'https://www.trysiko.com',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pickOrigin(request) {
  const origin = request.headers.get('Origin');
  return ALLOWED_ORIGINS.has(origin) ? origin : 'https://trysiko.com';
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

async function readBody(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    return {
      email: (body.email || '').toString().trim(),
      honeypot: (body.company || '').toString().trim(),
    };
  }
  const form = await request.formData();
  return {
    email: (form.get('email') || '').toString().trim(),
    honeypot: (form.get('company') || '').toString().trim(),
  };
}

async function addToAudience(env, email) {
  const res = await fetch(
    `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    },
  );
  if (res.status >= 500) {
    console.error('resend audiences 5xx:', res.status, await res.text());
  }
}

async function sendConfirmation(env, email) {
  const body = [
    'thanks — you\'re on the siko waitlist.',
    '',
    'when your spot opens up, your first month is on me. siko is $20/month after that.',
    '',
    'talk soon.',
    '',
    '— rohan',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Siko <hi@trysiko.com>',
      to: email,
      subject: 'you\'re on the siko waitlist',
      text: body,
    }),
  });
  if (res.status >= 500) {
    console.error('resend emails 5xx:', res.status, await res.text());
  }
}

export default {
  async fetch(request, env) {
    const origin = pickOrigin(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method === 'GET') {
      return json({ name: 'siko-waitlist', status: 'ok' }, 200, origin);
    }

    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, origin);
    }

    let email, honeypot;
    try {
      ({ email, honeypot } = await readBody(request));
    } catch {
      return json({ error: 'bad_request' }, 400, origin);
    }

    // Honeypot: bots fill the hidden "company" field; humans don't see it.
    // Silently succeed so the bot doesn't learn the field is a tripwire.
    if (honeypot) {
      return json({ ok: true }, 200, origin);
    }

    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return json({ error: 'invalid_email' }, 400, origin);
    }

    // Best-effort: don't fail the user response if Resend hiccups.
    // Contact creation is idempotent (Resend dedupes by email).
    try { await addToAudience(env, email); } catch (err) { console.error('audience err:', err); }
    try { await sendConfirmation(env, email); } catch (err) { console.error('email err:', err); }

    return json({ ok: true }, 200, origin);
  },
};
