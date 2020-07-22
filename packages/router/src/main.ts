import { RouterLinkElement } from './lib/router_link/router_link.element';
import { RouterOutletElement } from './lib/router_outlet/router_outlet.element';

export * from './lib/router';
export * from './lib/router_outlet/router_outlet.element';
export * from './lib/router_link/router_link.element';

customElements.define('router-link', RouterLinkElement);
customElements.define('router-outlet', RouterOutletElement);
