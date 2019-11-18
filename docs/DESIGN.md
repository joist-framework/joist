# Design

This document outlines the overall goals and design for lit-kit.

### All that is needed to create an element is to call `document.createElement`;
  - The custom element class holds ALL of the information needed to render and update a component.
  - It does this by attaching all important information onto properties on the element itself in what is defined as an `ElementInstance`

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

### There is ONE SINGLE WAY to update the view.
  - The template function is a pure function that returns a lit-html TemplateResult.
  - The only way to update the component "view" is by setting new state.
  - Properties and State are treated differently. While this does mean that internally your props and state could become mismatched the template itself never will be.

```TS
@Component<number>({
  tag: 'app-root',
  defaultState: 0,
  template(state) {
    return html`<h1>${state}</h1>`
  }
})
class AppComponent implements OnInit {
  constructor(@StateRef() private state: State<number>) {}

  onInit() {
    setInterval(() => {
      this.state.setValue(this.state.value + 1);
    }, 1000);
  }
}
```

### Properties for the custom element are stored to the component instance with the component instance being the source of truth.

```TS
const el: ElementInstance<C, S>;

el.foo = 'hello world';

el.componentInstance.foo // hello world
el.componentInstance.bar = 'goodbye world';

el.bar // goodbye world
```

### Inversion of Control (IOC)
  - by abstracting the component class away from the custom element class it is possible to do constructor based dependency injection (DI)
  - global singleton services are available but NOT required
  - Each component gets it's own injector that will reference an optional global parent injector

```TS
@Service()
class AppService {}

@Component(...)
class AppComponent {
  constructor(@Inject(AppService) app: AppService) {}
}

bootstrapApplication(); // create global root injector for global singletons
```
