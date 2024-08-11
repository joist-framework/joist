export interface TemplateOpts {}

export interface RenderOpts {
  refresh?: boolean;
}

class NodeMap extends Map<Node, string> {}

export function template(_templateOpts?: RenderOpts) {
  // make sure we only initialize once
  let initialized = false;

  // Track all nodes that can be updated and their associated property
  const nodes = new NodeMap();

  return function (this: HTMLElement, renderOpts?: RenderOpts) {
    if (renderOpts?.refresh) {
      initialized = false;
    }

    if (initialized) {
      return updateNodes(this, nodes);
    }

    // find and track nodes
    initializeNodes(this, nodes);

    initialized = true;
  };
}

function updateNodes(el: HTMLElement, nodes: NodeMap) {
  for (let [node, prop] of nodes) {
    const value = Reflect.get(el, prop);

    if (value !== node.nodeValue) {
      node.nodeValue = value;
    }
  }
}

function initializeNodes(el: HTMLElement, nodes: NodeMap) {
  const iterator = document.createNodeIterator(
    el.shadowRoot!,
    NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
  );

  while (iterator.nextNode()) {
    trackNode(el, iterator.referenceNode, nodes);
  }
}

function trackNode(el: HTMLElement, node: Node, nodes: NodeMap) {
  const tokenPrefix = '#:';

  if (node instanceof Comment) {
    if (node.nodeValue) {
      const nodeValue = node.nodeValue.trim();

      if (nodeValue.startsWith(tokenPrefix)) {
        const propertyKey = nodeValue.replace(tokenPrefix, '');
        const textNode = document.createTextNode(Reflect.get(el, propertyKey));

        node.replaceWith(textNode);

        nodes.set(textNode, propertyKey);
      }
    }
  } else if (node instanceof Element) {
    for (let attr of node.attributes) {
      if (attr.value.startsWith(tokenPrefix)) {
        const propertyKey = attr.value.replace(tokenPrefix, '');

        attr.value = Reflect.get(el, propertyKey);

        nodes.set(attr, propertyKey);
      }
    }
  }
}
