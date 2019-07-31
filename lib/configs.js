module.exports = {
  recommended: {
    /**
     * extends `eslint-config-prettier`
     */
    extends: ['prettier'],

    /**
     * use this plugin
     */
    plugins: ['prettier-vue'],

    /**
     * use prettier rules
     */
    rules: {
      'prettier-vue/prettier': 'error',
    },
  },
}
