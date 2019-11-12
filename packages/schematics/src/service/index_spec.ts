import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('new-service', () => {
  it('creates the correct files', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('service', { name: 'src/app/hello-world' }, Tree.empty());

    expect(tree.files.sort()).toEqual([
      '/src/app/hello-world/hello-world.service.spec.ts',
      '/src/app/hello-world/hello-world.service.ts'
    ]);
  });
});
