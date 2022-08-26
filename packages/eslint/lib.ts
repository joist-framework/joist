import { ClassDeclaration } from './src/class-declaration';

export default {
  parser: '@typescript-eslint/parser',
  meta: {
    messages: {
      emptyCatch: 'Injected services do not match constructor signature',
    },
  },
  create() {
    return {
      ClassDeclaration,
    };
  },
};
