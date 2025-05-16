import "./for.element.js";
import "./value.element.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should iterate over an iterable", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({
          oldValue: null,
          newValue: new Set([
            { id: "123", label: "Hello" },
            { id: "456", label: "World" },
          ]),
        });
      }}
    >
      <ul>
        <j-for bind="items" key="id">
          <template>
            <li>
              <j-val bind="each.value.label"></j-val>
            </li>
          </template>
        </j-for>
      </ul>
    </div>
  `);

  const listItems = element.querySelectorAll("li");

  assert.equal(listItems.length, 2);
  assert.equal(listItems[0].textContent?.trim(), "Hello");
  assert.equal(listItems[1].textContent?.trim(), "World");
});

it("should handle empty arrays", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({
          oldValue: null,
          newValue: [],
        });
      }}
    >
      <j-for bind="items">
        <template>
          <div>Item</div>
        </template>
      </j-for>
    </div>
  `);

  assert.equal(element.querySelectorAll("div").length, 0);
});

it("should update when items are added or removed", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        // Initial items
        e.update({
          oldValue: null,
          newValue: [
            { id: "1", text: "First" },
            { id: "2", text: "Second" },
          ],
        });

        // Add an item
        e.update({
          oldValue: null,
          newValue: [
            { id: "1", text: "First" },
            { id: "2", text: "Second" },
            { id: "3", text: "Third" },
          ],
        });

        // Remove an item
        e.update({
          oldValue: null,
          newValue: [
            { id: "1", text: "First" },
            { id: "3", text: "Third" },
          ],
        });
      }}
    >
      <j-for bind="items" key="id">
        <template>
          <j-val bind="each.value.text"></j-val>
        </template>
      </j-for>
    </div>
  `);

  const items = element.querySelectorAll("j-val");
  assert.equal(items.length, 2);
  assert.equal(items[0].textContent?.trim(), "First");
  assert.equal(items[1].textContent?.trim(), "Third");
});

it("should provide index and position information", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({
          oldValue: null,
          newValue: ["A", "B", "C"],
        });
      }}
    >
      <j-for bind="items">
        <template>
          <j-val bind="each.value"></j-val>
          (index: <j-val bind="each.index"></j-val>, position: <j-val bind="each.position"></j-val>)
        </template>
      </j-for>
    </div>
  `);

  const items = element.querySelectorAll("j-for-scope");
  assert.equal(items.length, 3);
  assert.equal(
    items[0].textContent?.trim().replaceAll("\n", "").replaceAll(" ", ""),
    "A(index:0,position:1)",
  );
  assert.equal(
    items[1].textContent?.trim().replaceAll("\n", "").replaceAll(" ", ""),
    "B(index:1,position:2)",
  );
  assert.equal(
    items[2].textContent?.trim().replaceAll("\n", "").replaceAll(" ", ""),
    "C(index:2,position:3)",
  );
});

// it("should handle nested j-for elements", () => {
//   const element = fixtureSync(html`
//     <div
//       @joist::value=${(e: JoistValueEvent) => {
//         e.update({
//           oldValue: null,
//           newValue: [
//             { id: "1", items: ["A", "B"] },
//             { id: "2", items: ["C", "D"] },
//           ],
//         });
//       }}
//     >
//       <j-for bind="groups" key="id">
//         <template>
//           <div class="group">
//             <j-for bind="each.value.items">
//               <template>
//                 <j-val class="child" bind="each.value"></j-val>
//               </template>
//             </j-for>
//           </div>
//         </template>
//       </j-for>
//     </div>
//   `);

//   const groups = element.querySelectorAll(".group");
//   assert.equal(groups.length, 2);

//   const items = element.querySelectorAll(".child");
//   assert.equal(items.length, 4);
//   assert.equal(items[0].textContent?.trim(), "A");
//   assert.equal(items[1].textContent?.trim(), "B");
//   assert.equal(items[2].textContent?.trim(), "C");
//   assert.equal(items[3].textContent?.trim(), "D");
// });

it("should maintain DOM order when items are reordered", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        // Initial order
        e.update({
          oldValue: null,
          newValue: [
            { id: "1", text: "First" },
            { id: "2", text: "Second" },
            { id: "3", text: "Third" },
          ],
        });

        // Reorder items
        e.update({
          oldValue: null,
          newValue: [
            { id: "3", text: "Third" },
            { id: "1", text: "First" },
            { id: "2", text: "Second" },
          ],
        });
      }}
    >
      <j-for bind="items" key="id">
        <template>
          <j-val bind="each.value.text"></j-val>
        </template>
      </j-for>
    </div>
  `);

  const items = element.querySelectorAll("j-val");
  assert.equal(items.length, 3);
  assert.equal(items[0].textContent?.trim(), "Third");
  assert.equal(items[1].textContent?.trim(), "First");
  assert.equal(items[2].textContent?.trim(), "Second");
});
