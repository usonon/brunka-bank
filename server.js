import { createServer } from 'node:http';
import { openDb } from './db.js';
import { Router } from './router.js';
import { readJsonBody, sendJson, parseCookies } from './lib/http.js';
import { HttpError } from './lib/errors.js';
import { RateLimiter } from './lib/rateLimit.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerAccountRoutes } from './routes/accounts.js';
import { registerTransferRoutes } from './routes/transfers.js';

export function createApp({ dbPath, corsOrigin }) {
  const db = openDb(dbPath);
  const router = new Router();

  const limiters = {
    registerByIp: new RateLimiter(),
    loginByIp: new RateLimiter(),
    loginByEmail: new RateLimiter(),
    transfersByUser: new RateLimiter(),
  };

  registerAuthRoutes(router, { db, limiters });
  registerAccountRoutes(router, { db });
  registerTransferRoutes(router, { db, limiters });

  const sweepInterval = setInterval(() => {
    for (const limiter of Object.values(limiters)) limiter.sweep(60 * 60 * 1000);
  }, 10 * 60 * 1000);
  sweepInterval.unref?.();

  const server = createServer(async (req, res) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : null) || req.socket.remoteAddress || 'unknown';

    // Security headers on every response.
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');

    // CORS: only ever echo back the one explicitly configured origin,
    // never a wildcard, because credentials (cookies) are in play.
    const origin = req.headers.origin;
    if (origin && origin === corsOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key, X-CSRF-Token');
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const url = new URL(req.url, 'http://localhost');
      const match = router.match(req.method, url.pathname);
      if (!match) {
        sendJson(res, 404, { error: 'Not found' });
        return;
      }

      const body = req.method === 'POST' ? await readJsonBody(req) : {};
      const cookies = parseCookies(req);

      const result = await match.handler({
        req,
        res,
        params: match.params,
        query: url.searchParams,
        body,
        cookies,
        ip,
      });

      sendJson(res, result.status, result.body);
    } catch (err) {
      if (err instanceof HttpError) {
        sendJson(res, err.statusCode, { error: err.message });
        return;
      }
      // eslint-disable-next-line no-console
      console.error('Unhandled error:', err);
      sendJson(res, 500, { error: 'Internal server error' });
    }
  });

  return { server, db };
}

async function main() {
  const PORT = Number(process.env.PORT ?? 3001);
  const DB_PATH = process.env.DB_PATH ?? 'data/bank.db';
  const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

  const { server, db } = createApp({ dbPath: DB_PATH, corsOrigin: CORS_ORIGIN });

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Brunka Bank backend listening on http://localhost:${PORT} (CORS origin: ${CORS_ORIGIN})`);
  });

  const shutdown = () => {
    // eslint-disable-next-line no-console
    console.log('Shutting down...');
    server.close(() => {
      db.close();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main();
}
