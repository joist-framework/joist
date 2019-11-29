import { ClassProviderToken } from '@lit-kit/di';

export type Path = string | RegExp;

export interface Route {
  path: Path;
  component: () => ClassProviderToken<any> | Promise<ClassProviderToken<any>>;
}

export class Router {
  routes: Route[] = [];
  root: string = '/';

  getFragment() {
    let fragment = '';

    fragment = this.clearSlashes(decodeURI(location.pathname));
    fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

    return this.clearSlashes(fragment);
  }

  clearSlashes(path: Path) {
    return path.toString().replace(/^\/|\/$/g, '');
  }

  registerRoutes(routes: Route[]) {
    this.routes.push(...routes);
  }

  resolve(): Promise<ClassProviderToken<any> | null> {
    var fragment = this.getFragment();

    for (let i = 0; i < this.routes.length; i++) {
      const path = this.clearSlashes(this.routes[i].path);
      const match = fragment.match(path);

      if (match) {
        console.log(match);

        match.shift();

        return Promise.resolve(this.routes[i].component());
      }
    }

    return Promise.resolve(null);
  }

  navigate(path: string): void {
    history.pushState(null, '', this.root + this.clearSlashes(path));
  }
}
