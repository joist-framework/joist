type Tags = keyof HTMLElementTagNameMap;
type SVGTags = keyof SVGElementTagNameMap;
type MathTags = keyof MathMLElementTagNameMap;

type QueryAllResult<T extends Node> = (
  updates?: (node: T) => Partial<T> | null,
) => NodeListOf<T>;

export function queryAll<K extends Tags>(
  selectors: K,
): QueryAllResult<HTMLElementTagNameMap[K]>;
export function queryAll<K extends SVGTags>(
  selectors: K,
): QueryAllResult<SVGElementTagNameMap[K]>;
export function queryAll<K extends MathTags>(
  selectors: K,
): QueryAllResult<MathMLElementTagNameMap[K]>;
export function queryAll<E extends HTMLElement = HTMLElement>(
  selectors: string,
): QueryAllResult<E>;
export function queryAll<K extends Tags>(
  query: K,
): QueryAllResult<HTMLElementTagNameMap[K]> {
  let res: NodeListOf<HTMLElementTagNameMap[K]> | null = null;

  return function (
    this: HTMLElementTagNameMap[K],
    update?: (
      node: HTMLElementTagNameMap[K],
    ) => Partial<HTMLElementTagNameMap[K]> | null,
  ) {
    if (res) {
      return patch(res, update);
    }

    if (this.shadowRoot) {
      res = this.shadowRoot.querySelectorAll<K>(query);
    } else {
      res = this.querySelectorAll<K>(query);
    }

    if (!res) {
      throw new Error(`could not find ${query}`);
    }

    return patch(res, update);
  };
}

function patch<T extends HTMLElement>(
  target: NodeListOf<T>,
  updates?: (node: T) => Partial<T> | null,
): NodeListOf<T> {
  if (!updates) {
    return target;
  }

  for (const node of target) {
    const patch = updates(node);

    if (patch) {
      for (const update in patch) {
        const newValue = patch[update];
        const oldValue = node[update];
        if (newValue && newValue !== oldValue) {
          node[update] = newValue;
        }
      }
    }
  }

  return target;
}
