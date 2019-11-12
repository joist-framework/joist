import { Injector } from '@lit-kit/di';
import { HackerNews, HackerNewsService } from './hacker-news.service';

describe('HackerNewsService', () => {
  it('should work', () => {
    const injector = new Injector();

    class MyTestService {
      constructor(@HackerNews() public hackerNews: HackerNewsService) {}
    }

    expect(injector.get(MyTestService).hackerNews).toBe(injector.get(HackerNewsService));
  });
});
