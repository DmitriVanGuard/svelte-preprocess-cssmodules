import { CSSModuleList } from '../types';
export declare type Parser = {
    content: string;
};
declare const parseStyle: (content: string, filename: string, cssModuleList: CSSModuleList) => Parser;
export default parseStyle;
