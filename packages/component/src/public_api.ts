declare global {
  interface Window {
    ShadyCSS: any;
  }
}

export { bootstrapApplication, clearApplication, getApplicationRef } from './lib/app';
export { ComponentInstance, Component, ElementInstance } from './lib/component';
export { State, StateRef } from './lib/state';
export { Prop } from './lib/prop';
export { ElRef } from './lib/el-ref';
export { Handle } from './lib/handle';
export { createComponent } from './lib/create-component';
export { TemplateDef, TemplateEvent } from './lib/metadata';
export { Renderer } from './lib/renderer';
export {
  OnAttributeChanged,
  OnConnected,
  OnDisconnected,
  OnInit,
  OnPropChanges
} from './lib/lifecycle';
