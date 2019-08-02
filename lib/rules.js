const path = require('path')
const vueTemplateCompiler = require('vue-template-compiler')
const { parse } = require('@vue/component-compiler-utils')
const { generateDifferences } = require('prettier-linter-helpers')
const { reportInsert, reportDelete, reportReplace } = require('./utils/report')
const { INSERT, DELETE, REPLACE } = generateDifferences

// Lazily-loaded Prettier.
let prettier

module.exports = {
  prettier: {
    meta: {
      type: 'layout',

      docs: {
        description: 'Make your code prettier',
        recommended: true,
        url: 'https://github.com/prettier/eslint-plugin-prettier#options',
      },

      fixable: 'code',

      schema: [
        /**
         * Prettier options
         *
         * @see https://prettier.io/docs/en/options.html
         */
        {
          type: 'object',
          properties: {
            printWidth: {
              type: 'integer',
            },
            tabWidth: {
              type: 'integer',
            },
            useTabs: {
              type: 'boolean',
            },
            semi: {
              type: 'boolean',
            },
            singleQuote: {
              type: 'boolean',
            },
            quoteProps: {
              type: 'string',
              enum: ['as-needed', 'consistent', 'preserve'],
            },
            jsxSingleQuote: {
              type: 'boolean',
            },
            trailingComma: {
              type: 'string',
              enum: ['none', 'es5', 'all'],
            },
            bracketSpacing: {
              type: 'boolean',
            },
            jsxBracketSameLine: {
              type: 'boolean',
            },
            arrowParens: {
              type: 'string',
              enum: ['avoid', 'always'],
            },
            rangeStart: {
              type: 'integer',
            },
            rangeEnd: {
              type: 'integer',
            },
            parser: {
              type: ['string', 'object'],
            },
            filepath: {
              type: 'string',
            },
            requirePragma: {
              type: 'boolean',
            },
            insertPragma: {
              type: 'boolean',
            },
            proseWrap: {
              type: 'string',
              enum: ['always', 'never', 'preserve'],
            },
            htmlWhitespaceSensitivity: {
              type: 'string',
              enum: ['css', 'strict', 'ignore'],
            },
            endOfLine: {
              type: 'string',
              enum: ['auto', 'lf', 'crlf', 'cr'],
            },
          },
          additionalProperties: true,
        },
        {
          type: 'object',
          properties: {
            usePrettierrc: {
              type: 'boolean',
            },
            fileInfoOptions: {
              type: 'object',
              properties: {},
              additionalProperties: true,
            },
          },
          additionalProperties: true,
        },
      ],
    },

    create(context) {
      const usePrettierrc = !context.options[1] || context.options[1].usePrettierrc !== false
      const eslintFileInfoOptions = (context.options[1] && context.options[1].fileInfoOptions) || {}
      const sourceCode = context.getSourceCode()
      const filepath = context.getFilename()
      let source = sourceCode.text

      if (prettier && prettier.clearConfigCache) {
        prettier.clearConfigCache()
      }

      /**
       * Handle Vue SFC
       */
      let vueOffset = 0
      if (filepath.endsWith('.vue')) {
        const descriptor = parse({
          source,
          compiler: vueTemplateCompiler,
          filename: path.basename(filepath),
        })

        const vueSourceScript = descriptor.script.content
          .replace(/^(\/\/\n)*/, '')
          .replace(/^([\s\S]*)$/, '<script>$1</script>\n')
        source = vueSourceScript
        vueOffset = descriptor.script.start - '<script>'.length
      }

      return {
        Program() {
          if (!prettier) {
            // Prettier is expensive to load, so only load it if needed.
            prettier = require('prettier')
          }

          const eslintPrettierOptions = context.options[0] || {}

          const prettierRcOptions = usePrettierrc
            ? prettier.resolveConfig.sync(filepath, {
                editorconfig: true,
              })
            : null

          const prettierFileInfo = prettier.getFileInfo.sync(
            filepath,
            Object.assign({}, { ignorePath: '.prettierignore' }, eslintFileInfoOptions)
          )

          // Skip if file is ignored using a .prettierignore file
          if (prettierFileInfo.ignored) {
            return
          }

          const initialOptions = {}

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
          //
          // `parserBlocklist` should contain the list of prettier parser
          // names for file types where:
          // * Prettier supports parsing the file type
          // * There is an ESLint processor that extracts JavaScript snippets
          //   from the file type.
          const parserBlocklist = [null, 'graphql', 'markdown', 'html']
          if (parserBlocklist.indexOf(prettierFileInfo.inferredParser) !== -1) {
            // Prettier v1.16.0 renamed the `babylon` parser to `babel`
            // Use the modern name if available
            const supportBabelParser = prettier
              .getSupportInfo()
              .languages.some(language => language.parsers.includes('babel'))

            initialOptions.parser = supportBabelParser ? 'babel' : 'babylon'
          }

          const prettierOptions = Object.assign({}, initialOptions, prettierRcOptions, eslintPrettierOptions, {
            filepath,
          })

          // prettier.format() may throw a SyntaxError if it cannot parse the
          // source code it is given. Ususally for JS files this isn't a
          // problem as ESLint will report invalid syntax before trying to
          // pass it to the prettier plugin. However this might be a problem
          // for non-JS languages that are handled by a plugin. Notably Vue
          // files throw an error if they contain unclosed elements, such as
          // `<template><div></template>. In this case report an error at the
          // point at which parsing failed.
          let prettierSource
          try {
            prettierSource = prettier.format(source, prettierOptions)
          } catch (err) {
            if (!(err instanceof SyntaxError)) {
              throw err
            }

            let message = 'Parsing error: ' + err.message

            // Prettier's message contains a codeframe style preview of the
            // invalid code and the line/column at which the error occured.
            // ESLint shows those pieces of information elsewhere already so
            // remove them from the message
            if (err.codeFrame) {
              message = message.replace(`\n${err.codeFrame}`, '')
            }
            if (err.loc) {
              message = message.replace(/ \(\d+:\d+\)$/, '')
            }

            context.report({ message, loc: err.loc })

            return
          }

          if (source !== prettierSource) {
            const differences = generateDifferences(source, prettierSource)

            differences.forEach(difference => {
              switch (difference.operation) {
                case INSERT:
                  reportInsert(context, difference.offset + vueOffset, difference.insertText)
                  break
                case DELETE:
                  reportDelete(context, difference.offset + vueOffset, difference.deleteText)
                  break
                case REPLACE:
                  reportReplace(context, difference.offset + vueOffset, difference.deleteText, difference.insertText)
                  break
              }
            })
          }
        },
      }
    },
  },
}
