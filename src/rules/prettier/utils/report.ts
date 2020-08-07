import type { Rule, AST } from 'eslint';
import { showInvisibles } from 'prettier-linter-helpers';

/**
 * Reports an "Insert ..." issue where text must be inserted.
 * @param {RuleContext} context - The ESLint rule context.
 * @param {number} offset - The source offset where to insert text.
 * @param {string} text - The text to be inserted.
 * @returns {void}
 */
export const reportInsert = (
  context: Rule.RuleContext,
  offset: number,
  text: string
): void => {
  const pos = context.getSourceCode().getLocFromIndex(offset);
  const range: AST.Range = [offset, offset];
  context.report({
    message: 'Insert `{{ code }}`',
    data: { code: showInvisibles(text) },
    loc: { start: pos, end: pos },
    fix(fixer) {
      return fixer.insertTextAfterRange(range, text);
    },
  });
};

/**
 * Reports a "Delete ..." issue where text must be deleted.
 * @param {RuleContext} context - The ESLint rule context.
 * @param {number} offset - The source offset where to delete text.
 * @param {string} text - The text to be deleted.
 * @returns {void}
 */
export const reportDelete = (
  context: Rule.RuleContext,
  offset: number,
  text: string
): void => {
  const start = context.getSourceCode().getLocFromIndex(offset);
  const end = context.getSourceCode().getLocFromIndex(offset + text.length);
  const range: AST.Range = [offset, offset + text.length];
  context.report({
    message: 'Delete `{{ code }}`',
    data: { code: showInvisibles(text) },
    loc: { start, end },
    fix(fixer) {
      return fixer.removeRange(range);
    },
  });
};

/**
 * Reports a "Replace ... with ..." issue where text must be replaced.
 * @param {RuleContext} context - The ESLint rule context.
 * @param {number} offset - The source offset where to replace deleted text
 with inserted text.
 * @param {string} deleteText - The text to be deleted.
 * @param {string} insertText - The text to be inserted.
 * @returns {void}
 */
export const reportReplace = (
  context: Rule.RuleContext,
  offset: number,
  deleteText: string,
  insertText: string
): void => {
  const start = context.getSourceCode().getLocFromIndex(offset);
  const end = context
    .getSourceCode()
    .getLocFromIndex(offset + deleteText.length);
  const range: AST.Range = [offset, offset + deleteText.length];
  context.report({
    message: 'Replace `{{ deleteCode }}` with `{{ insertCode }}`',
    data: {
      deleteCode: showInvisibles(deleteText),
      insertCode: showInvisibles(insertText),
    },
    loc: { start, end },
    fix(fixer) {
      return fixer.replaceTextRange(range, insertText);
    },
  });
};
