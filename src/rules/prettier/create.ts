import type { Rule } from 'eslint';
import * as prettier from 'prettier';
import { parseVue } from './utils/parse-vue';
import type { SFCBlocksOptions } from './utils/parse-vue';
import { prettierDifferences } from './utils/prettier-differences';

export interface PrettierVuePluginOptions {
  /**
   * Options of prettier itself
   */
  prettierOptions: prettier.Options;

  /**
   * Use the options in .prettierrc file or not
   */
  usePrettierrc: boolean;

  /**
   * The fileInfoOptions of prettier
   */
  fileInfoOptions: prettier.FileInfoOptions;

  /**
   * Options for how to process vue SFC blocks
   */
  SFCBlocksOptions: SFCBlocksOptions;
}

export const create: Rule.RuleModule['create'] = (context) => {
  // Get the shared settings
  const sharedSettings = context.settings['prettier-vue'] || {};

  // Get the options of this plugin that provided by user
  const pluginOptions = {
    prettierOptions: context.options[0] || {},
    usePrettierrc: sharedSettings.usePrettierrc !== false,
    fileInfoOptions: sharedSettings.fileInfoOptions || {},
    SFCBlocksOptions: sharedSettings.SFCBlocks || {},
  };

  // Check if the file is ignored
  const filepath = context.getFilename();
  const fileInfoOptions = {
    resolveConfig: true,
    ignorePath: '.prettierignore',
    ...pluginOptions.fileInfoOptions,
  };
  const { ignored, inferredParser } = prettier.getFileInfo.sync(
    filepath,
    fileInfoOptions,
  );

  if (ignored) {
    return {};
  }

  // This allows long-running ESLint processes (e.g. vscode-eslint) to
  // pick up changes to .prettierrc without restarting the editor. This
  // will invalidate the prettier plugin cache on every file as well which
  // will make ESLint very slow, so it would probably be a good idea to
  // find a better way to do this.
  if (pluginOptions.usePrettierrc && prettier && prettier.clearConfigCache) {
    prettier.clearConfigCache();
  }

  const prettierRcOptions = pluginOptions.usePrettierrc
    ? prettier.resolveConfig.sync(filepath, {
        editorconfig: true,
      })
    : null;

  const prettierOptions = {
    ...prettierRcOptions,
    ...pluginOptions.prettierOptions,
    filepath,
  };

  // Get the source code
  const sourceCode = context.getSourceCode().text;

  return {
    Program() {
      if (filepath.endsWith('.vue')) {
        // Handle Vue SFC
        const SFCBlocks = parseVue({
          source: sourceCode,
          filepath,
          options: pluginOptions.SFCBlocksOptions,
        });

        // Run prettier on each of the SFC blocks respectively
        SFCBlocks.forEach(({ source, offset, lang, type }) => {
          // Disguise SFC block as an individual file
          const fakeFilePath = `${filepath}.${type}.${lang}`;

          // Run prettier on this fake file
          prettierDifferences({
            context,
            source,
            options: { ...prettierOptions, filepath: fakeFilePath },
            offset,
          });
        });
      } else {
        // ESLint supports processors that let you extract and lint JS
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

        // `parserBlockList` should contain the list of prettier parser
        // names for file types where:
        // * Prettier supports parsing the file type
        // * There is an ESLint processor that extracts JavaScript snippets
        //   from the file type.
        const initialOptions: prettier.Options = {};
        const parserBlockList = [null, 'graphql', 'markdown', 'html'];
        if (parserBlockList.includes(inferredParser)) {
          initialOptions.parser = 'babel';
        }

        // Run prettier on this file
        prettierDifferences({
          context,
          source: sourceCode,
          options: { ...initialOptions, ...prettierOptions },
        });
      }
    },
  };
};
