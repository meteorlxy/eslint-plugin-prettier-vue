module.exports = {
  root: true,

  extends: [
    'standard',
    'prettier/standard',
    'plugin:vue/recommended',
    'plugin:self/recommended',
  ],

  settings: {
    'prettier-vue': {
      customBlocks: {
        docs: { lang: 'markdown' }
      }
    }
  }
}
