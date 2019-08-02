module.exports = {
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
        /**
         * Options for `prettier.getFileInfo`
         *
         * @see https://prettier.io/docs/en/api.html#prettiergetfileinfofilepath-options
         */
        fileInfoOptions: {
          type: 'object',
          properties: {
            ignorePath: {
              type: 'boolean',
            },
            withNodeModules: {
              type: 'boolean',
            },
            plugins: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
  ],
}
