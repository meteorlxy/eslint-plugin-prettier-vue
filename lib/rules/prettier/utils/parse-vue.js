const path = require('path')
const vueTemplateCompiler = require('vue-template-compiler')
const { parse } = require('@vue/component-compiler-utils')

const defaultLanguages = {
  script: 'js',
  style: 'css',
}

/**
 * Process SFC Block
 *
 * @param {SFCBlock|SFCCustomBlock} block
 * @param {Object} options options for custom blocks, which is set in `settings['prettier-vue'].customBlock` of `.eslintrc.js`
 *
 * @returns {Object}
 *
 * @see https://github.com/vuejs/component-compiler-utils#parseparseoptions-sfcdescriptor
 */
function processSFCBlock({ attr, content, lang, start, type }, options = {}) {
  // Trim the `//` and `\n` on the top to get the pure source
  const source = content.replace(/^((\/\/\n)|(\n))*/, '')

  // As we have removed the starting `\n`, the offset of the block should `+ 1`
  const offset = start + 1

  // Resolve the language of the block
  const language =
    lang || (attr && attr.lang) || (options[type] && options[type].lang) || defaultLanguages[type] || 'vue'

  return { source, offset, language }
}

/**
 * Parse the vue SFC file
 *
 * @param {Object} vueFile
 * @param {string} vueFile.source source code string of the `.vue` file
 * @param {string} vueFile.filepath file path of the `.vue` file
 * @param {Object} vueFile.options options for custom blocks, which is set in `settings['prettier-vue'].customBlock` of `.eslintrc.js`
 *
 * @returns {Array<Object>} returns an array of Object to be used by prettier
 */
module.exports = ({ source, filepath, options }) => {
  // Get SFC descriptor by parsing source code
  const { script, styles, customBlocks } = parse({
    source,
    compiler: vueTemplateCompiler,
    filename: path.basename(filepath),
  })

  // Put all SFC blocks into an array
  const SFCBlocks = [
    // `script` is `null` if there is no `<script>` block in the SFC
    ...[script].filter(block => block !== null),
    ...styles,
    // Filter custom blocks that are not listed in the `settings['prettier-vue'].customBlocks` or `[type] === false`
    ...customBlocks.filter(({ type }) => Object.keys(options).includes(type) && options[type] !== false),
  ]

  // Process all SFC blocks
  return SFCBlocks.map(block => processSFCBlock(block, options))
}
