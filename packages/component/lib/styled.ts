// Cache computed constructable stylesheets
const ccStyleCache = new Map<string, CSSStyleSheet>();

export function styled(styles: string) {
  return <T extends new (...args: any[]) => HTMLElement>(CustomElement: T) => {
    return class StyledElement extends CustomElement {
      constructor(...args: any[]) {
        super(args);

        this.applyStyles();
      }

      /**
       * Apply styles using Constructable StyleSheets if supported.
       */
      applyStyles() {
        if (styles && this.shadowRoot) {
          if (this.shadowRoot.adoptedStyleSheets) {
            // adoptedStyleSheets are available
            if (!ccStyleCache.has(this.tagName)) {
              // if styles have not previously been computed do so now
              ccStyleCache.set(this.tagName, this.createStyleSheet(styles));
            }

            // adpot calculated stylesheets
            const cached = ccStyleCache.get(this.tagName);

            this.shadowRoot.adoptedStyleSheets = cached ? [cached] : [];
          } else {
            // styles are defined but Constructable stylesheets not supported
            const styleEls = this.createStyleElement(styles);

            this.shadowRoot.prepend(styleEls);
          }
        }
      }

      createStyleSheet(styleString: string) {
        const sheet = new CSSStyleSheet();

        sheet.replaceSync(styleString);

        return sheet;
      }

      createStyleElement(styles: string) {
        const el = document.createElement('style');

        el.append(document.createTextNode(styles));

        return el;
      }
    };
  };
}
