import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import css from 'rollup-plugin-css-only'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    terser({
      format: { comments: false },
      compress: {
        toplevel: true,
      },
    }),
    copy({
      targets: [{ src: 'src/fonts/*', dest: 'dist/fonts' }],
    }),
    css({
      output: 'ns-login-fonts.css',
    }),
  ],
}
