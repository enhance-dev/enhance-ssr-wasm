import esbuild from 'esbuild';
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

esbuild.build({
  entryPoints: ['src/enhance-ssr.js'],
  outdir: 'dist',
  bundle: true,
  sourcemap: true,
  minify: false,
  format: 'cjs',
  target: ['es2020'],
  // plugins: [NodeModulesPolyfillPlugin()],
});
