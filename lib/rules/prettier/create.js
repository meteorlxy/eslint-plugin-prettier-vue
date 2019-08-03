const prettier = require('prettier')
const parseVue = require('./utils/parse-vue')
const prettierDifferences = require('./utils/prettier-differences')

module.exports = function create(context) {
  // get the options provided by the user in eslint config
  const pluginOptions = {
    prettierOptions: context.options[0] || {},
    usePrettierrc: !context.options[1] || context.options[1].usePrettierrc !== false,
    fileInfoOptions: (context.options[1] && context.options[1].fileInfoOptions) || {},
    customBlocskOptions: (context.settings['prettier-vue'] && context.settings['prettier-vue']['customBlocks']) || {},
  }

  // Check if the file is ignored
  const filepath = context.getFilename()
  const { ignored, inferredParser } = prettier.getFileInfo.sync(
    filepath,
    Object.assign(
      {
        ignorePath: '.prettierignore',
      },
      pluginOptions.fileInfoOptions
    )
  )

  if (ignored) {
    return {}
  }

  // Resolve the config of prettier
  if (prettier && prettier.clearConfigCache) {
    prettier.clearConfigCache()
  }

  const prettierRcOptions = pluginOptions.usePrettierrc
    ? prettier.resolveConfig.sync(filepath, {
        editorconfig: true,
      })
    : null

  // ESLint suppports processors that let you extract and lint JS
  // fragments within a non-JS language. In the cases where prettier
  // supports the same language as a processor, we want to process
  // the provided source code as javascript (as ESLint provides the
  // rules with fragments of JS) instead of guessing the parser
  // based off the filename. Otherwise, for instance, on a .md file we
  // end up trying to run prettier over a fragment of JS using the
  // markdown parser, which throws an error.
  // If we can't infer the parser from from the filename, either
  // because no filename was provided or because there is no parser
  // found for the filename, use javascript.
  // This is added to the options first, so that
  // prettierRcOptions and eslintPrettierOptions can still override
  // the parser.

  // `parserBlocklist` should contain the list of prettier parser
  // names for file types where:
  // * Prettier supports parsing the file type
  // * There is an ESLint processor that extracts JavaScript snippets
  //   from the file type.
  const initialOptions = {}
  const parserBlocklist = [null, 'graphql', 'markdown', 'html']
  if (parserBlocklist.includes(inferredParser)) {
    const supportBabelParser = prettier.getSupportInfo().languages.some(language => language.parsers.includes('babel'))

    initialOptions.parser = supportBabelParser ? 'babel' : 'babylon'
  }

  const prettierOptions = Object.assign({}, initialOptions, prettierRcOptions, pluginOptions.prettierOptions, {
    filepath,
  })

  // Get the source code
  const source = context.getSourceCode().text

  return {
    Program() {
      if (filepath.endsWith('.vue')) {
        // Handle Vue SFC
        const { script, styles, customBlocks } = parseVue({
          source,
          filepath,
          customBlocksOptions: pluginOptions.customBlocskOptions,
        })

        // `<script>` block
        prettierDifferences({ context, ...script, options: prettierOptions })

        // `<style>` blocks
        styles.forEach(({ source, offset }) =>
          prettierDifferences({
            context,
            source,
            offset,
            options: prettierOptions,
          })
        )

        // custom blocks
        customBlocks.forEach(({ source, offset, lang }) =>
          prettierDifferences({
            context,
            source,
            offset,
            options: Object.assign({}, prettierOptions, { filepath: `placeholder.${lang}` }),
          })
        )
      } else {
        // Handle Other files
        prettierDifferences({ context, source, options: prettierOptions })
      }
    },
  }
}
