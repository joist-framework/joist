/**
 * NOTE: TemplateStringsArray can be used to cache via a WeakMap.
 *
 * function html(strs: TemplateStringsArray) {
 *   return strs
 * }
 *
 * class Foo {
 *   hello = html`world`;
 * }
 *
 * // these will be the same instance of TemplateStringsArray
 * new Foo().hello === new Foo().hello
 */

import { ShadowResult } from './result.js';

type Tags = keyof HTMLElementTagNameMap;
type SVGTags = keyof SVGElementTagNameMap;
type MathTags = keyof MathMLElementTagNameMap;

const htmlTemplateCache = new WeakMap<TemplateStringsArray, HTMLTemplateElement>();

export class HTMLResult extends ShadowResult {
  query<K extends Tags>(selectors: K): HTMLElementTagNameMap[K] | null;
  query<K extends SVGTags>(selectors: K): SVGElementTagNameMap[K] | null;
  query<K extends MathTags>(selectors: K): MathMLElementTagNameMap[K] | null;
  query<E extends Element = Element>(selectors: string): E | null;
  query<K extends Tags>(query: K) {
    return this.shadow.querySelector<K>(query);
  }

  queryAll<K extends Tags>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  queryAll<K extends SVGTags>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  queryAll<K extends MathTags>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  queryAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  queryAll<K extends Tags>(query: K) {
    return this.shadow.querySelectorAll<K>(query);
  }

  /**
   * THe HTMLTemplateElement itself will be cached but a new instance of the result returned
   */
  apply(root: ShadowRoot): void {
    let template: HTMLTemplateElement;

    if (htmlTemplateCache.has(this.strings)) {
      template = htmlTemplateCache.get(this.strings) as HTMLTemplateElement;
    } else {
      template = document.createElement('template');

      template.innerHTML = concat(this.strings);
      htmlTemplateCache.set(this.strings, template);
    }

    root.append(template.content.cloneNode(true));
  }
}

export function html(strings: TemplateStringsArray, ...values: any[]): HTMLResult {
  return new HTMLResult(strings, ...values);
}

export class CSSResult extends ShadowResult {
  constructor(strings: TemplateStringsArray) {
    super(strings);
  }

  append(result: CSSResult) {
    result.apply(this.shadow);
  }

  apply(root: ShadowRoot): void {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(concat(this.strings));

    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
}

const cssResultCache = new WeakMap<TemplateStringsArray, CSSResult>();

// the entire result is cached
export function css(strings: TemplateStringsArray): CSSResult {
  if (cssResultCache.has(strings)) {
    return cssResultCache.get(strings) as CSSResult;
  }

  const result = new CSSResult(strings);

  cssResultCache.set(strings, result);

  return result;
}

function concat(strings: TemplateStringsArray) {
  let res = '';

  for (let i = 0; i < strings.length; i++) {
    res += strings[i];
  }

  return res;
}
