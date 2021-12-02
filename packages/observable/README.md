# Observable

Observable in Joist means something slightly different then in something like RxJs.
Decorating a class with `@observable` means that instances of that class will BE observable. This means you can watch for changes on select properties.s

#### Installation:

```BASH
npm i @joist/observable
```

#### Example:

```TS
import { observable, observer, OnChange, Changes } from '@joist/observable';

@observable
class State implements OnChange {
  // Changes to these will trigger callback
  @observe todos: string[] = [];
  @observe userName?: string;

  // changes to this will not
  someValue: boolean = false;

  onChange(changes: Changes) {
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
import { observable, observer, OnChange, Changes } from '@joist/observable';

class StateChangeEvent extends Event {
  consetructor(public changes: Changes) {
    super('statechange')
  }
}

@observable
class State extends EventTarget implements OnChange {
  // Changes to these will trigger callback
  @observe todos: string[] = [];
  @observe userName?: string;

  // changes to this will not
  someValue: boolean = false;

  onChange(changes: Changes) {
    this.dispatchEvent(new StateChangeEvent());
  }
}

const state = new State();

state.addEventListener('statechange', (e) => {
  console.log(e.changes);
});

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```
