import { JoistElement, get, property, PropChange } from '@joist/component';

import { Router, normalize } from '../router';

export class RouterLinkElement extends JoistElement {
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

  onPropChanges(changes: PropChange[]) {
    const keys = changes.map((change) => change.key);

    if (keys.includes('path')) {
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

    this.addEventListener('click', (e) => {
      e.preventDefault();

      this.router.navigate(this.normalizedPath);
    });

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
