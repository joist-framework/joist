/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  workspaceRoot: '../../',
  mount: {
    public: '/',
    src: '/__dist__',
  },
  plugins: ['@snowpack/plugin-typescript'],
};
