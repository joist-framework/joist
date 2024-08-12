import { assert } from 'chai';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { FileSysTemplateLoader } from './template-loader.js';

const dirname = join(fileURLToPath(new URL('.', import.meta.url)), '../../src/testing');

it('FileSysTemplateLoader: should read from defined paths', async () => {
  const loader = new FileSysTemplateLoader(
    (tag) => join(dirname, 'elements', tag, tag + '.html'),
    (tag) => join(dirname, 'elements', tag, tag + '.css')
  );

  const html = await loader.loadHTML('my-element');
  const css = await loader.loadCSS('my-element');

  assert.equal(html?.trim(), `<h2>Hello World</h2>\n\n<slot></slot>`);
  assert.equal(css?.trim(), `:host {\n  display: flex;\n}`);
});
