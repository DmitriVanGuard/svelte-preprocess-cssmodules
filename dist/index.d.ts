import { PluginOptions, PreprocessorOptions, PreprocessorResult } from './types';
declare const _default: (options: Partial<PluginOptions>) => {
    markup: ({ content, filename }: PreprocessorOptions) => Promise<PreprocessorResult>;
    style: ({ content, filename }: PreprocessorOptions) => Promise<PreprocessorResult>;
};
export default _default;
