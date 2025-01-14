import { StaticToken, inject, injectable } from "@joist/di";

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

export const HN_API = new StaticToken(
  "HN_API",
  async () => "https://hacker-news.firebaseio.com",
);
export const HTTP = new StaticToken("HTTP", async () =>
  import("./http.service.js").then((m) => new m.HttpService()),
);

@injectable()
export class HnService {
  #http = inject(HTTP);
  #hnApi = inject(HN_API);

  async getTopStories(count = 15) {
    const http = await this.#http();
    const hnApi = await this.#hnApi();

    return this.getTopStoryIds(count).then((res) => {
      const storyRequests = res.map((id) => {
        return http.fetchJson<HnItem>(`${hnApi}/v0/item/${id}.json`);
      });

      return Promise.allSettled(storyRequests).then((res) =>
        res
          .filter((item) => item.status === "fulfilled")
          .map((item) => item.value),
      );
    });
  }

  async getTopStoryIds(count: number) {
    const http = await this.#http();
    const hnApi = await this.#hnApi();

    const url = new URL(`${hnApi}/v0/beststories.json`);
    url.searchParams.set("limitToFirst", count.toString());
    url.searchParams.set("orderBy", '"$key"');

    return http.fetchJson<string[]>(url);
  }
}
