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
import { observable, observe, Changes } from '@joist/observable';

@observable
class State {
  // Changes to these will trigger callback
  @observe todos: string[] = [];
  @observe userName?: string;

  onPropertyChanged(changes: Changes) {
    console.log(changes);
    // { todos: { value: ['Build Shit'], previousValue: [] }, userName: { value: 'Danny Blue', previousValue: undefined } }
  }
}

const state = new State();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```

#### Observe Effects

If you need to monitor changes across all observables on your page you can use the supplied `effect` function.
`effect` accepts a function that will be called after all observables have settled. Even if 10 observables have 15 updates made, your callback will only be called once everything is complete.

```TS
import { observable, observe, effect } from '@joist/observable';

@observable
class Counter {
  @observe value = 0;
}

const c1 = new Counter();
const c2 = new Counter();

c1.value++;
c1.value++;
c2.value++;

effect(() => {
  // only called once everything is settled
  console.log(c1.value); // 2
  console.log(c2.value); // 1
});
```

#### Compute new values

`computed` allows you to define a computed value that will only be recomputed after all changes have settled.

```TS
import { observable, observe, effect, computed } from '@joist/observable';

@observable
class Counter {
  @observe value = 0;
}

const c1 = new Counter();
const c2 = new Counter();
const combined = computed(() => c1.value + c2.value);

c1.value++;
c1.value++;
c2.value++;

effect(() => {
  console.log(combined.value); // 3
});
```

#### Stop observing

`effect` returns a function that allows you to detach from the update cycle. Useful if you need to only listen for one update or to perform some teardown logic.

```TS
import { effect } from '@joist/observable';

const detach = effect(() => {
  detach(); // this function will only be called once
});
```

#### Custom Elements

If you are using @observable with custom elements it is very likely that you will want to read from and write to attributes.
In order to appropriately handle reading from and writting to attributes. Any class that extends HTMLElement can use the `@attr` decorator to define attribute behavior.

```TS
import { observable, observe, attr } from '@joist/observable';

@observable
class TestElement extends HTMLElement {
  // reads as a string and writes directly to the name attribute
  @observe @attr name = '';

  // reads as a number and writes back a string
  @observe
  @attr({ read: Number })
  count: number = 0;

  // reads as a Date object and writes back a string
  @observe
  @attr<Date>({
    read: (val) => new Date(val),
    write: (val) => val.toString()
  })
  count = new Date();
}
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
