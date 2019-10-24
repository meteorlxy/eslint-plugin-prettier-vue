const { showInvisibles } = require('prettier-linter-helpers')

/**
 * Reports an "Insert ..." issue where text must be inserted.
 * @param {RuleContext} context - The ESLint rule context.
 * @param {number} offset - The source offset where to insert text.
 * @param {string} text - The text to be inserted.
 * @returns {void}
 */
function reportInsert(context, offset, text) {
  const pos = context.getSourceCode().getLocFromIndex(offset)
  const range = [offset, offset]
  context.report({
    message: 'Insert `{{ code }}`',
    data: { code: showInvisibles(text) },
    loc: { start: pos, end: pos },
    fix(fixer) {
      return fixer.insertTextAfterRange(range, text)
    },
  })
}

/**
 * Reports a "Delete ..." issue where text must be deleted.
 * @param {RuleContext} context - The ESLint rule context.
 * @param {number} offset - The source offset where to delete text.
 * @param {string} text - The text to be deleted.
 * @returns {void}
 */
function reportDelete(context, offset, text) {
  const start = context.getSourceCode().getLocFromIndex(offset)
  const end = context.getSourceCode().getLocFromIndex(offset + text.length)
  const range = [offset, offset + text.length]
  context.report({
    message: 'Delete `{{ code }}`',
    data: { code: showInvisibles(text) },
    loc: { start, end },
    fix(fixer) {
      return fixer.removeRange(range)
    },
  })
}

/**
 * Reports a "Replace ... with ..." issue where text must be replaced.
 * @param {RuleContext} context - The ESLint rule context.
 * @param {number} offset - The source offset where to replace deleted text
 with inserted text.
 * @param {string} deleteText - The text to be deleted.
 * @param {string} insertText - The text to be inserted.
 * @returns {void}
 */
function reportReplace(context, offset, deleteText, insertText) {
  const start = context.getSourceCode().getLocFromIndex(offset)
  const end = context
    .getSourceCode()
    .getLocFromIndex(offset + deleteText.length)
  const range = [offset, offset + deleteText.length]
  context.report({
    message: 'Replace `{{ deleteCode }}` with `{{ insertCode }}`',
    data: {
      deleteCode: showInvisibles(deleteText),
      insertCode: showInvisibles(insertText),
    },
    loc: { start, end },
    fix(fixer) {
      return fixer.replaceTextRange(range, insertText)
    },
  })
}

module.exports = {
  reportInsert,
  reportDelete,
  reportReplace,
}
