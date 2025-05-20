import { attr, css, element, html, listen } from "@joist/element";
import { bind } from "@joist/templating";
import { effect, observe } from "@joist/observable";

import type { TodoStatus } from "../services/todo.service.js";

@element({
  tagName: "todo-card",
  shadowDom: [
    css`
      :host {
        align-items: center;
        display: flex;
        padding: 1rem;
        border-bottom: solid 1px #f3f3f3;
      }

      #name {
        flex-grow: 1;
      }

      :host([status="complete"]) #name {
        text-decoration: line-through;
        opacity: 0.5;
      }

      button {
        border: none;
        color: cornflowerblue;
        cursor: pointer;
        font-size: 1rem;
        background: none;
        margin-left: 0.5rem;
      }

      button#remove {
        color: darkred;
      }
    `,
    html`
      <div id="name">
        <j-if bind="!actionState.showStar">
          <template>
            <span style="color: red; font-weight: bold;">!</span>
          </template>
        </j-if>

        <slot></slot>
      </div>

      <button id="remove">remove</button>

      <button id="complete">
        <j-val bind="actionState.value"></j-val>
      </button>
    `,
  ],
})
export class TodoCardElement extends HTMLElement {
  @attr()
  @observe()
  accessor status: TodoStatus = "active";

  @bind({
    compute(i) {
      return {
        value: i.status === "active" ? "complete" : "active",
        showStar: i.status === "complete",
      };
    },
  })
  accessor actionState = {
    value: "active",
    showStar: false,
  };

  @effect()
  onStatusChange() {
    console.log("STATUS CHANGE", this.status);
  }

  @listen("click", "#complete")
  onClick() {
    this.dispatchEvent(new Event("complete", { bubbles: true }));
  }

  @listen("click", "#remove")
  onRemove() {
    this.dispatchEvent(new Event("remove", { bubbles: true }));
  }
}
