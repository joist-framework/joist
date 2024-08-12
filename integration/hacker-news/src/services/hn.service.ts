import { inject, injectable } from '@joist/di';

import { HttpService } from './http.service.js';

export interface HnItem {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url?: string;
}

@injectable()
export class HnService {
  #http = inject(HttpService);

  getTopStories(count = 10) {
    const http = this.#http();

    return this.getTopStoryIds(count).then((res) => {
      const storyRequests = res.map((id) =>
        http.fetchJson<HnItem>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );

      return Promise.allSettled(storyRequests).then((res) =>
        res.filter((item) => item.status === 'fulfilled').map((item) => item.value)
      );
    });
  }

  getTopStoryIds(count: number) {
    const http = this.#http();

    const url = new URL('https://hacker-news.firebaseio.com/v0/beststories.json');
    url.searchParams.set('limitToFirst', count.toString());
    url.searchParams.set('orderBy', '"$key"');

    return http.fetchJson<string[]>(url);
  }
}
