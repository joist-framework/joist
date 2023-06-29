# Observable

Adds the ability to monitor class properties (static and instance) for changes

## NOTE: This lastest version uses the stage-3 decorator proposal. This requires typescript >= 5.0 and many other tools do not yet support this latest syntax.

#### Installation:

```BASH
npm i @joist/observable@next
```

```TS
import { observe, effect } from '@joist/observable';

class AppState {
  @observe accessor todos: string[] = [];
  @observe accessor userName?: string;

  @effect onChange(changes: Set<string | symbol>) {
    console.log(changes);
  }
}

const state = new State();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```
