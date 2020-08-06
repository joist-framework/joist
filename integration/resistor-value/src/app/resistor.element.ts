import { component, State, JoistElement, get, property, OnPropChanges } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { ResistorBand } from './resistor.service';

@component<ResistorBand[]>({
  tagName: 'resistor-value',
  shadowDom: 'open',
  state: [],
  render: template(({ state }) => {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          --border: solid 1px gray;
          --background: linear-gradient(
            to bottom,
            rgb(224, 224, 224) 0%,
            rgba(204, 204, 204, 1) 100%
          );
        }

        :host::before,
        :host::after {
          content: '';
          height: 0.4rem;
          background: gray;
          width: 1.5rem;
        }

        .middle {
          background: var(--background);
          height: 5rem;
          margin: 0 -30px;
          position: relative;
          flex-grow: 1;
          display: flex;
          justify-content: space-between;
        }

        .start,
        .end {
          background: var(--background);
          border-radius: 50%;
          width: 6rem;
          height: 5.5rem;
        }

        @keyframes grow {
          0% {
            transform: scaleY(0);
          }

          100% {
            transform: scaleY(1);
          }
        }

        .band {
          animation: grow;
          animation-duration: 300ms;
          width: 0.5rem;
          height: 100%;
        }

        .band:last-child {
          margin-right: 0;
        }
      </style>

      <section class="start"></section>

      <section class="middle">
        ${state.map((band) => html`<div class="band" .style="background: ${band.color}"></div>`)}
      </section>

      <section class="end"></section>
    `;
  }),
})
export class ResistorElement extends JoistElement implements OnPropChanges {
  @get(State)
  private state!: State<ResistorBand[]>;

  @property()
  public bands: ResistorBand[] = [];

  onPropChanges() {
    this.state.setValue(this.bands);
  }
}
