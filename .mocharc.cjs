module.exports = {
  'node-option': ['import=tsx'],
  spec: ['packages/*/lib/**/*.test.ts'],
  ignore: ['packages/bindings-cpp/**/*.test.ts'],
  bail: false,
  reporter: 'spec',
}
