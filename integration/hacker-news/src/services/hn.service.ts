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

  getTopStories(count = 50) {
    const http = this.#http();

    return this.getTopStoryIds(count).then((res) => {
      return Promise.all(
        res.map((id) => {
          return http
            .fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then<HnItem>((res) => res.json());
        })
      );
    });
  }
  getTopStoryIds(count: number) {
    const http = this.#http();

    const url = new URL('https://hacker-news.firebaseio.com/v0/beststories.json');
    url.searchParams.set('limitToFirst', count.toString());
    url.searchParams.set('orderBy', '"$key"');

    return http.fetch(url).then<string[]>((res) => res.json());
  }
}
