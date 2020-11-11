import { expect } from '@open-wc/testing';
import { spy } from 'sinon';

import { State } from './state';

describe('state', () => {
  it('should correctly set the default state', () => {
    const state = new State<string>('Hello');

    expect(state.value).to.equal('Hello');
  });

  it('should correctly run the callback when there is a state change', (done) => {
    const state = new State<string>('Hello');

    state.onChange((state) => {
      expect(state).to.equal('Hello World');

      done();
    });

    state.setValue(state.value + ' World');
  });

  it('should set state when state change returns a promise', (done) => {
    const state = new State<string>('Hello');

    state.onChange((state) => {
      expect(state).to.equal('Hello World');

      done();
    });

    state.setValue(Promise.resolve(state.value + ' World'));
  });

  it('should correctly apply a partial patch', (done) => {
    const state = new State({ title: 'Hello World', foo: true });

    state.onChange((state) => {
      expect(state.foo).to.equal(false);

      done();
    });

    state.patchValue({ foo: false });
  });

  it('should correctly apply a partial patch when state is a promise', (done) => {
    const state = new State({ title: 'Hello World', foo: true });

    state.onChange((state) => {
      expect(state.foo).to.be.false;

      done();
    });

    state.patchValue(Promise.resolve({ foo: false }));
  });

  it('should remove a current listener', async () => {
    const state = new State(0);

    const spys = {
      cb() {},
    };

    spy(spys, 'cb');

    const remove = state.onChange(spys.cb);

    await state.setValue(1);

    remove();

    await state.setValue(2);

    expect(spys.cb).calledOnce;
  });
});
