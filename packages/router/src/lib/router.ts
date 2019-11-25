import { State, createComponent, ElementInstance } from '@lit-kit/component';
import { Inject, Provider, ClassProviderToken } from '@lit-kit/di';
import page from 'page';

export function RouterRef(c: any, p: string, i: number) {
  Inject(Router)(c, p, i);
}

export type Route =
  | {
      path: string;
      component: ClassProviderToken<any>;
    }
  | {
      path: string;
      loadComponent: () => Promise<ClassProviderToken<any>>;
    }
  | {
      path: string;
      redirectTo: string;
    };

export interface RouterState {
  activeComponent?: ElementInstance<any, any>;
}

export class Router {
  constructor(private state: State<RouterState>) {}

  registerRoutes(routes: Route[]) {
    routes.forEach(route => {
      page(route.path, (_ctx, next) => {
        if ('component' in route) {
          const activeComponent = createComponent(route.component);

          this.state.setValue({ ...this.state.value, activeComponent });

          next();
        } else if ('loadComponent' in route) {
          route.loadComponent().then(component => {
            const activeComponent = createComponent(component);

            this.state.setValue({ ...this.state.value, activeComponent });

            next();
          });
        } else if ('redirectTo' in route) {
          page(route.path, route.redirectTo);

          next();
        }
      });
    });
  }

  init() {
    page();
  }
}

export function withRoutes(routes: Route[]): Provider<any> {
  return {
    provide: Router,
    useFactory: (state: State<RouterState>) => {
      const router = new Router(state);

      router.registerRoutes(routes);

      return router;
    },
    deps: [State]
  };
}
