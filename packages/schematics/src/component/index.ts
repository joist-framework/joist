import { Rule, url, apply, move, template, mergeWith, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
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
          template({ ...options, ...stringUtils }),
          move('.', options.name)
        ]);

        return mergeWith(completedTemplates)(tree, context);
      },
      tree => {
        const name = options.name;

        tree.rename(`./${name}/${name}.component.ts.template`, `./${name}/${name}.component.ts`);
        tree.rename(
          `./${name}/${name}.component.spec.ts.template`,
          `./${name}/${name}.component.spec.ts`
        );

        return tree;
      },
      (_, context) => {
        context.addTask(new NodePackageInstallTask(options.name));
      }
    ]);
  };
}
