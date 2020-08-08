import { State } from '@joist/component';
import { service, inject } from '@joist/di';
import { match as ptrMatch, Path, MatchResult } from 'path-to-regexp';

export interface Route {
  path: Path;
  component: () =>
    | HTMLElement
    | CustomElementConstructor
    | Promise<HTMLElement | CustomElementConstructor>;
}

export class RouteCtx extends State<MatchResult<any>> {}

export function normalize(path: Path) {
  return path.toString().replace(/^\/|\/$/g, '');
}

export function match(path: Path) {
  return ptrMatch(normalize(path), { decode: decodeURIComponent });
}

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
export class RouterConfig {
  root: string = '/';
  navigateEventName: string = 'joist_router_navigate';
}

@service()
export class Router {
  detach = this.location.onPopState(this.notify.bind(this));

  constructor(
    @inject(Location) private location: Location,
    @inject(RouterConfig) private config: RouterConfig
  ) {}

  getFragment() {
    let fragment = '';

    fragment = normalize(this.location.getPath());
    fragment = this.config.root !== '/' ? fragment.replace(this.config.root, '') : fragment;

    return normalize(fragment);
  }

  navigate(path: string) {
    this.location.goTo(this.config.root + normalize(path));

    this.notify();
  }

  listen(cb: () => unknown) {
    addEventListener(this.config.navigateEventName, cb);

    return () => {
      removeEventListener(this.config.navigateEventName, cb);
    };
  }

  private notify() {
    dispatchEvent(new CustomEvent(this.config.navigateEventName));
  }
}
