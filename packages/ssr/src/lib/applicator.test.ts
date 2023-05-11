import test from 'ava';

import { Applicator } from './applicator.js';
import { NoopTemplateCache } from './template-cache.js';
import { TemplateLoader } from './template-loader.js';

test('should apply declarative shadow dom to specified elements', async (t) => {
  class MockTemplateLoader implements TemplateLoader {
    loadCSS(tag: string): Promise<string | null> {
      return Promise.resolve(`:host { content: 'css for ${tag}' }`);
    }
    loadHTML(tag: string): Promise<string | null> {
      return Promise.resolve(`<div>html for ${tag}</div>`);
    }
  }

  const applicator = new Applicator(new NoopTemplateCache(), new MockTemplateLoader());

  const document = /*html*/ `
    <html>
        <head></head>

        <body>
            <mock-header></mock-header>
            <mock-content></mock-content>
            <mock-footer></mock-footer>
        </body>
    </html>
  `;

  const res = await applicator.apply(document, ['mock-header', 'mock-content', 'mock-footer']);

  t.is(
    trim(res),
    trim(`
    <html>
        <head></head>

        <body>
            <mock-header>
                <template shadowroot="open">
                    <style>:host { content: 'css for mock-header'}</style>
                    <div>html for mock-header</div>
                </template>
            </mock-header>

            <mock-content>
                <template shadowroot="open">
                    <style>:host { content: 'css for mock-content'}</style>
                    <div>html for mock-content</div>
                </template>
            </mock-content>

            <mock-footer>
                <template shadowroot="open">
                <style>:host { content: 'css for mock-footer'}</style>
                <div>html for mock-footer</div>
                </template>
            </mock-footer>
        </body>
    </html>
  `)
  );
});

test('should apply declarative shadow dom recursively', async (t) => {
  class MockTemplateLoader implements TemplateLoader {
    async loadCSS(tag: string): Promise<string | null> {
      return `:host { content: 'css for ${tag}' }`;
    }

    async loadHTML(tag: string): Promise<string | null> {
      switch (tag) {
        case 'mock-foo':
          return `<mock-bar></mock-bar>`;

        case 'mock-bar':
          return `<mock-baz></mock-baz>`;
      }

      return `<div>html for ${tag}</div>`;
    }
  }

  const applicator = new Applicator(new NoopTemplateCache(), new MockTemplateLoader());

  const document = `<mock-foo></mock-foo>`;

  const res = await applicator.apply(document, ['mock-foo', 'mock-bar', 'mock-baz']);

  t.is(
    trim(res),
    trim(`
    <html>
        <head></head>

        <body>
            <mock-foo>
                <template shadowroot="open">
                    <style>:host { content: 'css for mock-foo'}</style>
                    <mock-bar>
                        <template shadowroot="open">
                            <style>:host { content: 'css for mock-bar'}</style>
                            <mock-baz>
                                <template shadowroot="open">
                                    <style>:host { content: 'css for mock-baz'}</style>
                                    <div>html for mock-baz</div>
                                </template>
                            </mock-baz>
                        </template>
                    </mock-bar>
                </template>
            </mock-foo>
        </body>
    </html>
  `)
  );
});

function trim(value: string) {
  return value.replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm, '');
}
