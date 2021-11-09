"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const loader_utils_1 = require("loader-utils");
const patterns_1 = require("./patterns");
/**
 * interpolateName, adjusted version of loader-utils/interpolateName
 * @param resourcePath The file resourcePath
 * @param localName The local name/rules to replace
 * @param content The content to use base the hash on
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function interpolateName(resourcePath, localName, content) {
    const filename = localName || '[hash].[ext]';
    let ext = 'svelte';
    let basename = 'file';
    let directory = '';
    let folder = '';
    const parsed = path_1.default.parse(resourcePath);
    let composedResourcePath = resourcePath;
    if (parsed.ext) {
        ext = parsed.ext.substr(1);
    }
    if (parsed.dir) {
        basename = parsed.name;
        composedResourcePath = parsed.dir + path_1.default.sep;
    }
    directory = composedResourcePath.replace(/\\/g, '/').replace(/\.\.(\/)?/g, '_$1');
    if (directory.length === 1) {
        directory = '';
    }
    else if (directory.length > 1) {
        folder = path_1.default.basename(directory);
    }
    let url = filename;
    if (content) {
        url = url.replace(/\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi, (all, hashType, digestType, maxLength) => loader_utils_1.getHashDigest(content, hashType, digestType, parseInt(maxLength, 10)));
    }
    return url
        .replace(/\[ext\]/gi, () => ext)
        .replace(/\[name\]/gi, () => basename)
        .replace(/\[path\]/gi, () => directory)
        .replace(/\[folder\]/gi, () => folder);
}
/**
 * generateName
 * @param resourcePath The file resourcePath
 * @param styles The style content
 * @param className The cssModules className
 * @param localIdentName The localIdentName rule
 */
function generateName(resourcePath, styles, className, localIdentName) {
    const filePath = resourcePath;
    const localName = localIdentName.length
        ? localIdentName.replace(/\[local\]/gi, () => className)
        : className;
    const content = `${styles}-${filePath}-${className}`;
    let interpolatedName = interpolateName(resourcePath, localName, content).replace(/\./g, '-');
    // replace unwanted characters from [path]
    if (patterns_1.PATTERN_PATH_UNALLOWED.test(interpolatedName)) {
        interpolatedName = interpolatedName.replace(patterns_1.PATTERN_PATH_UNALLOWED, '_');
    }
    // prevent class error when the generated classname starts from a non word charater
    if (/^(?![a-zA-Z_])/.test(interpolatedName)) {
        interpolatedName = `_${interpolatedName}`;
    }
    // prevent svelte "Unused CSS selector" warning when the generated classname ends by `-`
    if (interpolatedName.slice(-1) === '-') {
        interpolatedName = interpolatedName.slice(0, -1);
    }
    return interpolatedName;
}
/**
 * Create the interpolated name
 * @param filename tthe resource filename
 * @param markup Markup content
 * @param style Stylesheet content
 * @param className the className
 * @param pluginOptions preprocess-cssmodules options
 * @return the interpolated name
 */
function createCssModulesClassName(filename, markup, style, className, pluginOptions) {
    const interpolatedName = generateName(filename, style, className, pluginOptions.localIdentName);
    return pluginOptions.getLocalIdent({
        context: path_1.default.dirname(filename),
        resourcePath: filename,
    }, {
        interpolatedName,
        template: pluginOptions.localIdentName,
    }, className, {
        markup,
        style,
    });
}
exports.default = createCssModulesClassName;
