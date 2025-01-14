declare interface HTMLElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  attributeChangedCallback?(
    name: string,
    oldValue: string,
    newValue: string,
  ): void;
}
