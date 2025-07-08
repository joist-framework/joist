export interface DefineOpts {
  tagName: string;
  dependsOn?: string[] | (() => Promise<void>);
}

export async function define(opts: DefineOpts, element: CustomElementConstructor): Promise<void> {
  if (!customElements.get(opts.tagName)) {
    if (opts.dependsOn) {
      if (typeof opts.dependsOn === "function") {
        await opts.dependsOn();
      } else {
        await Promise.all(opts.dependsOn.map((d) => customElements.whenDefined(d)));
      }
    }

    customElements.define(opts.tagName, element);
  }
}
