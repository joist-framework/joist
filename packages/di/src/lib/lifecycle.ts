const onInit = Symbol('OnInit');
const onInject = Symbol('OnInject');

export const LifeCycle = {
  onInit,
  onInject
} as const;

export interface OnInit {
  [LifeCycle.onInit](): void;
}

export interface OnInject {
  [LifeCycle.onInject](): void;
}
