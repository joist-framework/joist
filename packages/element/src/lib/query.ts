type Tags = keyof HTMLElementTagNameMap;
type SVGTags = keyof SVGElementTagNameMap;
type MathTags = keyof MathMLElementTagNameMap;

type QueryResult<T> = (updates?: Partial<T>) => T;

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

  return function (this: HTMLElement, updates) {
    if (res) {
      if (updates) {
        for (const update in updates) {
          Reflect.set(res, update, updates[update]);
        }
      }

      return res;
    }

    if (this.shadowRoot) {
      res = this.shadowRoot.querySelector<K>(query);
    } else {
      res = this.querySelector<K>(query);
    }

    if (!res) {
      throw new Error("could not find element");
    }

    if (updates) {
      for (const update in updates) {
        Reflect.set(res, update, updates[update]);
      }
    }

    return res;
  };
}
