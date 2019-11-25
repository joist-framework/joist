import {
  Component,
  Prop,
  OnPropChanges,
  StateRef,
  State,
  createComponent,
  ElementInstance
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
  activeComponent: ElementInstance<any, any> | null;
}

@Component<RouterOutletState>({
  tag: 'lit-router-outlet',
  initialState: { activeComponent: null },
  useShadowDom: false,
  template(state) {
    return state.activeComponent || '';
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

          this.state.setValue({ activeComponent: currentComponent });

          next();
        } else if ('loadComponent' in route) {
          route.loadComponent().then(component => {
            const currentComponent = createComponent(component);

            this.state.setValue({ activeComponent: currentComponent });

            next();
          });
        }
      });
    });

    page();
  }
}
