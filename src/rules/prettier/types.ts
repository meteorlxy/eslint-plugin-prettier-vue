import type { FileInfoOptions, Options } from 'prettier';
import type { SFCBlocksOptions } from './utils/parse-vue';

export interface PrettierVuePluginOptions {
  /**
   * Options for how to process vue SFC blocks
   */
  SFCBlocksOptions: SFCBlocksOptions;

  /**
   * The fileInfoOptions of prettier
   */
  fileInfoOptions: FileInfoOptions;

  /**
   * Options of prettier itself
   */
  prettierOptions: Options;

  /**
   * Use the options in .prettierrc file or not
   */
  usePrettierrc: boolean;
}
