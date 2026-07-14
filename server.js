const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Telegram API
app.use('/telegram', createProxyMiddleware({
  target: 'https://api.telegram.org',
  changeOrigin: true,
  pathRewrite: { '^/telegram': '' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
  }
}));

// OpenAI API
app.use('/openai', createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  pathRewrite: { '^/openai': '' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
  }
}));

// GitHub API
app.use('/github', createProxyMiddleware({
  target: 'https://api.github.com',
  changeOrigin: true,
  pathRewrite: { '^/github': '' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
  }
}));

// HuggingFace API
app.use('/huggingface', createProxyMiddleware({
  target: 'https://huggingface.co',
  changeOrigin: true,
  pathRewrite: { '^/huggingface': '' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
