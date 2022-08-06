import { TSESTree } from '@typescript-eslint/typescript-estree';

export default {
  parser: '@typescript-eslint/parser',
  meta: {
    messages: {
      emptyCatch: 'Injected services do not match constructor signature',
    },
  },
  create() {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const injectedProp = node.body.body.find(
          (body) =>
            body.type === TSESTree.AST_NODE_TYPES.PropertyDefinition &&
            body.key.type === TSESTree.AST_NODE_TYPES.Identifier &&
            body.key.name === 'inject'
        );

        const injectedConstructor = node.body.body.find(
          (body) =>
            body.type === TSESTree.AST_NODE_TYPES.MethodDefinition &&
            body.key.type === TSESTree.AST_NODE_TYPES.Identifier &&
            body.key.name === 'constructor'
        );

        const injectedServices = injectedProp
          ? findInjectedServices(injectedProp as TSESTree.PropertyDefinition)
          : [];

        const injectedArts = injectedConstructor
          ? findInjectedArgs(injectedConstructor as TSESTree.MethodDefinition)
          : [];

        console.log(injectedArts);

        for (let i = 0; i < injectedServices.length; i++) {}
      },
    };
  },
};

function findInjectedServices(element: TSESTree.PropertyDefinition): Array<string | null> {
  if (element.value?.type === TSESTree.AST_NODE_TYPES.ArrayExpression) {
    return element.value.elements.map((element) => {
      if (element.type === TSESTree.AST_NODE_TYPES.Identifier) {
        return element.name;
      }

      return null;
    });
  }

  return [];
}

function findInjectedArgs(element: TSESTree.MethodDefinition) {
  if (element.value.type === TSESTree.AST_NODE_TYPES.FunctionExpression) {
    return element.value.params.map((param) => {
      if (param.type === TSESTree.AST_NODE_TYPES.Identifier && param.typeAnnotation) {
        if (param.typeAnnotation.typeAnnotation.type === TSESTree.AST_NODE_TYPES.TSTypeReference) {
          if (
            param.typeAnnotation.typeAnnotation.typeName.type === TSESTree.AST_NODE_TYPES.Identifier
          ) {
            if (param.typeAnnotation.typeAnnotation.typeName.name === 'Injected') {
              return param.typeAnnotation.typeAnnotation;
            }
          }
        }
      }

      return null;
    });
  }

  return [];
}
