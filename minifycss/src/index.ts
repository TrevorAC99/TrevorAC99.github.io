import * as fsPromises from 'fs/promises';
import CleanCSS from 'clean-css';

const cssDir = './css';
const outDir = './cssmin';

let minifier = new CleanCSS({level: 2});

async function main(): Promise<void> {
  let contents = await fsPromises.readdir(cssDir);
  await mkdirIfNotExist(outDir);

  // For making separate files
  // await minifyIntoSeparateFiles(
  //   outDir,
  //   contents.filter((value) => value.endsWith('.css'))
  // );

  // For bundling files
  await minifyAndBundle(
    outDir,
    contents.filter((value) => value.endsWith('.css'))
  );
}

async function minifyIntoSeparateFiles(
  outDir: string,
  contents: string[]
): Promise<void> {
  await forEachAsync<string, void>(contents, async (file) => {
    let css = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
    let minifiedCss = minifier.minify(css).styles;
    await fsPromises.writeFile(`${outDir}/${file}`, minifiedCss);
  });
}

async function minifyAndBundle(
  outDir: string,
  contents: string[]
): Promise<void> {
  let min = await forEachAsync<string, [string, string]>(
    contents,
    async (file) => {
      let css = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
      let minifiedCss = minifier.minify(css).styles;
      return [file, minifiedCss];
    }
  );

  let bundledCss = '/* Bundled CSS - This file is generated css, do not edit */';
  for (let [fileName, minifiedCss] of min) {
    bundledCss += `\n/* Begin minified ${fileName} */\n\n`;
    bundledCss += minifiedCss;
    bundledCss += `\n\n/* End minified ${fileName} */\n`;
  }

  await fsPromises.writeFile(`${outDir}/bundle.css`, bundledCss);
}

async function forEachAsync<T, X>(
  arr: T[],
  asyncFn: (value: T, index: number, array: T[]) => Promise<X>
) {
  return Promise.all(arr.map(asyncFn));
}

async function mkdirIfNotExist(path: string): Promise<void> {
  if (await fileExists(outDir)) {
    await fsPromises.rmdir(outDir, { recursive: true });
  }
  await fsPromises.mkdir(outDir);
}

function fileExists(path: string): Promise<boolean> {
  return fsPromises
    .access(path)
    .then(() => true)
    .catch(() => false);
}

main();
