# Observable

Adds the ability to monitor class properties (static and instance) for changes

#### Installation:

```BASH
npm i @joist/observable@next
```

```TS
import { observe, effect } from '@joist/observable';

class AppState {
  @observe todos: string[] = [];
  @observe userName?: string;

  @effect onChange(changes: Set<string | symbol>) {
    console.log(changes);
  }
}

const state = new State();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```
