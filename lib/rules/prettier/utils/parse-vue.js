const path = require('path')
const vueTemplateCompiler = require('vue-template-compiler')
const { parse } = require('@vue/component-compiler-utils')

/**
 * Process SFC Block
 *
 * @param {SFCBlock|(SFCCustomBlock & { lang: string })} block
 *
 * @returns {Object}
 *
 * @see https://github.com/vuejs/component-compiler-utils#parseparseoptions-sfcdescriptor
 */
function processSFCBlock({ content, lang, start, type }) {
  if (['template', 'script', 'style'].includes(type)) {
    // `<template>`, `<script>`, `<style>` blocks should be treated as `.vue` file
    // to make the `vueIndentScriptAndStyle` option of prettier works, so we need
    // to wrap them with their original tags
    const startingTag = `<${type}${lang ? ` lang="${lang}"` : ''}>`
    const endingTag = `</${type}>\n`

    const source = `${startingTag}${content}${endingTag}`

    const offset = start - startingTag.length

    return { source, offset, lang: 'vue', type }
  } else {
    // To treat other block as an individual file

    // Remove the starting `\n`
    const source = content.replace(/^\n/, '')

    // As we have removed the starting `\n`, the offset of the block should `+ 1`
    const offset = start + 1

    return { source, offset, lang, type }
  }
}

/**
 * Parse the vue SFC file
 *
 * @param {Object} vueFile
 * @param {string} vueFile.source source code string of the `.vue` file
 * @param {string} vueFile.filepath file path of the `.vue` file
 * @param {Object} vueFile.options options for custom blocks, which is set in `settings['prettier-vue'].SFCBlocks` of `.eslintrc.js`
 *
 * @returns {Array<Object>} returns an array of Object to be used by prettier
 */
module.exports = ({ source, filepath, options }) => {
  const SFCBlocksOptions = {
    template: options.template !== false,
    script: options.script !== false,
    style: options.style !== false,
  }

  const SFCCustomBlocksOptions = options.customBlocks || {}

  // Get SFC descriptor by parsing source code
  const { template, script, styles, customBlocks } = parse({
    source,
    compiler: vueTemplateCompiler,
    // do not deindent and do not add pad
    compilerParseOptions: { deindent: false, pad: false },
    // add prefix to avoid cache
    filename: `prettier_${path.basename(filepath)}`,
  })

  // Filter SFC blocks
  const SFCBlocks = [template, script, ...styles]
    .filter(block => block !== null)
    .filter(({ type }) => SFCBlocksOptions[type])

  // Filter SFC custom blocks
  const SFCCustomBlocks = customBlocks
    .filter(
      ({ type }) =>
        Object.keys(SFCCustomBlocksOptions).includes(type) &&
        SFCCustomBlocksOptions[type] !== false
    )
    .map(block => {
      // Resolve language of the SFC custom block
      block.lang =
        (block.attr && block.attr.lang) ||
        (SFCCustomBlocksOptions[block.type] &&
          SFCCustomBlocksOptions[block.type].lang) ||
        'vue'
      return block
    })

  // Process all SFC blocks & custom blocks
  return [...SFCBlocks, ...SFCCustomBlocks].map(block => processSFCBlock(block))
}
