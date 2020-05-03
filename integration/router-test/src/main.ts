import './app/app.component';

import '@joist/router';

import { bootstrapEnvironment } from '@joist/component';
import { litHtml } from '@joist/component/lit-html';

bootstrapEnvironment([litHtml()]);
