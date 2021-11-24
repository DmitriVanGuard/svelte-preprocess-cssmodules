"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patterns_1 = require("../lib/patterns");
const parseStyle = (content, filename, cssModuleList) => {
    if (Object.keys(cssModuleList).length === 0) {
        return { content };
    }
    let parsedContent = content;
    Object.keys(cssModuleList).forEach((className) => {
        parsedContent = parsedContent.replace(patterns_1.PATTERN_SELECTOR(className), (match) => {
            let generatedClass = match.replace(patterns_1.PATTERN_CLASSNAME(className), () => `.${cssModuleList[className]}`);
            generatedClass = generatedClass.replace(/\+/g, '\\+');
            return generatedClass.indexOf(':global(') !== -1
                ? generatedClass
                : `:global(${generatedClass})`.replace(',', '') + (generatedClass.includes(',') ? ',' : '');
        });
    });
    return {
        content: parsedContent,
    };
};
exports.default = parseStyle;
