# Observable

Adds the ability to monitor class properties (static and instance) for changes

#### Installation:

```BASH
npm i @joist/observable
```

```TS
import { observe, effect } from '@joist/observable';

class AppState {
  @observe()
  accessor todos: string[] = [];

  @observe()
  accessor userName?: string;

  @effect()
  onChange(changes: Changes) {
    console.log(changes);
  }
}

const state = new AppState();

state.todos = [...state.todos, 'Build Shit'];
state.userName = 'Danny Blue'
```

## Computed Properties

The `@observe()` decorator can also be used to create computed properties that automatically update when their dependencies change. This is done by passing an options object with a `compute` function to the decorator:

```TS
import { observe } from '@joist/observable';

class UserProfile {
  @observe()
  accessor firstName = "John";

  @observe()
  accessor lastName = "Doe";

  @observe({
    compute: (i) => `${i.firstName} ${i.lastName}`
  })
  accessor fullName = "";
}

const profile = new UserProfile();
console.log(profile.fullName); // "John Doe"

// When dependencies change, computed properties update automatically
profile.firstName = "Jane";
console.log(profile.fullName); // "Jane Doe"
```

The compute function receives the instance as its parameter and should return the computed value. The computed property will automatically update whenever any of its dependencies (properties accessed within the compute function) change.
