import type { AST, Rule } from 'eslint';
import type { Difference  } from 'prettier-linter-helpers';
import { showInvisibles } from 'prettier-linter-helpers';

/**
 * Reports a difference.
 *
 * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context.
 * @param {import('prettier-linter-helpers').Difference} difference - The difference object.
 * @returns {void}
 */
export const reportDifference = (context: Rule.RuleContext, difference: Difference, offset: number): void => {
  const { operation, deleteText = '', insertText = '' } = difference;
  const range: AST.Range = [offset, offset + deleteText.length];
  const [start, end] = range.map(index =>
    context.getSourceCode().getLocFromIndex(index),
  );

  context.report({
    messageId: operation,
    data: {
      deleteText: showInvisibles(deleteText),
      insertText: showInvisibles(insertText),
    },
    loc: { start, end },
    fix: fixer => fixer.replaceTextRange(range, insertText),
  });
}
