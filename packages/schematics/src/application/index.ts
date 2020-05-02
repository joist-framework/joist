import { Rule, url, apply, move, template, mergeWith, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export interface ApplicationOptions {
  name: string;
}

export function application(options: ApplicationOptions): Rule {
  return () => {
    return chain([
      (tree, context) => {
        const sourceTemplates = url('./files');
        const completedTemplates = apply(sourceTemplates, [
          template(options),
          move('.', options.name),
        ]);

        return mergeWith(completedTemplates)(tree, context);
      },
      (tree) => {
        const name = options.name;

        tree.rename(`./${name}/.gitignore.template`, `./${name}/.gitignore`);
        tree.rename(`./${name}/karma.conf.js.template`, `./${name}/karma.conf.js`);
        tree.rename(`./${name}/package.json.template`, `./${name}/package.json`);
        tree.rename(`./${name}/webpack.config.js.template`, `./${name}/webpack.config.js`);
        tree.rename(`./${name}/workbox-config.js.template`, `./${name}/workbox-config.js`);

        return tree;
      },
      (_, context) => {
        context.addTask(new NodePackageInstallTask(options.name));
      },
    ]);
  };
}
