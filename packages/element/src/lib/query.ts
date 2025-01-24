type Tags = keyof HTMLElementTagNameMap;
type SVGTags = keyof SVGElementTagNameMap;
type MathTags = keyof MathMLElementTagNameMap;

type NodeUpdate<T extends Node> = Partial<T> | ((node: T) => Partial<T>);

type QueryResult<T extends Node> = (updates?: NodeUpdate<T>) => T;

export function query<K extends Tags>(
  selectors: K,
): QueryResult<HTMLElementTagNameMap[K]>;
export function query<K extends SVGTags>(
  selectors: K,
): QueryResult<SVGElementTagNameMap[K]>;
export function query<K extends MathTags>(
  selectors: K,
): QueryResult<MathMLElementTagNameMap[K]>;
export function query<E extends HTMLElement = HTMLElement>(
  selectors: string,
): QueryResult<E>;
export function query<K extends Tags>(
  query: K,
): QueryResult<HTMLElementTagNameMap[K]> {
  let res: HTMLElementTagNameMap[K] | null = null;

  return function (this: HTMLElementTagNameMap[K], updates) {
    if (res) {
      return patchNode(res, updates);
    }

    if (this.shadowRoot) {
      res = this.shadowRoot.querySelector<K>(query);
    } else {
      res = this.querySelector<K>(query);
    }

    if (!res) {
      throw new Error(`could not find ${query}`);
    }

    return patchNode(res, updates);
  };
}

function patchNode<T extends HTMLElement>(
  target: T,
  update?: Partial<T> | ((node: T) => Partial<T>),
): T {
  if (!update) {
    return target;
  }

  const patch = typeof update === "function" ? update(target) : update;

  for (const key in patch) {
    const newValue = patch[key];
    const oldValue = target[key];

    if (newValue && newValue !== oldValue) {
      target[key] = newValue;
    }
  }

  return target;
}
