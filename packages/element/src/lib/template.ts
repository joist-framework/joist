export interface TemplateOpts {
  tokenPrefix?: string;
}

export interface RenderOpts {
  refresh?: boolean;
}

class NodeMap extends Map<Node, string> {}

export function template(templateOpts?: TemplateOpts) {
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
    initializeNodes(this, nodes, templateOpts);

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

function initializeNodes(el: HTMLElement, nodes: NodeMap, options?: TemplateOpts) {
  const iterator = document.createTreeWalker(
    el.shadowRoot!,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
  );

  while (iterator.nextNode()) {
    trackNode(el, iterator.currentNode, nodes, options);
  }
}

/**
 * configures and tracks a given Node so that it can be updated in place later
 */
function trackNode(el: HTMLElement, node: Node, nodes: NodeMap, options?: TemplateOpts) {
  const tokenPrefix = options?.tokenPrefix ?? '#:';

  switch (node.nodeType) {
    case Node.COMMENT_NODE: {
      if (node.nodeValue) {
        const nodeValue = node.nodeValue.trim();

        if (nodeValue.startsWith(tokenPrefix)) {
          const propertyKey = nodeValue.replace(tokenPrefix, '');
          const textNode = document.createTextNode(Reflect.get(el, propertyKey));

          (node as Element).after(textNode);

          nodes.set(textNode, propertyKey);
        }
      }

      break;
    }

    case Node.ELEMENT_NODE: {
      for (let attr of (node as Element).attributes) {
        const nodeValue = attr.value.trim();

        if (nodeValue.startsWith(tokenPrefix)) {
          const propertyKey = nodeValue.replace(tokenPrefix, '');

          attr.value = Reflect.get(el, propertyKey);

          nodes.set(attr, propertyKey);
        }
      }

      break;
    }
  }
}
