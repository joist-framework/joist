import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('new-component', () => {
  it('creates the correct files', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('component', { name: 'hello-world' }, Tree.empty());

    expect(tree.files.sort()).toEqual([
      '/hello-world/hello-world.component.spec.ts',
      '/hello-world/hello-world.component.ts'
    ]);
  });
});
