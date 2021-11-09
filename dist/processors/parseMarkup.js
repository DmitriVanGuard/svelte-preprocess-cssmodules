"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const string_prototype_matchall_1 = __importDefault(require("string.prototype.matchall"));
const object_fromentries_1 = __importDefault(require("object.fromentries"));
const patterns_1 = require("../lib/patterns");
const lib_1 = require("../lib");
/**
 * Append imported stylesheet content to the component
 * @param markupContent the component markup content
 * @param styleContent the component style content
 * @param importedStylesheets the list of imported stylesheet content
 * @param fileType fileType being imported
 * @return the updated markup of the component
 */
const appendStylesheetToMarkup = (markupContent, styleContent, importedStylesheets, fileType) => {
    if (styleContent) {
        let updatedStyle = styleContent;
        // update style with imports stylesheets
        if (importedStylesheets.length) {
            updatedStyle = styleContent.replace(patterns_1.PATTERN_STYLE, (_match, attributes, stylesheetContent) => {
                const styleAttribute = fileType !== 'css' ? ` lang="${fileType}"` : attributes;
                return `<style${styleAttribute || ''}>\n${importedStylesheets.join('\n')}${stylesheetContent}</style>`;
            });
        }
        return markupContent.replace(patterns_1.PATTERN_STYLE, updatedStyle);
    }
    if (importedStylesheets.length) {
        const styleAttribute = fileType !== 'css' ? ` lang="${fileType}"` : '';
        return `${markupContent}\n<style${styleAttribute}>\n${importedStylesheets.join('\n')}\n</style>`;
    }
    return markupContent;
};
/**
 * Parse Markup
 * @param content the markup content
 * @param filename the resource filename
 * @param pluginOptions preprocess-cssmodules options
 */
const parseMarkup = (content, filename, pluginOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedContent = content;
    const cssModuleList = {};
    const styles = content.match(patterns_1.PATTERN_STYLE);
    const styleContent = styles && styles.length ? styles[0] : null;
    const importedStyleContent = [];
    let importedStyleType = 'css';
    // go through imports
    if (content.search(patterns_1.PATTERN_IMPORT) !== -1) {
        const directives = new Map();
        parsedContent = parsedContent.replace(patterns_1.PATTERN_IMPORT, (match, varName, relativePath, extension) => {
            const absolutePath = path_1.default.resolve(path_1.default.dirname(filename), relativePath);
            const nodeModulesPath = path_1.default.resolve(`${path_1.default.resolve()}/node_modules`, relativePath);
            try {
                const fileContent = fs_1.default.readFileSync(absolutePath, 'utf8');
                importedStyleContent.push(fileContent);
                if (!varName) {
                    return '';
                }
                const classlist = new Map();
                Array.from(string_prototype_matchall_1.default(fileContent, patterns_1.PATTERN_CLASS_SELECTOR)).forEach((matchItem) => {
                    const className = matchItem[1];
                    // set array from exported className
                    const destructuredImportRegex = /\{([\w,\s]+)\}/gm;
                    const isDestructuredImport = varName.search(destructuredImportRegex) !== -1;
                    let destructuredImportNames = [];
                    if (isDestructuredImport) {
                        const destructuredImport = Object.values(object_fromentries_1.default(string_prototype_matchall_1.default(varName, destructuredImportRegex)))[0].toString();
                        if (destructuredImport) {
                            destructuredImportNames = destructuredImport.replace(/\s/g, '').split(',');
                        }
                    }
                    const camelCaseClassName = lib_1.camelCase(className);
                    if (!classlist.has(camelCaseClassName) &&
                        (!isDestructuredImport ||
                            (isDestructuredImport && destructuredImportNames.includes(camelCaseClassName)))) {
                        const interpolatedName = lib_1.createClassName(filename, content, fileContent, className, pluginOptions);
                        classlist.set(camelCaseClassName, interpolatedName);
                        cssModuleList[className] = interpolatedName;
                        // consider use with class directive
                        const directiveClass = isDestructuredImport
                            ? camelCaseClassName
                            : `${varName}.${camelCaseClassName}`;
                        if (patterns_1.PATTERN_CLASS_DIRECTIVE(directiveClass).test(parsedContent)) {
                            directives.set(directiveClass, interpolatedName);
                        }
                    }
                });
                if (extension !== 'css') {
                    importedStyleType = extension;
                }
                return `const ${varName} = ${JSON.stringify(object_fromentries_1.default(classlist))};`;
            }
            catch (err) {
                fs_1.default.access(nodeModulesPath, fs_1.constants.F_OK, (error) => {
                    if (error) {
                        throw new Error(err); // not found in node_modules packages either, throw orignal error
                    }
                });
                return match;
            }
        });
        // directives replacement (as dynamic values cannot be used)
        if (directives.size) {
            yield new Promise((resolve) => {
                let count = 0;
                directives.forEach((value, key) => {
                    parsedContent = parsedContent.replace(patterns_1.PATTERN_CLASS_DIRECTIVE(key), (directiveMatch) => directiveMatch.replace(key, value));
                    count += 1;
                    if (count === directives.size) {
                        resolve(true);
                    }
                });
            });
        }
    }
    // go through module $style syntax
    if (content.search(patterns_1.PATTERN_MODULE) !== -1) {
        parsedContent = parsedContent.replace(patterns_1.PATTERN_MODULE, (match, key, className) => {
            let replacement = '';
            if (!className.length) {
                throw new Error(`Invalid class name in file ${filename}.\n` +
                    'This usually happens when using dynamic classes with svelte-preprocess-cssmodules.');
            }
            if (!patterns_1.PATTERN_CLASSNAME(className).test(`.${className}`)) {
                throw new Error(`Classname "${className}" in file ${filename} is not valid`);
            }
            if (!patterns_1.PATTERN_CLASSNAME(className).test(styleContent)) {
                if (pluginOptions.strict) {
                    throw new Error(`Classname "${className}" was not found in declared ${filename} <style>`);
                }
                // In non-strict mode, we just remove $style classes that don't have a definition
                return replacement;
            }
            if (styleContent) {
                const interpolatedName = lib_1.createClassName(filename, content, styleContent, className, pluginOptions);
                cssModuleList[className] = interpolatedName;
                replacement = interpolatedName;
            }
            return replacement;
        });
    }
    // Append imported stylesheet to markup
    parsedContent = appendStylesheetToMarkup(parsedContent, styleContent, importedStyleContent, importedStyleType);
    return {
        content: parsedContent,
        cssModuleList,
    };
});
exports.default = parseMarkup;
