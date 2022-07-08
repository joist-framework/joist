import { readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from 'fs';
import fs from 'fs-extra';
import { join } from 'path';
import { minifyHTMLLiterals } from 'minify-html-literals';
import { URL } from 'url';

const currentDir = new URL(import.meta.url).pathname;
const dir = join(currentDir, '../dist');
const files = getAllFileContext(dir);

const res = minifyHtml(files);

res.forEach((ctx) => {
  writeFileSync(ctx.path, ctx.content);
});

function minifyHtml(files) {
  return files
    .map((file) => {
      const res = minifyHTMLLiterals(file.content, {
        fileName: file.path.split('/').pop(),
        shouldMinify: () => true,
      });

      if (res) {
        return { path: file.path, content: res.code };
      }

      return null;
    })
    .filter((res) => res !== null);
}

function getAllFileContext(dir, ctx = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    if (statSync(dir + '/' + file).isDirectory()) {
      ctx = getAllFileContext(dir + '/' + file, ctx);
    } else {
      ctx.push({
        path: join(dir, '/', file),
        content: readFileSync(join(dir, '/', file)).toString(),
      });
    }
  });

  return ctx;
}
