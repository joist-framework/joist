import { Component } from '@lit-kit/component';
import { html } from 'lit-html';

@Component({
  tag: 'app-loader',
  defaultState: null,
  style: html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 57px;
        height: 11px;
      }

      :host div {
        position: absolute;
        top: 0;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fff;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
      }
      :host div:nth-child(1) {
        left: 6px;
        animation: lds-ellipsis1 0.6s infinite;
      }
      :host div:nth-child(2) {
        left: 6px;
        animation: lds-ellipsis2 0.6s infinite;
      }
      :host div:nth-child(3) {
        left: 26px;
        animation: lds-ellipsis2 0.6s infinite;
      }
      :host div:nth-child(4) {
        left: 45px;
        animation: lds-ellipsis3 0.6s infinite;
      }
      @keyframes lds-ellipsis1 {
        0% {
          transform: scale(0);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes lds-ellipsis3 {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(0);
        }
      }
      @keyframes lds-ellipsis2 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(19px, 0);
        }
      }
    </style>
  `,
  template() {
    return html`
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    `;
  }
})
export class LoaderComponent {}
