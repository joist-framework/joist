export interface FeedItem {
  created_at: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  _tags: string[];
  objectID: string;
}

export interface FeedResponse {
  hits: FeedItem[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: { nbHits: boolean; typo: boolean };
  query: string;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: {
    afterFetch: { total: number };
    request: { roundTrip: number };
    total: number;
  };
  serverTimeMS: number;
}

export class HnService {
  static service = true;

  getFrontPage() {
    return fetch('http://hn.algolia.com/api/v1/search?tags=front_page').then<FeedResponse>((res) =>
      res.json()
    );
  }
}
