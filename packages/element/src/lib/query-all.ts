type Tags = keyof HTMLElementTagNameMap;
type SVGTags = keyof SVGElementTagNameMap;
type MathTags = keyof MathMLElementTagNameMap;

type NodeUpdate<T extends Node> = Partial<T> | ((node: T) => Partial<T> | null);

type QueryAllResult<T extends Node> = (
  updates?: NodeUpdate<T>,
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
    update?: NodeUpdate<HTMLElementTagNameMap[K]>,
  ) {
    if (res) {
      return patchNodes(res, update);
    }

    if (this.shadowRoot) {
      res = this.shadowRoot.querySelectorAll<K>(query);
    } else {
      res = this.querySelectorAll<K>(query);
    }

    if (!res) {
      throw new Error(`could not find ${query}`);
    }

    return patchNodes(res, update);
  };
}

function patchNodes<T extends HTMLElement>(
  target: NodeListOf<T>,
  update?: NodeUpdate<T>,
): NodeListOf<T> {
  if (!update) {
    return target;
  }

  for (const node of target) {
    const patch = typeof update === "function" ? update(node) : update;

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
