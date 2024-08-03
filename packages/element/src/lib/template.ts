export function template() {
  const values = new Map<string, Node>();

  return function (this: HTMLElement) {
    const iterator = document.createNodeIterator(
      this.shadowRoot!,
      NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
    );

    let node: Node | null;

    while ((node = iterator.nextNode())) {
      if (node instanceof Comment) {
        if (node.nodeValue) {
          const nodeValue = node.nodeValue.trim();

          if (nodeValue.startsWith('#:')) {
            const parsedNodeValue = nodeValue.replace('#:', '');

            const templateNode = values.get(parsedNodeValue);
            const templateValue = Reflect.get(this, parsedNodeValue);

            if (templateNode) {
              if (templateNode.nodeValue !== templateValue) {
                templateNode.nodeValue = templateValue;
              }
            } else {
              const textValue = document.createTextNode(templateValue);

              node.after(textValue);
              values.set(parsedNodeValue, textValue);
            }
          }
        }
      } else if (node instanceof Element) {
        for (let attr of node.attributes) {
          if (attr.name.startsWith('#:')) {
            const templateValue = Reflect.get(this, attr.value);
            const realAttributeName = attr.name.replace('#:', '');

            if (templateValue !== node.getAttribute(realAttributeName)) {
              node.setAttribute(realAttributeName, templateValue);
            }
          }
        }
      }
    }
  };
}
