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
    } else {
      for (let update of updates) {
        update();
      }
    }
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

/**
 * configures and tracks a given Node so that it can be updated in place later.
 */
function trackElement(node: Node, updates: Updates, getter: TemplateValueGetter): Node | null {
  const element = node as Element;

  for (let attr of element.attributes) {
    const nodeValue = attr.value.trim();
    const realAttributeName = attr.name.replace(TOKEN_PREFIX, '');

    let update: Updater | null = null;

    if (attr.name.startsWith(`${TOKEN_PREFIX}bind`)) {
      update = () => {
        const value = getter(attr.value);

        if (element.textContent !== value) {
          element.textContent = getter(attr.value);
        }
      };
    } else if (attr.name.startsWith(TOKEN_PREFIX)) {
      const isBooleanAttr = nodeValue.startsWith('!');
      const isPositive = nodeValue.startsWith('!!');
      const propertyKey = nodeValue.replaceAll('!', '');

      if (isBooleanAttr) {
        update = () => {
          let value = isPositive ? !!getter(propertyKey) : !getter(propertyKey);

          if (value) {
            element.setAttribute(realAttributeName, '');
          } else {
            element.removeAttribute(realAttributeName);
          }
        };
      } else {
        const realAttribute = document.createAttribute(realAttributeName);
        element.setAttributeNode(realAttribute);

        update = () => {
          const value = getter(nodeValue);

          if (realAttribute.value !== value) {
            realAttribute.value = value;
          }
        };
      }
    }

    if (update) {
      updates.add(update);

      update();
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
