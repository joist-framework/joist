import test from 'ava';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { FileSysTemplateLoader } from './template-loader.js';

const dirname = join(fileURLToPath(new URL('.', import.meta.url)), '../../../lib/testing');

test('FileSysTemplateLoader: should read from defined paths', async (t) => {
  const loader = new FileSysTemplateLoader(
    (tag) => join(dirname, 'elements', tag, tag + '.html'),
    (tag) => join(dirname, 'elements', tag, tag + '.css')
  );

  const html = await loader.loadHTML('my-element');
  const css = await loader.loadCSS('my-element');

  t.is(html?.trim(), `<h2>Hello World</h2>\n\n<slot></slot>`);
  t.is(css?.trim(), `:host {\n  display: flex;\n}`);
});
