import { define } from "@joist/element/define.js";

import { JoistAsyncElement } from "./elements/async.element.js";
import { JoistForElement } from "./elements/for.element.js";
import { JoistIfElement } from "./elements/if.element.js";
import { JoistBindElement } from "./elements/bind.element.js";
import { JoistValueElement } from "./elements/value.element.js";
import { JoistScopeElement } from "./elements/scope.element.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-async": JoistAsyncElement;
    "j-for": JoistForElement;
    "j-if": JoistIfElement;
    "j-bind": JoistBindElement;
    "j-val": JoistValueElement;
    "j-scope": JoistScopeElement;
  }
}

define({ tagName: "j-async" }, JoistAsyncElement);
define({ tagName: "j-for" }, JoistForElement);
define({ tagName: "j-if" }, JoistIfElement);
define({ tagName: "j-bind" }, JoistBindElement);
define({ tagName: "j-val" }, JoistValueElement);
define({ tagName: "j-scope" }, JoistScopeElement);
