const { esbuildPlugin } = require('@web/dev-server-esbuild');

module.exports = {
  concurrency: 10,
  rootDir: __dirname,
  puppeteer: true,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
};
