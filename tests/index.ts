import { dirname, relative, join, posix } from "path";
import read = require("fs-readdir-recursive");
import { readFileSync } from "fs";

const root = join(__dirname, "__result/original");
const files = read(root);
files.forEach(file => {
  test(file, () => {
    const originalFile = join(__dirname, "__result/original", file);
    const sourceDir = dirname(relative(root, originalFile));
    const original = update(readFileSync(originalFile, "utf8"), sourceDir);
    const generatedFile = join(__dirname, "__result/generated", file);
    const generated = readFileSync(generatedFile, "utf8");
    expect(generated).toEqual(original);
  });
});

function update(content: string, sourceDir: string) {
  return content
    .replace(/"(@.*)"/g, (_, moduleName) => {
      return `"${bindModuleToFile(moduleName, sourceDir)}"`;
    })
    .replace('"path"', '"https://external.url/path.js"')
    .replace('"circular/a"', '"../circular/a"');
}

function bindModuleToFile(moduleName: string, sourceDir: string) {
  const match = /@(.*)/.exec(moduleName);
  if (match) {
    const out = match[1];
    const file = posix.relative(sourceDir, out);
    return file[0] === "." ? file : `./${file}`;
  }
}
