export interface TemplateOpts {
  tokenPrefix?: string;
  fields?: string[];
}

class NodeMap extends Map<Node, string> {}

export function template() {
  let initialized = false;

  // Track all nodes that can be updated
  const nodes = new NodeMap();

  // watch for nodes being added and removed
  let observer: MutationObserver | null;

  return function (this: HTMLElement) {
    if (initialized) {
      return updateNodes(this, nodes);
    }

    observer = new MutationObserver((records) => {
      for (let { removedNodes, addedNodes } of records) {
        for (let addedNode of addedNodes) {
          trackNode(this, addedNode, nodes);
        }

        for (let removedNode of removedNodes) {
          nodes.delete(removedNode);
        }
      }
    });

    // watch for nodes being added or removed
    observer.observe(this.shadowRoot!, { childList: true });

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

  let node: Node | null = null;

  while ((node = iterator.nextNode())) {
    trackNode(el, node, nodes);
  }
}

function trackNode(el: HTMLElement, node: Node, nodes: NodeMap) {
  const tokenPrefix = '#:';

  if (node instanceof Comment) {
    if (node.nodeValue) {
      const nodeValue = node.nodeValue.trim();

      if (nodeValue.startsWith(tokenPrefix)) {
        const propertyKey = nodeValue.replace(tokenPrefix, '');

        const textNode = document.createTextNode('');
        textNode.nodeValue = Reflect.get(el, propertyKey);

        node.after(textNode);

        nodes.set(textNode, propertyKey);
      }
    }
  } else if (node instanceof Element) {
    for (let attr of node.attributes) {
      if (attr.name.startsWith(tokenPrefix)) {
        const realAttributeName = attr.name.replace(tokenPrefix, '');

        const newAttribute = document.createAttribute(realAttributeName);
        newAttribute.nodeValue = Reflect.get(el, attr.value);

        node.attributes.setNamedItem(newAttribute);

        nodes.set(newAttribute, attr.value);
      }
    }
  }
}
