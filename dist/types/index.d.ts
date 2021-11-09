import { GetLocalIdent } from '../lib';
export declare type PluginOptions = {
    includePaths: string[];
    localIdentName: string;
    getLocalIdent: GetLocalIdent;
    strict: boolean;
};
export interface PreprocessorOptions {
    content: string;
    filename: string;
}
export interface PreprocessorResult {
    code: string;
}
export declare type CSSModuleList = Record<string, string>;
export declare type CSSModuleDirectory = Record<string, CSSModuleList>;
