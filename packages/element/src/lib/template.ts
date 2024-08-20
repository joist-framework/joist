const TOKEN_PREFIX = '#:';

class NodeMap extends Map<Node, string> {}

type TemplateValueGetter = (key: string) => string;

export interface TemplateOpts {
  value?: TemplateValueGetter;
}

export interface RenderOpts {
  refresh?: boolean;
}

export function template(templateOpts?: TemplateOpts) {
  // Track all nodes that can be updated and their associated property
  const nodes = new NodeMap();

  let getter: ((key: string) => string) | null = null;

  // the first time this function is all it initializes all nodes
  // the second time it updates exisitng nodes
  return function render<T extends HTMLElement>(this: T, renderOpts?: RenderOpts) {
    if (renderOpts?.refresh) {
      getter = null;
      nodes.clear();
    }

    if (getter) {
      updateNodes(nodes, getter);
    } else {
      getter = templateOpts?.value ?? ((key: string) => String(Reflect.get(this, key)));

      // find and track nodes
      initializeNodes(this, nodes, getter);
    }
  };
}

function initializeNodes(el: HTMLElement, nodes: NodeMap, getter: TemplateValueGetter) {
  const iterator = document.createTreeWalker(el.shadowRoot || el, NodeFilter.SHOW_ELEMENT);

  while (iterator.nextNode()) {
    const res = trackNode(iterator.currentNode, nodes, getter);

    if (res !== null) {
      iterator.currentNode = res;
    }
  }
}

function updateNodes(nodes: NodeMap, getter: TemplateValueGetter) {
  for (let [node, prop] of nodes) {
    const value = getter(prop);

    const isAttribute = node.nodeType === Node.ATTRIBUTE_NODE;

    if (isAttribute && isBooleanAttributeNode(node as Attr)) {
      manageBooleanAttribute(node as Attr, getter);
    } else if (value !== node.nodeValue) {
      node.textContent = value;
    }
  }
}

/**
 * configures and tracks a given Node so that it can be updated in place later.
 */
function trackNode(node: Node, nodes: NodeMap, getter: TemplateValueGetter): Node | null {
  const element = node as Element;

  for (let attr of element.attributes) {
    if (attr.name.startsWith(`${TOKEN_PREFIX}bind`)) {
      element.textContent = getter(attr.value);

      nodes.set(element, attr.value);
    } else {
      const nodeValue = attr.value.trim();

      if (isBooleanAttributeNode(attr)) {
        manageBooleanAttribute(attr, getter);

        nodes.set(attr, attr.value);
      } else if (nodeValue.startsWith(TOKEN_PREFIX)) {
        const propertyKey = nodeValue.replace(TOKEN_PREFIX, '');

        attr.value = getter(propertyKey);

        nodes.set(attr, propertyKey);
      }
    }
  }

  return null;
}

function isBooleanAttributeNode(attr: Attr) {
  return attr.name.startsWith(TOKEN_PREFIX);
}

function manageBooleanAttribute(attr: Attr, getter: TemplateValueGetter) {
  const realAttributeName = attr.name.replace(TOKEN_PREFIX, '');

  if (attr.ownerElement) {
    let value = attr.value.startsWith('!')
      ? !getter(attr.value.replace('!', ''))
      : getter(attr.value);

    if (value) {
      attr.ownerElement.setAttribute(realAttributeName, '');
    } else {
      attr.ownerElement.removeAttribute(realAttributeName);
    }
  }
}
