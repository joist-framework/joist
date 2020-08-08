const { esbuildPlugin } = require('@web/dev-server-esbuild');

module.exports = {
  rootDir: __dirname,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
};
