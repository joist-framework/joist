const TOKEN_PREFIX = '#:';

class NodeMap extends Map<Node, string> {}

export interface TemplateOpts {}

export interface RenderOpts {
  refresh?: boolean;
}

export function template(_templateOpts?: TemplateOpts) {
  // make sure we only initialize once
  let initialized = false;

  // Track all nodes that can be updated and their associated property
  const nodes = new NodeMap();

  return function render<T extends HTMLElement>(this: T, renderOpts?: RenderOpts) {
    if (renderOpts?.refresh) {
      initialized = false;
      nodes.clear();
    }

    if (initialized) {
      return updateNodes(this, nodes);
    }

    // find and track nodes
    initializeNodes(this, nodes);

    initialized = true;
  };
}

function initializeNodes(el: HTMLElement, nodes: NodeMap) {
  const iterator = document.createTreeWalker(
    el.shadowRoot || el,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
  );

  while (iterator.nextNode()) {
    const res = trackNode(el, iterator.currentNode, nodes);

    if (res !== null) {
      iterator.currentNode = res;
    }
  }
}

function updateNodes(el: HTMLElement, nodes: NodeMap) {
  for (let [node, prop] of nodes) {
    const value = Reflect.get(el, prop);

    const isAttribute = node.nodeType === Node.ATTRIBUTE_NODE;

    if (isAttribute && isBooleanAttributeNode(node as Attr)) {
      manageBooleanAttribute(el, node as Attr);
    } else if (value !== node.nodeValue) {
      node.nodeValue = value;
    }
  }
}

/**
 * configures and tracks a given Node so that it can be updated in place later.
 */
function trackNode(el: HTMLElement, node: Node, nodes: NodeMap): Node | null {
  switch (node.nodeType) {
    case Node.COMMENT_NODE: {
      const nodeValue = node.nodeValue?.trim();

      if (nodeValue?.startsWith(TOKEN_PREFIX)) {
        if (node.parentNode) {
          const propertyKey = nodeValue.replace(TOKEN_PREFIX, '');
          const textNode = document.createTextNode(Reflect.get(el, propertyKey));

          node.parentNode.replaceChild(textNode, node);

          nodes.set(textNode, propertyKey);

          return textNode;
        }
      }

      break;
    }

    case Node.ELEMENT_NODE: {
      const element = node as Element;

      for (let attr of element.attributes) {
        const nodeValue = attr.value.trim();

        if (isBooleanAttributeNode(attr)) {
          manageBooleanAttribute(el, attr);

          nodes.set(attr, attr.value);
        } else if (nodeValue.startsWith(TOKEN_PREFIX)) {
          const propertyKey = nodeValue.replace(TOKEN_PREFIX, '');

          attr.value = Reflect.get(el, propertyKey);

          nodes.set(attr, propertyKey);
        }
      }

      break;
    }
  }

  return null;
}

function isBooleanAttributeNode(attr: Attr) {
  return attr.name.startsWith(TOKEN_PREFIX);
}

function manageBooleanAttribute(el: HTMLElement, attr: Attr) {
  const realAttributeName = attr.name.replace(TOKEN_PREFIX, '');

  if (attr.ownerElement) {
    let value = attr.value.startsWith('!')
      ? !Reflect.get(el, attr.value.replace('!', ''))
      : Reflect.get(el, attr.value);

    if (value) {
      attr.ownerElement.setAttribute(realAttributeName, '');
    } else {
      attr.ownerElement.removeAttribute(realAttributeName);
    }
  }
}
