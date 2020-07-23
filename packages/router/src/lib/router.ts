import { State } from '@joist/component';
import { Service } from '@joist/di';
import { match, Path, MatchResult } from 'path-to-regexp';

export interface Route {
  path: Path;
  component: () => HTMLElement | Promise<HTMLElement>;
}

export class RouteCtx extends State<MatchResult<any>> {}

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
    this.listeners.forEach((cb) => {
      cb();
    });
  }
}
