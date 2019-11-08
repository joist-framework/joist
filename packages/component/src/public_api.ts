import { Injector } from '@lit-kit/di';

declare global {
  interface Window {
    __LIT_KIT_ROOT_INJECTOR__: Injector;
  }
}

export * from './lib/app';
export * from './lib/component';
export * from './lib/state';
export * from './lib/prop';
export * from './lib/el-ref';
export * from './lib/handle';
export * from './lib/lifecycle';
export * from './lib/create-component';
export { TemplateDef, TemplateEvent } from './lib/metadata';
