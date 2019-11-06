import { CompState } from './state';

describe('state', () => {
  it('should correctly set the default state', () => {
    const state = new CompState<string>(_ => {}, 'Hello');

    expect(state.value).toBe('Hello');
  });

  it('should correctly run the callback when there is a state change', done => {
    const state = new CompState<string>(state => {
      expect(state).toBe('Hello World');

      done();
    }, 'Hello');

    state.setState(state.value + ' World');
  });

  it('should set state when state change returns a promise', done => {
    const state = new CompState<string>(state => {
      expect(state).toBe('Hello World');

      done();
    }, 'Hello');

    state.setState(Promise.resolve(state.value + ' World'));
  });
});
