import { PluginOptions } from '../types';
/**
 * Create the interpolated name
 * @param filename tthe resource filename
 * @param markup Markup content
 * @param style Stylesheet content
 * @param className the className
 * @param pluginOptions preprocess-cssmodules options
 * @return the interpolated name
 */
declare function createCssModulesClassName(filename: string, markup: string, style: string, className: string, pluginOptions: PluginOptions): string;
export default createCssModulesClassName;
