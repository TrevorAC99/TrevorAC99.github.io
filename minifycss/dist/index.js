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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fsPromises = __importStar(require("fs/promises"));
const clean_css_1 = __importDefault(require("clean-css"));
const cssDir = './css';
const outDir = './cssmin';
let minifier = new clean_css_1.default({ level: 2 });
async function main() {
    let contents = await fsPromises.readdir(cssDir);
    await mkdirIfNotExist(outDir);
    // For making separate files
    // await minifyIntoSeparateFiles(
    //   outDir,
    //   contents.filter((value) => value.endsWith('.css'))
    // );
    // For bundling files
    await minifyAndBundle(outDir, contents.filter((value) => value.endsWith('.css')));
}
async function minifyIntoSeparateFiles(outDir, contents) {
    await forEachAsync(contents, async (file) => {
        let css = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
        let minifiedCss = minifier.minify(css).styles;
        await fsPromises.writeFile(`${outDir}/${file}`, minifiedCss);
    });
}
async function minifyAndBundle(outDir, contents) {
    let min = await forEachAsync(contents, async (file) => {
        let css = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
        let minifiedCss = minifier.minify(css).styles;
        return [file, minifiedCss];
    });
    let bundledCss = '/* Bundled CSS - This file is generated css, do not edit */';
    for (let [fileName, minifiedCss] of min) {
        bundledCss += `\n/* Begin minified ${fileName} */\n\n`;
        bundledCss += minifiedCss;
        bundledCss += `\n\n/* End minified ${fileName} */\n`;
    }
    await fsPromises.writeFile(`${outDir}/bundle.css`, bundledCss);
}
async function forEachAsync(arr, asyncFn) {
    return Promise.all(arr.map(asyncFn));
}
async function mkdirIfNotExist(path) {
    if (await fileExists(outDir)) {
        await fsPromises.rmdir(outDir, { recursive: true });
    }
    await fsPromises.mkdir(outDir);
}
function fileExists(path) {
    return fsPromises
        .access(path)
        .then(() => true)
        .catch(() => false);
}
main();
