const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // HTTP Forward Proxy (CONNECT method for HTTPS)
  if (req.method === 'CONNECT') {
    const [host, port] = req.url.split(':');
    const targetPort = parseInt(port) || 443;

    const socket = require('net').connect(targetPort, host, () => {
      res.writeHead(200, { 'Connection': 'keep-alive' });
      res.flushHeaders();
      req.pipe(socket);
      socket.pipe(res);
    });

    socket.on('error', (err) => {
      res.writeHead(502);
      res.end('Proxy Error: ' + err.message);
    });
    return;
  }

  // HTTP Forward Proxy (plain HTTP)
  try {
    const targetUrl = new URL(req.url);
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 80,
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: { ...req.headers, host: targetUrl.host }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.writeHead(502);
      res.end('Proxy Error: ' + err.message);
    });

    req.pipe(proxyReq);
  } catch (err) {
    res.writeHead(400);
    res.end('Bad Request');
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Forward Proxy running on port ${PORT}`);
});
