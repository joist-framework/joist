import { State } from '@joist/component';
import { service, inject } from '@joist/di';
import { match, Path, MatchResult } from 'path-to-regexp';

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

@service()
export class Router {
  private listeners: Function[] = [];

  root: string = '/';

  detach = this.location.onPopState(this.notifyListeners.bind(this));

  constructor(@inject(Location) private location: Location) {}

  getFragment() {
    let fragment = '';

    fragment = this.normalize(this.location.getPath());
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

    return this.normalize(fragment);
  }

  navigate(path: string) {
    this.location.goTo(this.root + this.normalize(path));

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
    this.listeners.forEach((cb) => cb());
  }
}
