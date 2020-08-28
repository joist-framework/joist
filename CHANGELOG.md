<a name="1.6.0"></a>

# 1.6.0 (2020-08-28)

### Features

- **component:** Add `onComplete` callback.

```TS
import { component, State, handle, JoistElement, get, HandlerCtx } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

@component<number>({
  tagName: 'app-root'
})
class AppElement extends JoistElement {
  @get(State)
  private state!: State<number>;

  @handle('inc')
  @handle('dec')
  either(_: Event, val: number) {
    return this.state.setValue(this.state.value + val);
  }

  onComplete({ action }: HandlerCtx, res: any[]) {
    console.log(`${action} has been called and completed`);
    console.log(`New state is ${this.state.value}`);
  }
}
```

# 1.5.0 (2020-08-23)

### Features

- **component:** Add support for [Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets)
