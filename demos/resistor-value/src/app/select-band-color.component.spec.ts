import { createComponent, ElementInstance } from '@lit-kit/component';

import { SelectBandColorComponent, SelectBandColorState } from './select-band-color.component';

describe('SelectBandColorComponent', () => {
  let el: ElementInstance<SelectBandColorComponent, SelectBandColorState>;

  beforeEach(() => {
    el = createComponent(SelectBandColorComponent);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
