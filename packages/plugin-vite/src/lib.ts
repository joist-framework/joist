import { Applicator } from '@joist/ssr';
import { PluginOption } from 'vite';

function plugin(applicator: Applicator): PluginOption {
  return {
    name: 'Joist',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return applicator.apply(html, ['joist-header', 'joist-nav', 'joist-main']);
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('elements') && (file.endsWith('.html') || file.endsWith('.css'))) {
        console.log(`${file} updated...`);

        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    }
  };
}

export default plugin;
