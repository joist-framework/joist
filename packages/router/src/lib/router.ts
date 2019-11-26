import { State, createComponent, ElementInstance } from '@lit-kit/component';
import { Inject, Provider, ClassProviderToken } from '@lit-kit/di';
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

export function RouteCtxRef(c: any, p: string, i: number) {
  Inject(RouteCtx)(c, p, i);
}

export class RouteCtx extends State<PageJS.Context | null> {
  constructor() {
    super(null);
  }
}

export function RouterRef(c: any, p: string, i: number) {
  Inject(Router)(c, p, i);
}

export class Router {
  static routerInitialized: boolean = false;

  static registerRoutes(routes: Route[], state: State<RouterState>, routeCtx: RouteCtx) {
    routes.forEach(route => {
      page(route.path, (ctx, next) => {
        if ('component' in route) {
          const activeComponent = createComponent(route.component);

          state.setValue({ ...state.value, activeComponent });
          routeCtx.setValue(ctx);

          next();
        } else if ('loadComponent' in route) {
          route.loadComponent().then(component => {
            const activeComponent = createComponent(component);

            state.setValue({ ...state.value, activeComponent });
            routeCtx.setValue(ctx);

            next();
          });
        } else if ('redirectTo' in route) {
          page(route.path, route.redirectTo);

          next();
        }
      });
    });
  }

  constructor(routes: Route[], state: State<RouterState>, routeCtx: RouteCtx) {
    Router.registerRoutes(routes, state, routeCtx);

    if (!Router.routerInitialized) {
      Router.routerInitialized = true;

      page();
    }
  }
}

export function withRoutes(routes: Route[]): Provider<any> {
  return {
    provide: Router,
    useFactory: (state: State<RouterState>, ctx: RouteCtx) => {
      return new Router(routes, state, ctx);
    },
    deps: [State, RouteCtx]
  };
}
