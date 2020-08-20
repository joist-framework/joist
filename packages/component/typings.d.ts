declare interface CSSStyleSheet {
  replace(text: string): Promise<CSSStyleSheet>;
  replaceSync(text: string): void;
}

declare interface Document {
  adoptedStyleSheets: readonly CSSStyleSheet[];
}

declare interface ShadowRoot {
  adoptedStyleSheets: readonly CSSStyleSheet[];
}

declare var __INITIAL_DATA__: string;
