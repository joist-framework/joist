import { Component, Prop, StateRef, State, OnPropChanges } from '@lit-kit/component';
import { html } from 'lit-html';

import { ResistorBand } from './resistor.service';

@Component<ResistorBand[]>({
  tag: 'resistor-value',
  initialState: [],
  useShadowDom: true,
  styles: [
    `
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
    `
  ],
  template(state) {
    return html`
      <section class="start"></section>

      <section class="middle">
        ${state.map(band => {
          return html`
            <div class="band" .style="background: ${band.color}"></div>
          `;
        })}
      </section>

      <section class="end"></section>
    `;
  }
})
export class ResistorComponent implements OnPropChanges {
  @Prop() bands: ResistorBand[] = [];

  constructor(@StateRef private state: State<ResistorBand[]>) {}

  onPropChanges() {
    this.state.setValue(this.bands);
  }
}
