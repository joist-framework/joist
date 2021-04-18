/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  workspaceRoot: '../../',
  mount: {
    src: '/',
  },
  plugins: ['@snowpack/plugin-typescript'],
  optimize: {
    minify: true,
    target: 'esnext',
  },
};
