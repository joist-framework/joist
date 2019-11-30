import { ClassProviderToken, Inject, Service } from '@lit-kit/di';

export type Path = string | RegExp;

export interface Route {
  path: Path;
  component: () => ClassProviderToken<any> | Promise<ClassProviderToken<any>>;
}

export function RouterRef(c: any, k: string, i: number) {
  Inject(Router)(c, k, i);
}

@Service()
export class Router {
  private listeners: Function[] = [];

  root: string = '/';

  constructor() {
    window.addEventListener('popstate', () => {
      this.notifyListeners();
    });
  }

  getFragment() {
    let fragment = '';

    fragment = this.clearSlashes(decodeURI(location.pathname));
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

    return this.clearSlashes(fragment);
  }

  resolve(routes: Route[]): Route | null {
    var fragment = this.getFragment();

    console.log(fragment);

    for (let i = 0; i < routes.length; i++) {
      const path = this.clearSlashes(routes[i].path);
      const match = fragment.match(path);

      if (match) {
        match.shift();

        return routes[i];
      }
    }

    return null;
  }

  navigate(path: string) {
    history.pushState(null, '', this.root + this.clearSlashes(path));

    this.notifyListeners();
  }

  listen(cb: Function) {
    this.listeners.push(cb);

    return () => {
      const index = this.listeners.indexOf(cb);

      this.listeners.splice(index, 1);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      cb();
    });
  }

  private clearSlashes(path: Path) {
    return path.toString().replace(/^\/|\/$/g, '');
  }
}
