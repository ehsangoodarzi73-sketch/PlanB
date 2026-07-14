const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Universal HTTP Proxy — همه ترافیک رو فوروارد میکنه
app.use('/', createProxyMiddleware({
  target: 'http://placeholder', // تغییر نمیکنه
  changeOrigin: true,
  router: (req) => {
    // هاست مورد نظر از هدر خوانده میشه
    const target = req.headers['x-target-host'] || req.query.target;
    if (target) {
      return `https://${target}`;
    }
    return 'https://httpbin.org'; // fallback
  },
  on: {
    proxyReq: (proxyReq, req) => {
      // اگه x-target-host هست، هاست اصلی رو بذار
      const targetHost = req.headers['x-target-host'];
      if (targetHost) {
        proxyReq.setHeader('host', targetHost);
      }
    },
    proxyRes: (proxyRes) => {
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-headers'] = '*';
    }
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Universal Proxy running on port ${PORT}`);
});
