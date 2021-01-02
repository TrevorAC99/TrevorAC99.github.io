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
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = __importStar(require("querystring"));
const http = __importStar(require("https"));
const fsPromises = __importStar(require("fs/promises"));
const cssDir = './css';
const outDir = './cssmin';
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
        let contents = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
        let minifiedContents = await minifyCSS(contents);
        await fsPromises.writeFile(`${outDir}/${file}`, minifiedContents);
    });
}
async function minifyAndBundle(outDir, contents) {
    let min = await forEachAsync(contents, async (file) => {
        let css = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
        let minifiedCss = await minifyCSS(css);
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
function minifyCSS(css) {
    return new Promise((resolve, reject) => {
        let query = querystring.stringify({
            input: css,
        });
        let req = http.request({
            method: 'POST',
            hostname: 'cssminifier.com',
            path: '/raw',
        }, async (resp) => {
            if (resp.statusCode !== 200) {
                reject('StatusCode=' + resp.statusCode);
                return;
            }
            resolve(await streamToString(resp));
        });
        req.on('error', (err) => reject(err));
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', query.length);
        req.end(query, 'utf8');
    });
}
function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
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
