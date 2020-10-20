const { rollup } = require('rollup');
const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const read = promisify(readFile);
const write = promisify(writeFile);

module.exports = function (snowpackConfig, _pluginOptions) {
  return {
    name: 'bundle',
    async optimize({ buildDirectory }) {
      const html = await read(`${buildDirectory}/index.html`);
      const jsDist = `${buildDirectory}${Object.values(snowpackConfig.mount)[1].url}`;

      await write(`${buildDirectory}/index.html`, html.toString().replace(jsDist, '/js'));

      const bundle = await rollup({
        input: `${jsDist}/main.js`,
        preserveEntrySignatures: false,
      });

      return bundle.write({
        output: {
          dir: `${buildDirectory}/js`,
          format: 'esm',
        },
      });
    },
  };
};
