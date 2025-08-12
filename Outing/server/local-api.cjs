// Lightweight local API for Vite dev. Serves /api/generate without exposing API key to browser.
// Requires: GEMINI_API_KEY in process.env, Node 18+ (global fetch)
try {
  require('dotenv').config();
} catch (_) {
  // dotenv not installed; environment variables must be provided by the shell
}
const http = require('node:http');

const PORT = process.env.PORT || 8787;

function send(res, status, data, headers = {}) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', ...headers });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (req.url === '/api/generate' && req.method === 'POST') {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return send(res, 500, { error: 'Server misconfigured: GEMINI_API_KEY missing' });

      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const bodyStr = Buffer.concat(chunks).toString();
      const body = bodyStr ? JSON.parse(bodyStr) : {};
      const { prompt } = body || {};
      if (!prompt || typeof prompt !== 'string') return send(res, 400, { error: 'Invalid prompt' });

      const r = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const text = await r.text();
      if (!r.ok) {
        console.error('[local-api] Upstream Gemini error', r.status, text);
      }
      try {
        const json = JSON.parse(text);
        return send(res, r.status, json);
      } catch (_) {
        return send(res, r.status, { raw: text });
      }
    } catch (e) {
      console.error('[local-api] Internal error:', e);
      return send(res, 500, { error: 'Internal error' });
    }
  }

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`[local-api] listening on http://localhost:${PORT}`);
});
