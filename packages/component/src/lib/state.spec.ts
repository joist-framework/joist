import { State } from './state';

describe('state', () => {
  it('should correctly set the default state', () => {
    const state = new State<string>('Hello');

    expect(state.value).toBe('Hello');
  });

  it('should correctly run the callback when there is a state change', done => {
    const state = new State<string>('Hello');

    state.onChange(state => {
      expect(state).toBe('Hello World');

      done();
    });

    state.setValue(state.value + ' World');
  });

  it('should set state when state change returns a promise', done => {
    const state = new State<string>('Hello');

    state.onChange(state => {
      expect(state).toBe('Hello World');

      done();
    });

    state.setValue(Promise.resolve(state.value + ' World'));
  });

  it('should correctly apply a partial patch', done => {
    const state = new State({ title: 'Hello World', foo: true });

    state.onChange(state => {
      expect(state.foo).toBe(false);

      done();
    });

    state.patchValue({ foo: false });
  });

  it('should correctly apply a partial patch when state is a promise', done => {
    const state = new State({ title: 'Hello World', foo: true });

    state.onChange(state => {
      expect(state.foo).toBe(false);

      done();
    });

    state.patchValue(Promise.resolve({ foo: false }));
  });
});
