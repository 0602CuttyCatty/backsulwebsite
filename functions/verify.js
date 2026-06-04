/* ═══════════════════════════════════════════
   functions/verify.js
   Cloudflare Pages Function
   - POST /verify  { password }        → { ok: true/false }
   - POST /verify  { action: 'sign' }  → Cloudinary 서명 (Signed 방식 쓸 때)
═══════════════════════════════════════════ */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: corsHeaders,
    });
  }

  /* ── 비밀번호 검증 ── */
  if (body.password !== undefined) {
    const ok = body.password === env.GALLERY_PASSWORD;
    return new Response(JSON.stringify({ ok }), {
      status: 200, headers: corsHeaders,
    });
  }

  /* ── Cloudinary 서명 (Signed 업로드 쓸 경우 대비) ── */
  if (body.action === 'sign') {
    const timestamp  = Math.floor(Date.now() / 1000);
    const folder     = body.folder || 'summer-gallery';
    const apiSecret  = env.CLOUDINARY_API_SECRET;
    const apiKey     = env.CLOUDINARY_API_KEY;
    const cloudName  = env.CLOUDINARY_CLOUD_NAME;

    // SHA-1 서명: "folder=...&timestamp=...{secret}"
    const strToSign  = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature  = await sha1(strToSign);

    return new Response(JSON.stringify({
      signature, timestamp, apiKey, cloudName, folder,
    }), { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), {
    status: 400, headers: corsHeaders,
  });
}

// OPTIONS preflight 대응
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/* ── SHA-1 헬퍼 (Web Crypto API) ── */
async function sha1(message) {
  const encoder = new TextEncoder();
  const data     = encoder.encode(message);
  const hashBuf  = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}