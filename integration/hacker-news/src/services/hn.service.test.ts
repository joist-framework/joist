import { Injector } from '@joist/di';

import { HnService } from './hn.service.js';
import { HttpService } from './http.service.js';
import { assert } from 'chai';

it('should run', async () => {
  const testbed = new Injector([
    {
      provide: HttpService,
      use: class extends HttpService {
        async fetch(input: URL, _init?: RequestInit): Promise<Response> {
          if (
            input.toString().startsWith('https://hacker-news.firebaseio.com/v0/beststories.json')
          ) {
            return Response.json([0, 1, 2, 3, 4]);
          } else if (input.toString().startsWith('https://hacker-news.firebaseio.com/v0/item/')) {
            return Response.json({
              by: 'A_D_E_P_T',
              descendants: 191,
              id: 41201555,
              kids: [],
              score: 942,
              time: 1723209543,
              title: 'Jake Seliger has died',
              type: 'story',
              url: 'https://marginalrevolution.com/marginalrevolution/2024/08/jake-seliger-is-dead.html'
            });
          }

          return Response.error();
        }
      }
    }
  ]);

  const hn = testbed.inject(HnService);

  const res = await hn.getTopStories();

  assert.equal(res.length, 5);
});
