const path = require('path')
const vueTemplateCompiler = require('vue-template-compiler')
const { parse } = require('@vue/component-compiler-utils')

module.exports = ({ source, filepath }) => {
  const descriptor = parse({
    source,
    compiler: vueTemplateCompiler,
    filename: path.basename(filepath),
  })

  const sourceScript = descriptor.script.content
    .replace(/^(\/\/\n)*/, '')
    .replace(/^([\s\S]*)$/, `<script>$1</script>\n`)

  // The offset the the block
  const offetScript = descriptor.script.start - `<script>`.length

  return {
    script: {
      source: sourceScript,
      offset: offetScript,
    },
    styles: [],
    customBlocks: [],
  }
}
