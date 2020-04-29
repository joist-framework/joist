import './app/app.component';

import { bootstrapEnvironment } from '@joist/component';
import { litHtml } from '@joist/component/lit-html';
import { registerRouterElements } from '@joist/router';

bootstrapEnvironment([litHtml()]);

registerRouterElements();
