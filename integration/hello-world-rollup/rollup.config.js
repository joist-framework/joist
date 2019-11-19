import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import gzip from 'rollup-plugin-gzip';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/dist/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      mainFields: ['browser', 'module', 'main']
    }),
    typescript(),
    terser(),
    gzip(),
    cleanup({ comments: 'none' })
  ]
};
