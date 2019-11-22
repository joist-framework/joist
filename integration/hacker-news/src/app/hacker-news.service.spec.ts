import { Injector } from '@lit-kit/di';
import { HackerNewsRef, HackerNewsService } from './hacker-news.service';

describe('HackerNewsService', () => {
  it('should work', () => {
    const injector = new Injector();

    class MyTestService {
      constructor(@HackerNewsRef public hackerNews: HackerNewsService) {}
    }

    expect(injector.get(MyTestService).hackerNews).toBe(injector.get(HackerNewsService));
  });
});
