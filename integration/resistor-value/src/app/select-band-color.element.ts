import { State, component, JoistElement, get } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

import { ResistorBand } from './resistor.service';

export interface SelectBandColorState {
  bands: ResistorBand[];
}

@component<SelectBandColorState>({
  tagName: 'select-band-color',
  shadowDom: 'open',
  state: {
    bands: [],
  },
  render: template(({ state, dispatch }) => {
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
  }),
})
export class SelectBandColorElement extends JoistElement implements SelectBandColorState {
  @get(State) private state!: State<SelectBandColorState>;

  set bands(bands: ResistorBand[]) {
    this.state.setValue({ bands });
  }
}
