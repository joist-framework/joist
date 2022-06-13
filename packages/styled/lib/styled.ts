import { CSSResult } from './css-tag';

// Cache computed constructable stylesheets
const ccStyleCache = new Map<string, CSSStyleSheet[]>();

export interface StyledOptons {
  styles: string[];
}

export interface Styled {
  styles: CSSResult[];

  new (...args: any[]): HTMLElement;
}

export function styled<T extends Styled>(CustomElement: T) {
  const styles = CustomElement.styles;

  return new Proxy(CustomElement, {
    construct(a, b, c) {
      const instance: HTMLElement = Reflect.construct(a, b, c);

      if (styles && instance.shadowRoot) {
        // If there are defined styles AND a shadowRoot
        if (instance.shadowRoot.adoptedStyleSheets) {
          // adoptedStyleSheets are available
          if (!ccStyleCache.has(instance.tagName)) {
            // if styles have not previously been computed do so now
            ccStyleCache.set(instance.tagName, styles.map(createStyleSheet));
          }

          // adpot calculated stylesheets
          instance.shadowRoot.adoptedStyleSheets = ccStyleCache.get(instance.tagName) || [];
        } else {
          // styles are defined but Constructable stylesheets not supported
          const styleEls = styles.map(createStyleElement);

          instance.shadowRoot.prepend(...styleEls);
        }
      }

      return instance;
    },
  });
}

function createStyleSheet(styleString: CSSResult) {
  const sheet = new CSSStyleSheet();

  sheet.replaceSync(styleString.cssText);

  return sheet;
}

function createStyleElement(styles: CSSResult) {
  const el = document.createElement('style');

  el.append(document.createTextNode(styles.cssText));

  return el;
}
