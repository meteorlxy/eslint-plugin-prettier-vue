import type { FileInfoOptions, FileInfoResult, Options } from 'prettier';
import { getFileInfo } from 'prettier';
import type { PrettierVuePluginOptions } from '../types';

export const resolvePrettierFileInfo = async ({ physicalFilepath, pluginOptions, prettierOptions }: {
  physicalFilepath: string;
  pluginOptions: PrettierVuePluginOptions;
  prettierOptions: Options;
}): Promise<FileInfoResult> => {
  const fileInfoOptions: FileInfoOptions = {
    resolveConfig: false,
    withNodeModules: false,
    ignorePath: '.prettierignore',
    plugins: prettierOptions.plugins as string[] | undefined ?? undefined,
    ...pluginOptions.fileInfoOptions,
  };
  return getFileInfo( physicalFilepath, fileInfoOptions);
}