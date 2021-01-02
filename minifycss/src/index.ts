import * as querystring from 'querystring';
import * as http from 'https';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';

const cssDir = './css';
const outDir = './cssmin';

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
    let contents = (await fsPromises.readFile(`${cssDir}/${file}`)).toString();
    let minifiedContents = await minifyCSS(contents);
    await fsPromises.writeFile(`${outDir}/${file}`, minifiedContents);
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
      let minifiedCss = await minifyCSS(css);
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

function minifyCSS(css: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let query = querystring.stringify({
      input: css,
    });

    let req = http.request(
      {
        method: 'POST',
        hostname: 'cssminifier.com',
        path: '/raw',
      },
      async (resp) => {
        if (resp.statusCode !== 200) {
          reject('StatusCode=' + resp.statusCode);
          return;
        }

        resolve(await streamToString(resp));
      }
    );
    req.on('error', (err) => reject(err));
    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setHeader('Content-Length', query.length);
    req.end(query, 'utf8');
  });
}

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
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
