# Observable

Observable in Joist means something slightly different then in something like RxJs.
Decorating a class with `@observable` means that instances of that class will BE observable. This means you can watch for changes on select properties.s

#### Installation:

```BASH
npm i @joist/observable@beta
```

#### Example:

```TS
import { observable, observer, OnPropertyChanged, Changes } from '@joist/observable';

@observable
class State implements OnPropertyChanged {
  // Changes to these will trigger callback
  @observe todos: string[] = [];
  @observe userName?: string;

  // changes to this will not
  someValue: boolean = false;

  onPropertyChanged(changes: Changes) {
    console.log(changes);
    // { todos: { value: ['Build Shit'], previousValue: [] }, userName: { value: 'Danny Blue', previousValue: undefined } }
  }
}

const state = new State();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```

#### Event target example:

If you want to externally monitor your class for changes you can extend event target and dispatch events. (available in both node and the browser)

```TS
import { observable, observer, OnPropertyChanged, Changes } from '@joist/observable';

class StateChangeEvent extends Event {
  consetructor(public changes: Changes) {
    super('statechange')
  }
}

@observable
class State extends EventTarget implements OnPropertyChanged {
  // Changes to these will trigger callback
  @observe todos: string[] = [];
  @observe userName?: string;

  // changes to this will not
  someValue: boolean = false;

  onPropertyChanged(changes: Changes) {
    this.dispatchEvent(new StateChangeEvent(changes));
  }
}

const state = new State();

state.addEventListener('statechange', (e) => {
  console.log(e.changes);
});

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
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
