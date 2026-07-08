// Proxies API calls from the React dev server (:3000) to the .NET API (:5000).
// See CLAUDE.md §4. Requires http-proxy-middleware (a devDependency).
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
