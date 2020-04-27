export interface OnPropChanges {
  onPropChanges(prop: string, oldVal: any, newVal: any): void;
}

export interface OnConnected {
  connectedCallback(): void;
}

export interface OnDisconnected {
  disconnectedCallback(): void;
}

export interface OnAttributeChanged {
  attributeChangedCallback(attr: string, oldVal: string, newVal: string): void;
}

export type Lifecycle = Partial<OnPropChanges> &
  Partial<OnConnected> &
  Partial<OnDisconnected> &
  Partial<OnAttributeChanged>;
