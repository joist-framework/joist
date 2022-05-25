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
In order to appropriately handle upgrading custom elements and attributes Joist provides an `ObservableElement` base class that you can extend.
Once you extend `ObservableElement` you can use the `@attr` decorator to define attribute behavior.

```TS
import { observable, observe, attr, ObservableElement } from '@joist/observable';

@observable
class TestElement extends ObservableElement {
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
