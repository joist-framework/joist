import { State } from '@joist/component';
import { service, inject } from '@joist/di';
import { match as ogMatch, Path, MatchResult } from 'path-to-regexp';

export interface Route {
  path: Path;
  component: () => HTMLElement | Promise<HTMLElement>;
}

export class RouteCtx extends State<MatchResult<any>> {}

@service()
export class Location {
  getPath() {
    return window.location.pathname;
  }

  goTo(path: string) {
    history.pushState(null, '', path);
  }

  onPopState(cb: Function) {
    const fn = () => cb();

    window.addEventListener('popstate', fn);

    return () => {
      window.removeEventListener('popstate', fn);
    };
  }
}

export function normalize(path: Path) {
  return path.toString().replace(/^\/|\/$/g, '');
}

export function match(path: Path) {
  return ogMatch(normalize(path), { decode: decodeURIComponent });
}

@service()
export class Router {
  private listeners: Function[] = [];

  root: string = '/';

  detach = this.location.onPopState(this.notifyListeners.bind(this));

  constructor(@inject(Location) private location: Location) {}

  getFragment() {
    let fragment = '';

    fragment = normalize(this.location.getPath());
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

    return normalize(fragment);
  }

  navigate(path: string) {
    this.location.goTo(this.root + normalize(path));

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
    this.listeners.forEach((cb) => cb());
  }
}
