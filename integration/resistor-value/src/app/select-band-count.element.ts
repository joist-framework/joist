import { State, component, JoistElement, get, property, OnPropChanges } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

import { ResistorBand } from './resistor.service';

interface SelectBandCountState {
  bandLimit: number;
  selectedBands: ResistorBand[];
}

@component<SelectBandCountState>({
  tagName: 'select-band-count',
  shadowDom: 'open',
  state: {
    bandLimit: 0,
    selectedBands: [],
  },
  render: template(({ state, dispatch }) => {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
        }

        res-animator {
          position: absolute;
          left: 0.5rem;
          right: 0.5rem;
          top: 0;
        }

        button {
          background: var(--color-primary);
          border: none;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
          padding: 1rem;
          cursor: pointer;
          color: #fff;
          font-size: 1rem;
          display: block;
          width: 100%;
          margin-bottom: 1rem;
          border-radius: 0.4rem;
        }

        .band-buttons {
          display: flex;
        }

        .band-buttons button {
          flex-grow: 1;
          margin-right: 1rem;
          margin-bottom: 0;
        }

        .band-buttons button:last-child {
          margin-right: 0;
        }

        .scale-in {
          animation: scale-in 0.3s;
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }

          100% {
            transform: translateY(1);
            opacity: 1;
          }
        }
      </style>

      ${state.bandLimit
        ? html`
            <button class="scale-in" @click=${dispatch('band_count_selected', { detail: 0 })}>
              clear
            </button>
          `
        : html`
            <div class="band-buttons scale-in">
              <button @click=${dispatch('band_count_selected', { detail: 4 })}>4 Bands</button>
              <button @click=${dispatch('band_count_selected', { detail: 5 })}>5 Bands</button>
              <button @click=${dispatch('band_count_selected', { detail: 6 })}>6 Bands</button>
            </div>
          `}
    `;
  }),
})
export class SelectBandCountElement extends JoistElement implements OnPropChanges {
  @get(State)
  private state!: State<SelectBandCountState>;

  @property()
  public bandLimit: number = 0;

  @property()
  public selectedBands: ResistorBand[] = [];

  onPropChanges() {
    this.state.setValue({
      bandLimit: this.bandLimit,
      selectedBands: this.selectedBands,
    });
  }
}
