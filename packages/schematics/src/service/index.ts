import { Rule, url, apply, template, mergeWith, chain } from '@angular-devkit/schematics';
import { classify } from '@angular-devkit/core/src/utils/strings';

const stringUtils = { classify };

export interface ComponentOptions {
  name: string;
}

export function service(options: ComponentOptions): Rule {
  const parsed = options.name.split('/');
  const name = parsed[parsed.length - 1];

  return () => {
    return chain([
      (tree, context) => {
        const sourceTemplates = url('./files');
        const completedTemplates = apply(sourceTemplates, [template({ name, ...stringUtils })]);

        return mergeWith(completedTemplates)(tree, context);
      },
      tree => {
        tree.rename(`./service.ts.template`, `${options.name}/${name}.service.ts`);
        tree.rename(`./service.spec.ts.template`, `${options.name}/${name}.service.spec.ts`);

        return tree;
      }
    ]);
  };
}
