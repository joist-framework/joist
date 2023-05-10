# Observable

Observable in Joist means something slightly different then in something like RxJs.
Decorating a class with `@observable` means that instances of that class will BE observable. This means you can watch for changes on select properties.s

#### Installation:

```BASH
npm i @joist/observable
```

#### Define an observable

Any class decorated with `@observable` will call the supplied `onPropertyChanged` callback whenever one of the marked values is updated.

```TS
import { observe, effect } from '@joist/observable';

class AppState {
  // Changes to these will trigger callback
  @observe todos: string[] = [];
  @observe userName?: string;

  @effect onPropertyChanged(changes: Set<keyof this>) {
    console.log(changes);
  }
}

const state = new State();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```

##### Upgrading Custom Element Properties

One tricky thing about custom elements and properties is how to handle them when the upgrade. For example.

```HTML

<my-element></my-element>

<script>
  const el = document.querySelector('my-element');

  // A property is changed BEFORE the definition is loaded.
  // We still want this value to be available on our custom element
  el.name = "Hello!"
</script>

<script src="./path/to/my-element-defintion.js" type="module">
```

Joist provides an `UpgradableElement` base class that will ensure that any properties that are set prior to upgrade time are forwarded to your custom element.

```TS
import { observable, observe, UpgradableElement } from '@joist/observable';

@observable
class TestElement extends UpgradableElement {
  @observe name = ''; // now in our example above this value will be set to "Hello"
}
```

If you need to extend your own custom HTMLElement you can also use the provided `upgradable` mixin.

```TS
import { observable, observe, upgradable } from '@joist/observable';

@observable
class TestElement extends upgradable(HTMLElement) {
  @observe name = ''; // now in our example above this value will be set to "Hello"
}
```
