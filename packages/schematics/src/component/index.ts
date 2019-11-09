import { Rule, url, apply, template, mergeWith, chain } from '@angular-devkit/schematics';
import { classify } from '@angular-devkit/core/src/utils/strings';

const stringUtils = { classify };

export interface ComponentOptions {
  name: string;
}

export function component(options: ComponentOptions): Rule {
  return () => {
    return chain([
      (tree, context) => {
        const sourceTemplates = url('./files');
        const completedTemplates = apply(sourceTemplates, [
          template({ ...options, ...stringUtils })
        ]);

        return mergeWith(completedTemplates)(tree, context);
      },
      tree => {
        const parsed = options.name.split('/');
        const name = parsed[parsed.length - 1];

        tree.rename(`./component.ts.template`, `${options.name}/${name}.component.ts`);
        tree.rename(`./component.spec.ts.template`, `${options.name}/${name}.component.spec.ts`);

        return tree;
      }
    ]);
  };
}
