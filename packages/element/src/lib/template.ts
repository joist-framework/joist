export interface TempalteOpts {
  refresh?: boolean;
}

export function template(opts?: TempalteOpts) {
  let initialized = false;

  // Track all nodes that can be updated
  const nodes = new Map<Node, () => string>();

  return function (this: HTMLElement) {
    if (opts?.refresh) {
      initialized = false;

      nodes.clear();
    }

    if (initialized) {
      // If intialized, check each node to see if it needs to be updated

      update(nodes);
    } else {
      // If not initialized iterate through template and

      findTemplateNodes(this, nodes);

      initialized = true;
    }
  };
}

function update(nodes: Map<Node, () => string>) {
  for (let [node, templateValue] of nodes) {
    const value = templateValue();

    if (value !== node.nodeValue) {
      node.nodeValue = templateValue();
    }
  }
}

function findTemplateNodes(el: HTMLElement, nodes: Map<Node, () => string>) {
  const iterator = document.createNodeIterator(
    el.shadowRoot!,
    NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
  );

  let node = iterator.nextNode();

  while (node) {
    if (node instanceof Comment) {
      if (node.nodeValue) {
        const nodeValue = node.nodeValue.trim();

        if (nodeValue.startsWith('#:')) {
          const propertyKey = nodeValue.replace('#:', '');
          const templateValue = () => Reflect.get(el, propertyKey);

          const textNode = document.createTextNode(templateValue());
          node.after(textNode);

          nodes.set(textNode, templateValue);
        }
      }
    } else if (node instanceof Element) {
      for (let attr of node.attributes) {
        if (attr.name.startsWith('#:')) {
          const realAttributeName = attr.name.replace('#:', '');
          const templateValue = () => Reflect.get(el, attr.value);

          const newAttribute = document.createAttribute(realAttributeName);
          newAttribute.nodeValue = templateValue();

          node.attributes.setNamedItem(newAttribute);

          nodes.set(newAttribute, templateValue);
        }
      }
    }

    node = iterator.nextNode();
  }
}
