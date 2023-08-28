import type { Rule } from 'eslint';
import type { Options } from 'prettier';
import { createSyncFn } from 'synckit'
import type { PrettierVuePluginOptions } from './types';
import { parseVue } from './utils/parse-vue';
import { runPrettierAndReportDifferences } from './utils/run-prettier-and-report-differences';
import type { ResolvePrettierOptionsAndFileInfoFn } from './workers/resolve-prettier-options-and-file-info';

let resolvePrettierOptionsAndFileInfo: ResolvePrettierOptionsAndFileInfoFn | undefined;

export const create: Rule.RuleModule['create'] = (context) => {
  // Get the shared settings
  const sharedSettings = context.settings['prettier-vue'] || {};

  // Get the options of this plugin that provided by user
  const pluginOptions: PrettierVuePluginOptions = {
    prettierOptions: context.options[0] || {},
    usePrettierrc: sharedSettings.usePrettierrc !== false,
    fileInfoOptions: sharedSettings.fileInfoOptions || {},
    SFCBlocksOptions: sharedSettings.SFCBlocks || {},
  };

  // Processors that extract content from a file, such as the markdown
  // plugin extracting fenced code blocks may choose to specify virtual
  // file paths. If this is the case then we need to resolve prettier
  // config and file info using the physical path instead of the virtual
  // path.
  const filepath = context.filename;
  const physicalFilepath = context.physicalFilename;
  const sourceCode = context.sourceCode.text;

  // resolve prettier options and file info
  if (!resolvePrettierOptionsAndFileInfo) {
    resolvePrettierOptionsAndFileInfo = createSyncFn(
      require.resolve('./workers/resolve-prettier-options-and-file-info'),
    );
  }

  const {
    prettierOptions,
    prettierFileInfo: { ignored, inferredParser },
  } = resolvePrettierOptionsAndFileInfo({
    filepath,
    physicalFilepath,
    pluginOptions,
  })

  if (ignored) {
    return {};
  }

  return {
    Program() {
      // Handle Vue SFC
      if (filepath.endsWith('.vue')) {
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
          runPrettierAndReportDifferences({
            context,
            source,
            options: { ...prettierOptions, filepath: fakeFilePath },
            offset,
          });
        });

        return;
      }

      // Handle other files
      const initialOptions: Options = {};

      // ESLint supports processors that let you extract and lint JS
      // fragments within a non-JS language. In the cases where prettier
      // supports the same language as a processor, we want to process
      // the provided source code as javascript (as ESLint provides the
      // rules with fragments of JS) instead of guessing the parser
      // based off the filename. Otherwise, for instance, on a .md file we
      // end up trying to run prettier over a fragment of JS using the
      // markdown parser, which throws an error.
      // Processors may set virtual filenames for these extracted blocks.
      // If they do so then we want to trust the file extension they
      // provide, and no override is needed.
      // If the processor does not set any virtual filename (signified by
      // `filepath` and `physicalFilepath` being equal) AND we can't
      // infer the parser from the filename, either because no filename
      // was provided or because there is no parser found for the
      // filename, use javascript.
      // This is added to the options first, so that
      // prettierRcOptions and eslintPrettierOptions can still override
      // the parser.
      //
      // `parserBlocklist` should contain the list of prettier parser
      // names for file types where:
      // * Prettier supports parsing the file type
      // * There is an ESLint processor that extracts JavaScript snippets
      //   from the file type.
      if (filepath === physicalFilepath) {
        // The following list means the plugin process source into js content
        // but with same filename, so we need to change the parser to `babel`
        // by default.
        // Related ESLint plugins are:
        // 1. `eslint-plugin-graphql` (replacement: `@graphql-eslint/eslint-plugin`)
        // 2. `eslint-plugin-html`
        // 3. `eslint-plugin-markdown@1` (replacement: `eslint-plugin-markdown@2+`)
        // 4. `eslint-plugin-svelte3` (replacement: `eslint-plugin-svelte@2+`)
        const parserBlocklist = [null, 'markdown', 'html'];

        let inferParserToBabel = parserBlocklist.includes(inferredParser);

        switch (inferredParser) {
          // it could be processed by `@graphql-eslint/eslint-plugin` or `eslint-plugin-graphql`
          case 'graphql': {
            if (
              // for `eslint-plugin-graphql`, see https://github.com/apollographql/eslint-plugin-graphql/blob/master/src/index.js#L416
              sourceCode.startsWith('ESLintPluginGraphQLFile`')
            ) {
              inferParserToBabel = true;
            }
            break;
          }
          // it could be processed by `@ota-meshi/eslint-plugin-svelte`, `eslint-plugin-svelte` or `eslint-plugin-svelte3`
          case 'svelte': {
            // The `source` would be modified by `eslint-plugin-svelte3`
            if (!context.parserPath.includes('svelte-eslint-parser')) {
              // We do not support `eslint-plugin-svelte3`,
              // the users should run `prettier` on `.svelte` files manually
              return;
            }
            break;
          }
          default:
        }

        if (inferParserToBabel) {
          initialOptions.parser = 'babel';
        }
      } else {
        // Similar to https://github.com/prettier/stylelint-prettier/pull/22
        // In all of the following cases ESLint extracts a part of a file to
        // be formatted and there exists a prettier parser for the whole file.
        // If you're interested in prettier you'll want a fully formatted file so
        // you're about to run prettier over the whole file anyway.
        // Therefore running prettier over just the style section is wasteful, so
        // skip it.
        const parserBlocklist = [
          'babel',
          'babylon',
          'flow',
          'typescript',
          'vue',
          'markdown',
          'html',
          'mdx',
          'angular',
          'svelte',
        ];
        if (inferredParser && parserBlocklist.includes(inferredParser)) {
          return;
        }
      }

      // Run prettier on this file
      runPrettierAndReportDifferences({
        context,
        source: sourceCode,
        options: { ...initialOptions, ...prettierOptions },
      });
    },
  };
};
