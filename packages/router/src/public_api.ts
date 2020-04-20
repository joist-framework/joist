import { defineElement } from '@lit-kit/component';

import { RouterLinkComponent } from './lib/router_link/router_link.component';
import { RouterOutletComponent } from './lib/router_outlet/router_outlet.component';

customElements.define('router-link', defineElement(RouterLinkComponent));
customElements.define('router-outlet', defineElement(RouterOutletComponent));

export * from './lib/router';
export * from './lib/router_outlet/router_outlet.component';
export * from './lib/router_link/router_link.component';
