const TOKEN_PREFIX = '#:';

type Updater = () => void;
class Updates extends Set<Updater> {}
type TemplateValueGetter = (key: string) => string;

export interface TemplateOpts {
  value?: TemplateValueGetter;
}

export interface RenderOpts {}

export function template(templateOpts?: TemplateOpts) {
  // Track all nodes that can be updated and their associated property
  let updates: Updates | null = null;

  return function render<T extends HTMLElement>(this: T) {
    if (!updates) {
      updates = findUpdates(
        this,
        templateOpts?.value ?? ((key: string) => getTemplateValue(this, key))
      );
    }

    updateNodes(updates);
  };
}

function findUpdates(el: HTMLElement, getter: TemplateValueGetter): Updates {
  const iterator = document.createTreeWalker(el.shadowRoot ?? el, NodeFilter.SHOW_ELEMENT);
  const updates = new Updates();

  while (iterator.nextNode()) {
    const res = trackElement(iterator.currentNode, updates, getter);

    if (res !== null) {
      iterator.currentNode = res;
    }
  }

  return updates;
}

function updateNodes(nodes: Updates) {
  for (let update of nodes) {
    update();
  }
}

/**
 * configures and tracks a given Node so that it can be updated in place later.
 */
function trackElement(node: Node, updates: Updates, getter: TemplateValueGetter): Node | null {
  const element = node as Element;

  for (let attr of element.attributes) {
    if (attr.name.startsWith(`${TOKEN_PREFIX}bind`)) {
      updates.add(() => {
        const value = getter(attr.value);

        if (element.textContent !== value) {
          element.textContent = getter(attr.value);
        }
      });
    } else {
      const nodeName = attr.name.trim();
      const nodeValue = attr.value.trim();

      if (nodeName.startsWith(TOKEN_PREFIX)) {
        const realAttributeName = attr.name.replace(TOKEN_PREFIX, '');
        const isNegative = attr.value.startsWith('!');

        updates.add(() => {
          let value = isNegative ? !getter(attr.value.replace('!', '')) : getter(attr.value);

          if (value) {
            element.setAttribute(realAttributeName, '');
          } else {
            element.removeAttribute(realAttributeName);
          }
        });
      } else if (nodeValue.startsWith(TOKEN_PREFIX)) {
        const propertyKey = nodeValue.replace(TOKEN_PREFIX, '');

        updates.add(() => {
          const value = getter(propertyKey);

          if (attr.value !== value) {
            attr.value = value;
          }
        });
      }
    }
  }

  return null;
}

export function getTemplateValue(obj: object, key: string) {
  const parsed = key.split('.');

  let pointer: any = obj;

  for (let part of parsed) {
    pointer = pointer[part];
  }

  return pointer;
}
