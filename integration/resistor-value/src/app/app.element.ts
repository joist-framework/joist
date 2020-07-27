import './select-band-count.element';
import './resistor.element';
import './select-band-color.element';

import { State, handle, OnConnected, component, JoistElement, get } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

import { ResistorService, ResistorBand } from './resistor.service';

export interface AppState {
  bands: ResistorBand[];
  selectedBands: ResistorBand[];
  availableBands: ResistorBand[];
  bandLimit: number;
  displayColors: boolean;
  resistorValue?: string;
}

@component<AppState>({
  tagName: 'app-root',
  state: {
    bandLimit: 0,
    bands: [],
    selectedBands: [],
    availableBands: [],
    displayColors: false,
  },
  render: template(({ state, run }) => {
    return html`
      <div class="value">
        ${state.displayColors
          ? state.selectedBands.length < state.bandLimit
            ? html` <span>${state.selectedBands.length}/${state.bandLimit} Bands</span> `
            : html` <span>${state.resistorValue} &#8486;</span> `
          : html` <span>Select Resistor Bands</span> `}
      </div>

      <resistor-value .bands=${state.selectedBands}></resistor-value>

      <select-band-count
        .bandLimit=${state.bandLimit}
        .selectedBands=${state.selectedBands}
        @band_count_selected=${run('BAND_COUNT_SELECTED')}
      ></select-band-count>

      <select-band-color
        class="${state.displayColors ? 'slide-up' : 'slide-down'}"
        .bands=${state.availableBands}
        @band_selected=${run('BAND_SELECTED')}
      ></select-band-color>
    `;
  }),
})
export class AppElement extends JoistElement implements OnConnected {
  @get(State)
  private state!: State<AppState>;

  @get(ResistorService)
  private resistor!: ResistorService;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const bands = this.resistor.getResistorBands();

    this.state.patchValue({ bands });
  }

  @handle('BAND_COUNT_SELECTED') onBandCountSelected(e: CustomEvent<number>): void {
    const bandLimit = e.detail;

    this.state.patchValue({
      selectedBands: [],
      resistorValue: undefined,
      bandLimit,
      displayColors: bandLimit > 0,
      availableBands: this.getAvailableBands([], bandLimit),
    });
  }

  @handle('BAND_SELECTED') onBandSelected(e: CustomEvent<ResistorBand>): void {
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
