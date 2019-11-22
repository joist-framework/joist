import {
  Component,
  Prop,
  OnPropChanges,
  StateRef,
  State,
  ElementInstance,
  createComponent
} from '@lit-kit/component';
import { ClassProviderToken } from '@lit-kit/di';
import page from 'page';

export type Route =
  | {
      path: string;
      component: ClassProviderToken<any>;
    }
  | {
      path: string;
      loadComponent: () => Promise<ClassProviderToken<any>>;
    };

export interface RouterOutletState {
  currentComponent?: ElementInstance<any, any>;
}

@Component<RouterOutletState>({
  tag: 'lit-router-outlet',
  defaultState: {},
  template(state) {
    return state.currentComponent || '';
  }
})
export class RouterOutletComponent implements OnPropChanges {
  @Prop() routes: Route[] = [];

  constructor(@StateRef private state: State<RouterOutletState>) {}

  onPropChanges() {
    this.routes.forEach(route => {
      page(route.path, (_ctx, next) => {
        if ('component' in route) {
          const currentComponent = createComponent(route.component);

          this.state.setValue({ currentComponent });

          next();
        } else if ('loadComponent' in route) {
          route.loadComponent().then(component => {
            const currentComponent = createComponent(component);

            this.state.setValue({ currentComponent });

            next();
          });
        }
      });
    });

    page();
  }
}
