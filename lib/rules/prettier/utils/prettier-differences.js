const path = require('path')
const chalk = require('chalk')
const prettier = require('prettier')
const { generateDifferences } = require('prettier-linter-helpers')
const { reportInsert, reportDelete, reportReplace } = require('./report')
const { INSERT, DELETE, REPLACE } = generateDifferences

module.exports = ({ context, source, options, offset = 0 }) => {
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
    prettierSource = prettier.format(source, options)
  } catch (err) {
    // UndefinedParserError
    if (err.message.startsWith('No parser could be inferred for file')) {
      console.warn(
        chalk.yellow('warning'),
        '[prettier-vue]',
        `No parser could be inferred for "${path.extname(
          options.filepath
        )}" format`
      )
      return
    }

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
          reportInsert(
            context,
            difference.offset + offset,
            difference.insertText
          )
          break
        case DELETE:
          reportDelete(
            context,
            difference.offset + offset,
            difference.deleteText
          )
          break
        case REPLACE:
          reportReplace(
            context,
            difference.offset + offset,
            difference.deleteText,
            difference.insertText
          )
          break
        default:
      }
    })
  }
}
