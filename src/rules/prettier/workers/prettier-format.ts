import type { Options } from 'prettier'
import { format } from 'prettier'
import { runAsWorker } from 'synckit'

export type PrettierFormatFn = (source: string, options?: Options) => string

runAsWorker(format)
