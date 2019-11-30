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

    fragment = this.normalize(decodeURI(location.pathname));
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

    return this.normalize(fragment);
  }

  resolve(routes: Route[]): Route | null {
    var fragment = this.getFragment();

    for (let i = 0; i < routes.length; i++) {
      const match = this.pathMatches(fragment, this.normalize(routes[i].path));

      if (match) {
        match.shift();

        return routes[i];
      }
    }

    return null;
  }

  pathMatches(fragment: string, path: string) {
    return fragment.match(this.normalize(path));
  }

  navigate(path: string) {
    history.pushState(null, '', this.root + this.normalize(path));

    this.notifyListeners();
  }

  listen(cb: Function) {
    this.listeners.push(cb);

    return () => {
      const index = this.listeners.indexOf(cb);

      this.listeners.splice(index, 1);
    };
  }

  normalize(path: Path) {
    return path.toString().replace(/^\/|\/$/g, '');
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      cb();
    });
  }
}
