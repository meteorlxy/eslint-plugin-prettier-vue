import type { FileInfoResult, Options } from 'prettier'
import { runAsWorker } from 'synckit'
import type { PrettierVuePluginOptions } from '../types';
import { resolvePrettierFileInfo } from '../utils/resolve-prettier-file-info';
import { resolvePrettierOptions } from '../utils/resolve-prettier-options';

export type ResolvePrettierOptionsAndFileInfoFn = (options: {
  filepath: string;
  physicalFilepath: string;
  pluginOptions: PrettierVuePluginOptions;
}) => {
  prettierFileInfo: FileInfoResult;
  prettierOptions: Options;
}

runAsWorker(async ({
  filepath,
  physicalFilepath,
  pluginOptions,
}: {
  filepath: string;
  physicalFilepath: string;
  pluginOptions: PrettierVuePluginOptions;
}) => {
  // resolve prettier options and file info
  const prettierOptions = await resolvePrettierOptions({
    filepath,
    physicalFilepath,
    pluginOptions,
  });
  const prettierFileInfo = await resolvePrettierFileInfo({
    physicalFilepath,
    pluginOptions,
    prettierOptions,
  });
  return {
    prettierFileInfo,
    prettierOptions,
  }
})