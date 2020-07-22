import { JoistElement, OnConnected, OnDisconnected, Get } from '@joist/component';

import { Router } from '../router';

export class RouterLinkElement extends JoistElement implements OnConnected, OnDisconnected {
  @Get(Router)
  private router!: Router;

  path: string = this.getAttribute('path') || '';
  pathMatch: string = this.getAttribute('path-match') || 'startsWith';
  activeClass: string = this.getAttribute('active-class') || 'active';

  private normalizedPath: string = this.router.normalize(this.path);
  private removeListener?: Function;

  connectedCallback() {
    this.removeListener = this.router.listen(() => {
      this.setActiveClass();
    });

    const child = this.children[0];

    if (child && child instanceof HTMLAnchorElement) {
      this.path = child.pathname;
      this.normalizedPath = this.router.normalize(this.path);
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
