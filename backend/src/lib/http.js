const MAX_BODY_BYTES = 1024 * 1024; // 1MB

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text ? JSON.parse(text) : {});
      } catch {
        reject(Object.assign(new Error('Malformed JSON body'), { statusCode: 400 }));
      }
    });
    req.on('error', reject);
  });
}

export function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(payload);
}

export function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
}

// SameSite=None (not Lax): the frontend and backend are commonly deployed
// on two different hosts (e.g. two separate onrender.com services), which
// browsers treat as cross-site even though both are ours. A Lax cookie is
// stored fine on login but is withheld from the cross-site fetch calls the
// SPA makes right after — the browser silently drops every authenticated
// request, which looks like "login does nothing". None requires Secure
// (always true below), so this is safe, and it also works unchanged when
// frontend and backend share an origin (local dev via the Vite proxy).
export function serializeCookie(name, value, { maxAgeSeconds, httpOnly = true, secure = true } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'SameSite=None'];
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  if (typeof maxAgeSeconds === 'number') parts.push(`Max-Age=${maxAgeSeconds}`);
  return parts.join('; ');
}

export function clearCookie(name, opts = {}) {
  return serializeCookie(name, '', { ...opts, maxAgeSeconds: 0 });
}

// res.setHeader('Set-Cookie', ...) only accepts ONE string or an array;
// calling it twice with a string overwrites rather than appends, which
// would silently drop the csrf cookie. Always go through this helper.
export function appendSetCookie(res, cookie) {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', [cookie]);
  } else if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookie]);
  } else {
    res.setHeader('Set-Cookie', [existing, cookie]);
  }
}
