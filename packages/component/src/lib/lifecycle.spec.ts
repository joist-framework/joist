import { html } from 'lit-html';

import { Component } from './component';
import { createComponent } from './create-component';
import { Prop } from './prop';

describe('Lifecycle', () => {
  describe('OnPropChanges', () => {
    @Component({
      tag: 'prop-changes',
      initialState: {},
      template: () => html``
    })
    class MyComponent {
      @Prop() stringProp: string = '';
      @Prop() objectProp: object = {};
    }

    it('should have correct oldValue and newValue for a primative', done => {
      const el = createComponent(MyComponent);

      el.componentInstance.onPropChanges = (key: string, oldValue: any, newValue: any) => {
        expect(key).toBe('stringProp');
        expect(oldValue).toBe('');
        expect(newValue).toBe('Hello World');

        done();
      };

      el.stringProp = 'Hello World';
    });

    it('should have correct oldValue and newValue for an object', done => {
      const el = createComponent(MyComponent);

      el.componentInstance.onPropChanges = (key: string, oldValue: any, newValue: any) => {
        expect(key).toBe('objectProp');
        expect(oldValue).toEqual({});
        expect(newValue).toEqual({ title: 'Hello World' });

        done();
      };

      el.objectProp = { title: 'Hello World' };
    });
  });
});
