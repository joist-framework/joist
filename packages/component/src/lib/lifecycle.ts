export interface OnInit {
  onInit(): void;
}

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
