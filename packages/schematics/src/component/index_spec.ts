import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('new-component', () => {
  it('creates the correct files', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('component', { name: 'src/app/hello-world' }, Tree.empty());

    expect(tree.files.sort()).toEqual([
      '/src/app/hello-world/hello-world.component.spec.ts',
      '/src/app/hello-world/hello-world.component.ts',
    ]);
  });

  it('should throw an exception if the component tag is not valid', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    expect(() =>
      runner.runSchematic('component', { name: 'src/app/hello' }, Tree.empty())
    ).toThrowError('hello is not a valid component tag. tag must have at least one -');
  });

  describe('component file generation', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('component', { name: 'src/app/hello-world' }, Tree.empty());

    const file = tree.read('/src/app/hello-world/hello-world.component.ts') as Buffer;
    const content = file.toString();

    it('should create a state interface', () => {
      expect(content.includes('export interface HelloWorldState {}')).toBe(true);
    });

    it('should create component definition', () => {
      expect(content.includes('@Component<HelloWorldState>({')).toBe(true);
    });

    it('should correctly define the custom element', () => {
      expect(
        content.includes(
          `customElements.define('hello-world', defineElement(HelloWorldComponent));`
        )
      ).toBe(true);
    });

    it('should create the correct component class', () => {
      expect(content.includes('export class HelloWorldComponent {')).toBe(true);
    });

    it('should provide component state', () => {
      expect(content.includes('constructor(@StateRef _state: State<HelloWorldState>) {}')).toBe(
        true
      );
    });
  });

  describe('component spec file generation', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const tree = runner.runSchematic('component', { name: 'src/app/hello-world' }, Tree.empty());

    const file = tree.read('/src/app/hello-world/hello-world.component.spec.ts') as Buffer;
    const content = file.toString();

    it('should import the component and state', () => {
      expect(
        content.includes(
          `import { HelloWorldComponent, HelloWorldState } from './hello-world.component';`
        )
      ).toBe(true);
    });

    it('should create the describe block', () => {
      expect(content.includes(`describe('HelloWorldComponent', () => {`)).toBe(true);
    });

    it('should create an element instance', () => {
      expect(
        content.includes(`let el: ElementInstance<HelloWorldComponent, HelloWorldState>;`)
      ).toBe(true);

      expect(
        content.includes(
          `el = document.createElement('hello-world') as ElementInstance<HelloWorldComponent, HelloWorldState>;`
        )
      ).toBe(true);
    });
  });
});
