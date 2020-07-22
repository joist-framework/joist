import { State, Component, JoistElement, Get } from '@joist/component';
import { html } from 'lit-html';

import { ResistorBand } from './resistor.service';

export interface SelectBandColorState {
  bands: ResistorBand[];
}

@Component<SelectBandColorState>({
  state: {
    bands: [],
  },
  render({ state, dispatch }) {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          padding: 0.5rem 0;
          background: #fff;
          box-shadow: 0 -7px 6px rgba(0, 0, 0, 0.05);
          overflow-y: auto;
        }

        button {
          align-items: center;
          background: none;
          font-size: 1rem;
          display: flex;
          padding: 0.5rem 1rem;
          border: none;
          width: 100%;
          cursor: pointer;
        }

        .color-block {
          border-radius: 10px;
          height: 2rem;
          width: 5rem;
          display: inline-block;
          margin-right: 1rem;
        }
      </style>

      ${state.bands.map((band) => {
        return html`
          <button @click=${dispatch('band_selected', { detail: band })}>
            <div class="color-block" .style="background: ${band.color}"></div>

            <span>${band.color}</span>
          </button>
        `;
      })}
    `;
  },
})
export class SelectBandColorElement extends JoistElement implements SelectBandColorState {
  @Get(State) private state!: State<SelectBandColorState>;

  set bands(bands: ResistorBand[]) {
    this.state.setValue({ bands });
  }

  get bands() {
    return this.state.value.bands;
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('select-band-color', SelectBandColorElement);
