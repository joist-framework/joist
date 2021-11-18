# Di DOM

Dependency Injection in ~800 bytes

#### Installation:

```BASH
npm i @joist/di-dom
```

#### Custom Elements

Joist DI was built with custom elements in mind. When you install `@joist/di` you also get the dom library.

```TS
import { WithInjector } from '@joist/di-dom';
import { get } from '@joist/di-dom/decorators';

class MyElement extends WithInjector(HTMlElement) {
  get myService() {
    return this.injector.get(FooService);
  }
}

customElements.define('my-element', MyElement);
```

```TS
import { WithInjector } from '@joist/di-dom';
import { get } from '@joist/di-dom/decorators';

class MyElement extends WithInjector(HTMlElement) {
  @get(FooService)
  myService!: MyService;
}

customElements.define('my-element', MyElement);
```

#### Hierarchy

The WithInjector mixin is hierarchical, meaing a component will inherit from it's parent if it has one.
For example:

```TS
import { WithInjector } from '@joist/di-dom';
import { get } from '@joist/di-dom/decorators';å

class Config {
  name = 'Foo Bar'
}

const CustomRoot = JoistDi(HTMLElement, {
  providers: [
    { provide: Config, use: class { name = 'Danny Blue' } }
  ]
});

class Parent extends CustomRoot {}

class Child extends JoistDi(HTMLElement) {
  @get(Config)
  public config!: Config;
}

customElements.define('my-parent', Parent);
customElements.define('my-child', Child);
```

```HTML
<my-child id="child-1"></my-child>

<my-parent>
  <my-child id="child-2"></my-child>
</my-parent>

<script type="module">
  const child1 = document.getElementById("child-1");
  const child2 = document.getElementById("child-2");

  console.log(child1.config.name); // Foo Bar
  console.log(child2.config.name); // Danny Blue
</script>
```
