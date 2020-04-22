import { RouterLinkElement } from './lib/router_link/router_link.component';
import { RouterOutletElement } from './lib/router_outlet/router_outlet.component';

export * from './lib/router';
export * from './lib/router_outlet/router_outlet.component';
export * from './lib/router_link/router_link.component';

export function registerRouterElements() {
  customElements.define('router-link', RouterLinkElement);
  customElements.define('router-outlet', RouterOutletElement);
}
