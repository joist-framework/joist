import { html } from 'lit-html';

import { defineElement, ElementInstance } from './define_element';
import { Prop } from './prop';
import { Component } from './component';

describe('Lifecycle', () => {
  describe('OnPropChanges', () => {
    @Component({
      state: {},
      render: () => html``,
    })
    class MyComponent {
      @Prop() stringProp: string = '';
      @Prop() objectProp: object = {};
    }

    customElements.define('prop-changes-1', defineElement(MyComponent));

    it('should have correct oldValue and newValue for a primative', (done) => {
      const el = document.createElement('prop-changes-1') as ElementInstance<MyComponent>;

      el.componentInstance.onPropChanges = (key: string, oldValue: any, newValue: any) => {
        expect(key).toBe('stringProp');
        expect(oldValue).toBe('');
        expect(newValue).toBe('Hello World');

        done();
      };

      el.stringProp = 'Hello World';
    });

    it('should have correct oldValue and newValue for an object', (done) => {
      const el = document.createElement('prop-changes-1') as ElementInstance<MyComponent>;

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
