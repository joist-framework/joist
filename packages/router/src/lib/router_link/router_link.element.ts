import {
  JoistElement,
  OnConnected,
  OnDisconnected,
  get,
  property,
  OnPropChanges,
} from '@joist/component';

import { Router, normalize } from '../router';

type RouterLinkLifecycle = OnConnected & OnDisconnected & OnPropChanges;

export class RouterLinkElement extends JoistElement implements RouterLinkLifecycle {
  @get(Router)
  private router!: Router;

  @property()
  public path: string = this.getAttribute('path') || '';

  @property()
  public pathMatch: string = this.getAttribute('path-match') || 'startsWith';

  @property()
  public activeClass: string = this.getAttribute('active-class') || 'active';

  private normalizedPath: string = normalize(this.path);
  private removeListener?: Function;

  onPropChanges(key: string, o: string, n: string) {
    if (key === 'path' && o !== n) {
      this.normalizedPath = normalize(this.path);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.removeListener = this.router.listen(() => {
      this.setActiveClass();
    });

    const child = this.children[0];

    if (child && child instanceof HTMLAnchorElement) {
      this.path = child.pathname;
      this.normalizedPath = normalize(this.path);
    }

    this.onclick = (e) => {
      e.preventDefault();

      this.router.navigate(this.normalizedPath);
    };

    this.setActiveClass();
  }

  disconnectedCallback() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  private setActiveClass() {
    const fragment = this.router.getFragment();

    if (this.pathMatch === 'full') {
      if (fragment === this.normalizedPath) {
        this.classList.add(this.activeClass);
      } else {
        this.classList.remove(this.activeClass);
      }
    } else if (fragment.startsWith(this.normalizedPath)) {
      this.classList.add(this.activeClass);
    } else {
      this.classList.remove(this.activeClass);
    }
  }
}
