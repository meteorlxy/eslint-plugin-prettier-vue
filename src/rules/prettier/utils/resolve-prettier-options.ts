import type { Options } from 'prettier';
import { resolveConfig } from 'prettier';
import type { PrettierVuePluginOptions } from '../types';

export const resolvePrettierOptions = async ({ filepath, physicalFilepath, pluginOptions }: {
  filepath: string;
  physicalFilepath: string;
  pluginOptions: PrettierVuePluginOptions;
}): Promise<Options> => {
  // resolve options from prettier config files
  const prettierRcOptions = pluginOptions.usePrettierrc
  ? await resolveConfig(physicalFilepath, {
      editorconfig: true,
    })
  : {};

  // merge options
  return {
    ...prettierRcOptions,
    ...pluginOptions.prettierOptions,
    filepath,
  }
}