export interface ShadowResult<T extends HTMLElement> {
  apply(el: T): void;
}
