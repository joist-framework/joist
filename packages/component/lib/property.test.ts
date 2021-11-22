import { WithProps } from './property';

describe('property', () => {
  it('should read the correct property definitions', () => {
    class MyEl extends WithProps(HTMLElement) {
      counter = 0;

      onPropChanges(val: any) {
        console.log('props changed!', Array.from(val.values()));

        this.innerHTML = this.counter.toString();
      }
    }

    customElements.define('my-el', MyEl);

    const el = new MyEl();

    document.body.appendChild(el);

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
  });
});
