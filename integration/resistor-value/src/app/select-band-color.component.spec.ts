import { ElementInstance } from '@joist/component';

import { SelectBandColorComponent } from './select-band-color.component';

describe('SelectBandColorComponent', () => {
  let el: ElementInstance<SelectBandColorComponent>;

  beforeEach(() => {
    el = document.createElement('select-band-color') as ElementInstance<SelectBandColorComponent>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
