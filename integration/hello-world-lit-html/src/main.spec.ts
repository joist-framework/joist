import { AppElement } from './main';

describe('AppElement', () => {
  let el: AppElement;

  beforeEach(() => {
    el = new AppElement();

    document.body.append(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct title', () => {
    const title = el.querySelector('h1');

    expect(title!.innerHTML).toBe('<!---->Hello World<!---->');
  });
});
