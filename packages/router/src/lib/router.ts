import { ClassProviderToken, Inject, Service } from '@lit-kit/di';
import { State } from '@lit-kit/component';
import { Match, match, Path } from 'path-to-regexp';

export interface Route {
  path: Path;
  component: () => ClassProviderToken<any> | Promise<ClassProviderToken<any>>;
}

export function RouteCtxRef(c: any, k: string, i: number) {
  Inject(RouteCtx)(c, k, i);
}

export class RouteCtx extends State<Match<object> | null> {}

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

    fragment = this.normalize(location.pathname);
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

    return this.normalize(fragment);
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

  match(path: Path) {
    return match(this.normalize(path), { decode: decodeURIComponent });
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
