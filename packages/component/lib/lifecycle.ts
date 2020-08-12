export interface OnConnected {
  connectedCallback(): void;
}

export interface OnDisconnected {
  disconnectedCallback(): void;
}

export interface OnAttributeChanged {
  attributeChangedCallback(attr: string, oldVal: string, newVal: string): void;
}

export class PropChange<T = any> {
  constructor(
    public key: string,
    public newValue: T,
    public firstChange: boolean,
    public oldValue?: T
  ) {}
}

export type Lifecycle = Partial<OnConnected> &
  Partial<OnDisconnected> &
  Partial<OnAttributeChanged>;
