const TOKEN_PREFIX = '#:';

export interface TemplateOpts {}

export interface RenderOpts {
  refresh?: boolean;
}

class NodeMap extends Map<Node, string> {}

export function template(_templateOpts?: TemplateOpts) {
  // make sure we only initialize once
  let initialized = false;

  // Track all nodes that can be updated and their associated property
  const nodes = new NodeMap();

  return function (this: HTMLElement, renderOpts?: RenderOpts) {
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

function updateNodes(el: HTMLElement, nodes: NodeMap) {
  for (let [node, prop] of nodes) {
    const value = Reflect.get(el, prop);

    if (node instanceof Attr && node.name.startsWith(TOKEN_PREFIX)) {
      const realAttributeName = node.name.replace(TOKEN_PREFIX, '');

      if (value) {
        node.ownerElement?.setAttribute(realAttributeName, '');
      } else {
        node.ownerElement?.removeAttribute(realAttributeName);
      }
    } else if (value !== node.nodeValue) {
      node.nodeValue = value;
    }
  }
}

function initializeNodes(el: HTMLElement, nodes: NodeMap) {
  const iterator = document.createTreeWalker(
    el.shadowRoot!,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
  );

  while (iterator.nextNode()) {
    const res = trackNode(el, iterator.currentNode, nodes);

    if (res !== null) {
      iterator.currentNode = res;
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
        const propertyKey = nodeValue.replace(TOKEN_PREFIX, '');
        const textNode = document.createTextNode(Reflect.get(el, propertyKey));

        node.parentElement?.replaceChild(textNode, node);

        nodes.set(textNode, propertyKey);

        return textNode;
      }

      break;
    }

    case Node.ELEMENT_NODE: {
      const element = node as Element;

      for (let attr of element.attributes) {
        const nodeValue = attr.value.trim();

        if (attr.name.startsWith(TOKEN_PREFIX)) {
          const realAttributeName = attr.name.replace(TOKEN_PREFIX, '');
          const realAttribute = document.createAttribute(realAttributeName);

          if (Reflect.get(el, attr.value)) {
            attr.ownerElement?.setAttributeNode(realAttribute);
          }

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
