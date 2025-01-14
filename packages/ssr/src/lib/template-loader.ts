import { readFile } from "node:fs/promises";

/**
 * A template loader defines how css and html are generated for a given component template.
 */
export interface TemplateLoader {
  loadHTML(tag: string): Promise<string | null>;
  loadCSS(tag: string): Promise<string | null>;
}

export type PathFn = (tag: string) => string;

export class FileSysTemplateLoader implements TemplateLoader {
  #html: PathFn;
  #css: PathFn;

  constructor(html: PathFn, css: PathFn) {
    this.#html = html;
    this.#css = css;
  }

  async loadHTML(tag: string): Promise<string | null> {
    try {
      return await readFile(this.#html(tag)).then((res) => res.toString());
    } catch {
      return null;
    }
  }

  async loadCSS(tag: string): Promise<string | null> {
    try {
      return await readFile(this.#css(tag)).then((res) => res.toString());
    } catch {
      return null;
    }
  }
}
