const { esbuildPlugin } = require('@web/dev-server-esbuild');

module.exports = {
  rootDir: __dirname,
  puppeteer: true,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
};
