"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const processors_1 = require("./processors");
const lib_1 = require("./lib");
let pluginOptions = {
    includePaths: [],
    localIdentName: '[local]-[hash:base64:6]',
    getLocalIdent: lib_1.getLocalIdent,
    strict: false,
};
const cssModuleDirectory = {};
const markup = ({ content, filename }) => __awaiter(void 0, void 0, void 0, function* () {
    const isIncluded = yield lib_1.isFileIncluded(pluginOptions.includePaths, filename);
    if (!isIncluded) {
        return { code: content };
    }
    if (!lib_1.PATTERN_MODULE.test(content) && !lib_1.PATTERN_IMPORT.test(content)) {
        return { code: content };
    }
    const parsedMarkup = yield processors_1.parseMarkup(content, filename, pluginOptions);
    cssModuleDirectory[filename] = parsedMarkup.cssModuleList;
    return {
        code: parsedMarkup.content,
    };
});
const style = ({ content, filename }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.prototype.hasOwnProperty.call(cssModuleDirectory, filename)) {
        return { code: content };
    }
    const parsedStyle = processors_1.parseStyle(content, filename, cssModuleDirectory[filename]);
    return { code: parsedStyle.content };
});
// eslint-disable-next-line no-multi-assign
exports.default = exports = module.exports = (options) => {
    pluginOptions = Object.assign(Object.assign({}, pluginOptions), options);
    return {
        markup,
        style,
    };
};
