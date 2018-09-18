import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
  {
    input: 'src/state.js',
    output: [
      {
        file: pkg.browser,
        format: 'umd',
        name: 'state'
      },
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]
