import * as path from 'path';
import type { AST, Rule } from 'eslint';
import * as picocolors from 'picocolors';
import type { Options } from 'prettier';
import { generateDifferences } from 'prettier-linter-helpers';
import { createSyncFn } from 'synckit'
import type { PrettierFormatFn } from '../workers/prettier-format'
import { reportDifference } from './report-difference';

let prettierFormat: PrettierFormatFn | undefined;

export const runPrettierAndReportDifferences = ({
  context,
  offset = 0,
  options,
  source,
}: {
  context: Rule.RuleContext;
  offset?: number;
  options: Options;
  source: string;
}): void => {
  if (!prettierFormat) {
    prettierFormat = createSyncFn(require.resolve('../workers/prettier-format'))
  }

  // prettier.format() may throw a SyntaxError if it cannot parse the
  // source code it is given. Usually for JS files this isn't a
  // problem as ESLint will report invalid syntax before trying to
  // pass it to the prettier plugin. However this might be a problem
  // for non-JS languages that are handled by a plugin. Notably Vue
  // files throw an error if they contain unclosed elements, such as
  // `<template><div></template>. In this case report an error at the
  // point at which parsing failed.
  let prettierSource: string;
  try {
    prettierSource = prettierFormat(source, options);
  } catch (err) {
    if (!(err instanceof Error)) {
      throw err;
    }

    // UndefinedParserError
    if (err.message.startsWith('No parser could be inferred for file')) {
      console.warn(
        picocolors.yellow('warning'),
        '[prettier-vue]',
        `No parser could be inferred for "${path.extname(
          options.filepath ?? '',
        )}" format`,
      );
      return;
    }

    if (!(err instanceof SyntaxError)) {
      throw err;
    }

    let message = `Parsing error: ${err.message}`;

    const error = err as unknown as {
      codeFrame: string;
      loc: AST.SourceLocation;
    };

    // Prettier's message contains a codeframe style preview of the
    // invalid code and the line/column at which the error occurred.
    // ESLint shows those pieces of information elsewhere already so
    // remove them from the message
    if (error.codeFrame) {
      message = message.replace(`\n${error.codeFrame}`, '');
    }
    if (error.loc) {
      message = message.replace(/ \(\d+:\d+\)$/, '');
    }

    context.report({ message, loc: error.loc });
    return;
  }

  if (source !== prettierSource) {
    generateDifferences(source, prettierSource).forEach((difference) => reportDifference(context, difference, difference.offset + offset));
  }
};
