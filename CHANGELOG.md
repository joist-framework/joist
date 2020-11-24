# 1.7.0 (2020-11-24)

### Features

- **component:** Add hierarchical injector.

This allows a component to explicitly marked as an injector that children can inherit from.

```TS
import { component, JoistElement } from '@joist/component';

class MyService {
  title = 'foo'
}

@component({
  tagName: 'app-root',
  isProviderRoot: true, // Now this component and any child components will use this version of `MyService`
  providers: [
    { 
      provide: MyService, 
      use class { 
        title = 'bar'
      } 
    }
  ]
})
class AppElement extends JoistElement { }
```

- **component/testing:** Add testing util for scoped services

```TS
import { component, JoistElement } from '@joist/component';
import { defineTestBed } from '@joist/component/testing';

@component({
  tagName: 'app-root'
})
class AppElement extends JoistElement { }

const el = defineTestBed([/* Providers available to just these components */]).create(AppElement);
```

# 1.6.0 (2020-08-28)

### Features

- **component:** Add `onComplete` callback.
The onComplete callback when be called after all handlers have run.

```TS
import { component, State, handle, JoistElement, get, HandlerCtx } from '@joist/component';

@component({
  tagName: 'app-root'
})
class AppElement extends JoistElement {
  @get(State)
  private state!: State<number>;

  @handle('inc')
  @handle('dec')
  updateCount(_: Event, val: number) {
    return this.state.setValue(this.state.value + val);
  }

  onComplete({ action, payload }: HandlerCtx, res: any[]) {
    console.log({ action, payload, state: this.state.value });
  }
}
```

# 1.5.0 (2020-08-23)

### Features

- **component:** Add support for [Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets)
