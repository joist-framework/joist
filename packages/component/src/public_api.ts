import { Injector } from '@lit-kit/di';

declare global {
  interface Window {
    ROOT__INJECTOR__: Injector;
  }
}

export * from './lib/app';
export * from './lib/component';
export * from './lib/state';
export * from './lib/prop';
export * from './lib/el-ref';
export * from './lib/handle';
export * from './lib/lifecycle';
