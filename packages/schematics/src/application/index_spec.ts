import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('new-application', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('application', { name: 'hello-world' }, Tree.empty());

    expect(tree.files.sort()).toEqual([
      '/hello-world/.gitignore',
      '/hello-world/.prettierrc',
      '/hello-world/README.md',
      '/hello-world/karma.conf.js',
      '/hello-world/package.json',
      '/hello-world/src/app/app.component.ts',
      '/hello-world/src/assets/.gitkeep',
      '/hello-world/src/assets/icons/apple-touch-icon-180.png',
      '/hello-world/src/assets/icons/favicon.ico',
      '/hello-world/src/assets/icons/icon-144.png',
      '/hello-world/src/assets/icons/icon-192.png',
      '/hello-world/src/assets/icons/icon-256.png',
      '/hello-world/src/assets/icons/icon-36.png',
      '/hello-world/src/assets/icons/icon-384.png',
      '/hello-world/src/assets/icons/icon-48.png',
      '/hello-world/src/assets/icons/icon-512.png',
      '/hello-world/src/assets/icons/icon-72.png',
      '/hello-world/src/assets/icons/icon-96.png',
      '/hello-world/src/index.html',
      '/hello-world/src/main.ts',
      '/hello-world/src/manifest.json',
      '/hello-world/src/test.ts',
      '/hello-world/tsconfig.json',
      '/hello-world/webpack.config.js',
      '/hello-world/workbox-config.js'
    ]);
  });
});
