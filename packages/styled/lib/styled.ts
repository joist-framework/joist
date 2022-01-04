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

  return class StyledElement extends CustomElement {
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (styles && this.shadowRoot) {
        // If there are defined styles AND a shadowRoot
        if (this.shadowRoot.adoptedStyleSheets) {
          // adoptedStyleSheets are available
          if (!ccStyleCache.has(this.tagName)) {
            // if styles have not previously been computed do so now
            ccStyleCache.set(this.tagName, styles.map(createStyleSheet));
          }

          // adpot calculated stylesheets
          this.shadowRoot.adoptedStyleSheets = ccStyleCache.get(this.tagName) || [];
        } else {
          // styles are defined but Constructable stylesheets not supported
          const styleEls = styles.map(createStyleElement);

          this.shadowRoot.prepend(...styleEls);
        }
      }
    }
  };
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
