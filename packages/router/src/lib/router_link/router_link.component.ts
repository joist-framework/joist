import { ElRef, OnConnected, OnDisconnected, defineElement } from '@joist/component';

import { RouterRef, Router } from '../router';

export type RouterLinkState = HTMLAnchorElement | null;

export class RouterLinkComponent implements OnConnected, OnDisconnected {
  path: string = this.elRef.getAttribute('path') || '';
  pathMatch: string = this.elRef.getAttribute('path-match') || 'startsWith';
  activeClass: string = this.elRef.getAttribute('active-class') || 'active';

  private normalizedPath: string = this.router.normalize(this.path);
  private removeListener?: Function;

  constructor(@RouterRef private router: Router, @ElRef private elRef: HTMLElement) {}

  connectedCallback() {
    this.removeListener = this.router.listen(() => {
      this.setActiveClass();
    });

    const child = this.elRef.children[0];

    if (child && child instanceof HTMLAnchorElement) {
      this.path = child.pathname;
      this.normalizedPath = this.router.normalize(this.path);
    }

    this.elRef.onclick = (e) => {
      e.preventDefault();

      this.router.navigate(this.normalizedPath);
    };

    this.setActiveClass();
  }

  onPropChanges() {
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
        this.elRef.classList.add(this.activeClass);
      } else {
        this.elRef.classList.remove(this.activeClass);
      }
    } else if (fragment.startsWith(this.normalizedPath)) {
      this.elRef.classList.add(this.activeClass);
    } else {
      this.elRef.classList.remove(this.activeClass);
    }
  }
}

export const RouterLinkElement = defineElement(RouterLinkComponent);
