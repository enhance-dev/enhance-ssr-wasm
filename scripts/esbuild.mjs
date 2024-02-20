import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/enhance-ssr.js'],
  outdir: 'dist',
  bundle: true,
  sourcemap: true,
  minify: false,
  format: 'cjs',
  target: ['es2020']
});
