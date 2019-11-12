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

  describe('generates the correct content for a service', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('service', { name: 'src/app/hello-world' }, Tree.empty());

    const file = tree.read('/src/app/hello-world/hello-world.service.ts') as Buffer;
    const content = file.toString();

    it('should create service ref decorator', () => {
      expect(
        content.includes(
          'export const HelloWorldRef = () => (c: any, p: any, i: any) => Inject(HelloWorldService)(c, p, i);'
        )
      ).toBe(true);
    });

    it('should define service class with the correct name', () => {
      expect(content.includes('export class HelloWorldService {}')).toBe(true);
    });
  });

  describe('generates the correct content for a service spec', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('service', { name: 'src/app/hello-world' }, Tree.empty());

    const file = tree.read('/src/app/hello-world/hello-world.service.spec.ts') as Buffer;
    const content = file.toString();

    it('should import the correct service', () => {
      expect(content.includes("import { HelloWorldService } from './hello-world.service';")).toBe(
        true
      );
    });

    it('should create the correct describe block', () => {
      expect(content.includes("describe('HelloWorldService', () => {")).toBe(true);
    });

    it('should correctly create new service instance', () => {
      expect(content.includes('const service = new HelloWorldService();')).toBe(true);
    });
  });
});
