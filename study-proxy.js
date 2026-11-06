const http = require('node:http');
const { spawn } = require('node:child_process');

if (process.env.LOCAL_CVE_MODE !== '1') {
  throw new Error('study-proxy.js is available only with LOCAL_CVE_MODE=1');
}

const next = spawn(process.execPath, [
  'node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3001',
], { env: process.env, stdio: 'inherit' });

// This local reverse proxy models a shared storefront cache that keys by URL
// but does not distinguish the HTML and RSC representations of that URL.
const cache = new Map();
const storefront = /^\/(?:products|(?:us|eu|vn)\/products)\/?$/;

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', 'http://localhost:3000');
  const cacheable = request.method === 'GET' && storefront.test(url.pathname)
    && !(request.headers.cookie || '').includes('minishop_session=');
  const key = `${url.pathname}${url.search}`;
  const cached = cacheable ? cache.get(key) : null;
  if (cached) {
    response.writeHead(cached.status, cached.headers);
    response.end(cached.body);
    return;
  }

  const upstream = http.request({
    hostname: '127.0.0.1', port: 3001, method: request.method,
    path: request.url, headers: request.headers,
  }, (incoming) => {
    if (!cacheable) {
      response.writeHead(incoming.statusCode || 502, incoming.headers);
      incoming.pipe(response);
      return;
    }

    const chunks = [];
    incoming.on('data', chunk => chunks.push(chunk));
    incoming.on('end', () => {
      const body = Buffer.concat(chunks);
      const headers = { ...incoming.headers };
      delete headers['transfer-encoding'];
      headers['content-length'] = String(body.length);
      const status = incoming.statusCode || 502;
      if (status === 200 && body.length <= 2_000_000) {
        const sharedHeaders = { ...headers };
        delete sharedHeaders['set-cookie'];
        cache.set(key, { status, headers: sharedHeaders, body });
      }
      response.writeHead(status, headers);
      response.end(body);
    });
  });

  upstream.on('error', () => {
    if (!response.headersSent) response.writeHead(502);
    response.end('Storefront unavailable');
  });
  request.pipe(upstream);
});

server.listen(3000, '127.0.0.1');
next.on('exit', (code) => { server.close(); process.exitCode = code || 0; });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { server.close(); next.kill(signal); });
}
