import { State, createComponent, ElementInstance } from '@lit-kit/component';
import { Provider, ClassProviderToken } from '@lit-kit/di';
import page from 'page';

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

export type RouteCtx = PageJS.Context;

export interface OnRouteInit {
  onRouteInit(ctx: RouteCtx): void;
}

export class Router {
  static routerInitialized: boolean = false;

  static registeredPaths = new Map<string, boolean>();

  static registerRoute(route: Route, state: State<RouterState>) {
    page(route.path, (ctx, next) => {
      if ('component' in route) {
        const activeComponent = createComponent(route.component);

        state.patchValue({ activeComponent });

        if (activeComponent.componentInstance.onRouteInit) {
          activeComponent.componentInstance.onRouteInit(ctx);
        }

        next();
      } else if ('loadComponent' in route) {
        route.loadComponent().then(component => {
          const activeComponent = createComponent(component);

          state.patchValue({ activeComponent });

          if (activeComponent.componentInstance.onRouteInit) {
            activeComponent.componentInstance.onRouteInit(ctx);
          }

          next();
        });
      } else if ('redirectTo' in route) {
        page(route.path, route.redirectTo);

        next();
      }
    });
  }

  static registerRoutes(routes: Route[], state: State<RouterState>) {
    routes.forEach(route => {
      if (!Router.registeredPaths.has(route.path)) {
        Router.registeredPaths.set(route.path, true);

        Router.registerRoute(route, state);
      }
    });
  }

  constructor(routes: Route[], state: State<RouterState>) {
    Router.registerRoutes(routes, state);

    if (!Router.routerInitialized) {
      Router.routerInitialized = true;

      page();
    }
  }
}

export function withRoutes(routes: Route[]): Provider<any> {
  return {
    provide: Router,
    useFactory: (state: State<RouterState>) => {
      return new Router(routes, state);
    },
    deps: [State]
  };
}
