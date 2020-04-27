import './app/app.component';

import { bootstrapEnvironment } from '@joist/component';
import { withLitHtml } from '@joist/component/lit_html';

bootstrapEnvironment([withLitHtml()]);
