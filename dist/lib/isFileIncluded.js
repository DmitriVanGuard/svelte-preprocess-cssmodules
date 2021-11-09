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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const isFileIncluded = (includePaths, filename) => __awaiter(void 0, void 0, void 0, function* () {
    if (includePaths.length < 1) {
        return true;
    }
    const isIncluded = yield new Promise((resolve) => {
        includePaths.forEach((includePath, index) => {
            if (filename.indexOf(path_1.default.resolve(includePath)) !== -1) {
                resolve(true);
            }
            if (index === includePaths.length - 1) {
                resolve(false);
            }
        });
    });
    return isIncluded;
});
exports.default = isFileIncluded;
