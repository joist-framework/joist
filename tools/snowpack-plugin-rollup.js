const { rollup } = require('rollup');
const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const { terser } = require('rollup-plugin-terser');

const read = promisify(readFile);
const write = promisify(writeFile);

module.exports = function (snowpackConfig, _pluginOptions) {
  return {
    name: 'bundle',
    async optimize({ buildDirectory }) {
      const html = await read(`${buildDirectory}/index.html`);

      await write(
        `${buildDirectory}/index.html`,
        html.toString().replace(snowpackConfig.mount['src/'], '/js')
      );

      const bundle = await rollup({
        input: `${buildDirectory}${snowpackConfig.mount['src/']}/main.js`,
        preserveEntrySignatures: false,
      });

      return bundle.write({
        output: {
          dir: `${buildDirectory}/js`,
          format: 'esm',
        },
        plugins: [terser()],
      });
    },
  };
};
