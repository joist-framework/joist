import {
  Component,
  Prop,
  OnPropChanges,
  ElRef,
  OnConnected,
  OnDisconnected,
  defineElement,
} from '@joist/component';

import { RouterRef, Router } from '../router';

export type RouterLinkState = HTMLAnchorElement | null;

export class ActiveOptions {
  pathMatch: 'full' | 'startsWith' = 'startsWith';
  className: string = 'active';

  constructor(seed?: Partial<ActiveOptions>) {
    Object.assign(this, seed);
  }
}

@Component()
export class RouterLinkComponent implements OnPropChanges, OnConnected, OnDisconnected {
  @Prop() path: string = '';
  @Prop() activeOptions: ActiveOptions = new ActiveOptions();

  private normalizedPath: string = '';
  private removeListener?: Function;

  constructor(@RouterRef private router: Router, @ElRef private elRef: HTMLElement) {}

  connectedCallback() {
    this.removeListener = this.router.listen(() => {
      this.setActiveClass();
    });

    const child = this.elRef.children[0];

    if (child) {
      if (child.tagName === 'A') {
        this.path = (child as HTMLAnchorElement).pathname;

        this.onPropChanges('path');
      }
    }
  }

  disconnectedCallback() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  onPropChanges(key: string) {
    if (key === 'path') {
      this.normalizedPath = this.router.normalize(this.path);

      this.elRef.onclick = (e) => {
        e.preventDefault();

        this.router.navigate(this.path);
      };
    }

    this.setActiveClass();
  }

  private setActiveClass() {
    const fragment = this.router.getFragment();
    const { className, pathMatch } = this.activeOptions;

    if (pathMatch === 'full') {
      if (fragment === this.normalizedPath) {
        this.elRef.classList.add(className);
      } else {
        this.elRef.classList.remove(className);
      }
    } else if (fragment.startsWith(this.normalizedPath)) {
      this.elRef.classList.add(className);
    } else {
      this.elRef.classList.remove(className);
    }
  }
}

export const RouterLinkElement = defineElement(RouterLinkComponent);
