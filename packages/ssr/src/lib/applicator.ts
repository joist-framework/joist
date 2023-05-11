import { CheerioAPI, load } from 'cheerio';

import { TemplateCache } from './template-cache.js';
import { TemplateLoader } from './template-loader.js';

export interface ApplicatorOpts {
  templateCache: TemplateCache;
  templateLoader: TemplateLoader;
}

export class Applicator {
  #templateCache: TemplateCache;
  #templateLoader: TemplateLoader;

  constructor(templateCache: TemplateCache, templateLoader: TemplateLoader) {
    this.#templateCache = templateCache;
    this.#templateLoader = templateLoader;
  }

  async apply(document: string, elements: string[]) {
    const $ = load(document);

    return this.build($, elements);
  }

  async build($: CheerioAPI, elements: string[]): Promise<string> {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const node = $(element);

      if (node.length) {
        let elementTemplate = await this.#templateCache.get(element);

        if (!elementTemplate) {
          const template = await this.#buildTemplate(element);
          elementTemplate = await this.build(load(template, null, false), elements);

          await this.#templateCache.set(element, elementTemplate);
        }

        if (node.find('> template[shadowroot]').length === 0) {
          node.prepend(elementTemplate);
        }
      }
    }

    return $.html();
  }

  async #buildTemplate(tag: string) {
    const [html, styles] = await Promise.all([
      this.#templateLoader.loadHTML(tag),
      this.#templateLoader.loadCSS(tag),
    ]);

    return `<template shadowroot="open">
      ${styles ? `<style>${styles}</style>` : ''}
      ${html || ''}
    </template>
  `;
  }
}
