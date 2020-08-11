import { service, inject } from '@joist/di';

import { HttpService } from './http.service';

export interface HackerNewsItem {
  id: number;
  title: string;
  points: number;
  user: string;
  time: number;
  time_ago: string;
  comments_count: number;
  type: string;
  url: string;
  domain: string;
}

export interface HackerNewsItemComment {
  id: number;
  level: number;
  user: string;
  time: number;
  time_ago: string;
  content: string;
}

export interface HackerNewsItemFull extends HackerNewsItem {
  comments: HackerNewsItemComment[];
}

@service()
export class HackerNewsService {
  constructor(@inject(HttpService) private http: HttpService) {}

  getNews() {
    return this.http.get<HackerNewsItem[]>('https://api.hackerwebapp.com/news');
  }

  getNewsItem(id: number) {
    return this.http.get<HackerNewsItemFull>(`https://api.hackerwebapp.com/item/${id}`);
  }
}
