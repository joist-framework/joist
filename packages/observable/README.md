# Observable

Observable in Joist means something slightly different then in something like RxJs.
Marking a class with `@observable()` means that instances of that class will BE observable. This means you can watch for changes on select properties.s

#### Installation:

```BASH
npm i @joist/observable
```

#### Example:

```TS
import { observable, observer, OnChange, Changes } from '@joist/observable';

@observable()
class State implements OnChange {
  @observe() todos: string[] = [];
  @observe() userName?: string;

  onChange(changes: Changes) {
    console.log(changes);
    // { todos: { value: ['Build Shit'] }, userName: 'Danny Blue' }
  }
}

const state = new State();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```
