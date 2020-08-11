import { State, handle, OnConnected, component, JoistElement, get } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { ResistorService, ResistorBand } from './resistor.service';

export interface AppState {
  bands: ResistorBand[];
  selectedBands: ResistorBand[];
  availableBands: ResistorBand[];
  bandLimit: number;
  displayColors: boolean;
  resistorValue?: string;
}

function createBandValueVisual(state: AppState) {
  if (state.displayColors) {
    if (state.selectedBands.length < state.bandLimit) {
      return html`<span>${state.selectedBands.length}/${state.bandLimit} Bands</span>`;
    }

    return html`<span>${state.resistorValue} &#8486;</span>`;
  }

  return html`<span>Select Resistor Bands</span>`;
}

@component<AppState>({
  tagName: 'app-root',
  shadowDom: 'open',
  state: {
    bandLimit: 0,
    bands: [],
    selectedBands: [],
    availableBands: [],
    displayColors: false,
  },
  render: template(({ state, run }) => {
    return html`
      <div class="value">${createBandValueVisual(state)}</div>

      <resistor-value .bands=${state.selectedBands}></resistor-value>

      <select-band-count
        .bandLimit=${state.bandLimit}
        .selectedBands=${state.selectedBands}
        @band_count_selectd=${run('band_count_selectd')}
      ></select-band-count>

      <select-band-color
        class="${state.displayColors ? 'slide-up' : 'slide-down'}"
        .bands=${state.availableBands}
        @band_selected=${run('band_selected')}
      ></select-band-color>
    `;
  }),
})
export class AppElement extends JoistElement implements OnConnected {
  @get(State)
  private state!: State<AppState>;

  @get(ResistorService)
  private resistor!: ResistorService;

  connectedCallback() {
    super.connectedCallback();

    this.state.patchValue({ bands: this.resistor.getResistorBands() });
  }

  @handle('band_count_selectd') onBandCountSelected(e: CustomEvent<number>): void {
    const bandLimit = e.detail;

    this.state.patchValue({
      selectedBands: [],
      resistorValue: undefined,
      bandLimit,
      displayColors: bandLimit > 0,
      availableBands: this.getAvailableBands([], bandLimit),
    });
  }

  @handle('band_selected') onBandSelected(e: CustomEvent<ResistorBand>): void {
    if (this.state.value.selectedBands.length >= this.state.value.bandLimit) {
      return void 0;
    }

    const selectedBands = [...this.state.value.selectedBands, e.detail];

    this.state.patchValue({
      selectedBands,
      availableBands: this.getAvailableBands(selectedBands, this.state.value.bandLimit),
      resistorValue: this.resistor.getResistorValue(selectedBands, this.state.value.bandLimit),
    });
  }

  private getAvailableBands(selectedBands: ResistorBand[], bandLimit: number): ResistorBand[] {
    if (selectedBands.length + 1 === bandLimit - 1) {
      return this.resistor.getMultiplierBands();
    } else if (selectedBands.length + 1 === bandLimit) {
      return this.resistor.getToleranceBands();
    }

    return this.resistor.getValueBands();
  }
}
