import { PluginOptions, CSSModuleList } from '../types';
declare type Parser = {
    content: string;
    cssModuleList: CSSModuleList;
};
/**
 * Parse Markup
 * @param content the markup content
 * @param filename the resource filename
 * @param pluginOptions preprocess-cssmodules options
 */
declare const parseMarkup: (content: string, filename: string, pluginOptions: PluginOptions) => Promise<Parser>;
export default parseMarkup;
