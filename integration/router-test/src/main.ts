import './app/app.component';

import { bootstrapEnvironment } from '@joist/component';
import { withLitHtml } from '@joist/component/lit_html';
import { registerRouterElements } from '@joist/router';

bootstrapEnvironment([withLitHtml()]);

registerRouterElements();
