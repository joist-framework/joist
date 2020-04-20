import { ElementInstance } from '@lit-kit/component';

import { SelectBandColorComponent, SelectBandColorState } from './select-band-color.component';

describe('SelectBandColorComponent', () => {
  let el: ElementInstance<SelectBandColorComponent, SelectBandColorState>;

  beforeEach(() => {
    el = document.createElement('select-band-color') as ElementInstance<
      SelectBandColorComponent,
      SelectBandColorState
    >;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
