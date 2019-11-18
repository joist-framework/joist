# Design

This document outlines the overall goals and design for lit-kit.

1. The custom element holds ALL of the information needed to render and update a component. It does this by attaching all important information onto properties on the element itself in what is defined as an "ElementInstance"

```TS
interface ElementInstance<C, S> = {
  // The injector available to the commponent. Is passed the parent injector if it exists
  componentInjector: Injector;

  // The actual instance of the component defined by the user
  componentInstance: ComponentInstance<C>;

  // All metadata required to render the component. template, tag, initial state, etc
  componentMetaData: Metadata<S>;

  // the components state container. Is the only way to update the component template
  componentState: State<S>;
};
```

2. Properties for the custom element are stored to the component instance with the component instance being the source of truth.

```TS
const el: ElementInstance<C, S>;

el.foo = 'hello world';

el.componentInstance.foo // hello world
el.componentInstance.bar = 'goodbye world';

el.bar // goodbye world
```
