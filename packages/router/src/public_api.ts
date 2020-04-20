import { RouterLinkElement } from './lib/router_link/router_link.component';
import { RouterOutletElement } from './lib/router_outlet/router_outlet.component';

customElements.define('router-link', RouterLinkElement);
customElements.define('router-outlet', RouterOutletElement);

export * from './lib/router';
export * from './lib/router_outlet/router_outlet.component';
export * from './lib/router_link/router_link.component';
