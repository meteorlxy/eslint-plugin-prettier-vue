const path = require('path')
const vueTemplateCompiler = require('vue-template-compiler')
const { parse } = require('@vue/component-compiler-utils')

/**
 * Process SFC Block
 *
 * @param {SFCBlock} block
 *
 * @returns {Object}
 *
 * @see https://github.com/vuejs/component-compiler-utils#parseparseoptions-sfcdescriptor
 */
function processSFCBlock({ content, lang, start, type }) {
  const startTag = `<${type}${lang ? ` lang="${lang}"` : ''}>`
  const endTag = `</${type}>`

  const source = content.replace(/^((\/\/\n)|(\n))*/, '\n').replace(/^([\s\S]*)$/, `${startTag}$1${endTag}\n`)
  const offset = start - startTag.length

  return { source, offset, lang }
}

/**
 * Process SFC Custom Block
 *
 * @param {SFCCustomBlock} block
 *
 * @returns {Object}
 *
 * @see https://github.com/vuejs/component-compiler-utils#parseparseoptions-sfcdescriptor
 */
function processSFCCustomBlock({ attr, content, start, type }, options) {
  const source = content.replace(/^((\/\/\n)|(\n))*/, '')
  // As we have removed the starting `\n`, the offset of the custom block should `+ 1`
  const offset = start + 1
  const lang = (attr && attr.lang) || (options[type] && options[type].lang) || 'vue'
  return { source, offset, lang }
}

module.exports = ({ source, filepath, customBlocksOptions }) => {
  const { script, styles, customBlocks } = parse({
    source,
    compiler: vueTemplateCompiler,
    filename: path.basename(filepath),
  })

  const standardScript = processSFCBlock(script)
  const standardStyles = styles.map(style => processSFCBlock(style))
  const standardCustomBlocks = customBlocks.map(customBlock => processSFCCustomBlock(customBlock, customBlocksOptions))

  return {
    script: standardScript,
    styles: standardStyles,
    customBlocks: standardCustomBlocks,
  }
}
