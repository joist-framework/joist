import { TodoService } from './todo.service';

describe('TodoService', () => {
  it('should work', () => {
    const service = new TodoService();

    expect(service).toBeTruthy();
  });
});
