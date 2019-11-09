import { dirname, relative, join } from "path";
import slash = require("slash");
import read = require("fs-readdir-recursive");
import { readFileSync } from "fs";

describe("with-path", () => {
  const root = join(__dirname, "__result/with-path/original");
  const files = read(root);
  files.forEach(file => {
    test(file, () => {
      const originalFile = join(__dirname, "__result/with-path/original", file);
      const sourceDir = dirname(relative(root, originalFile));
      const original = readFileSync(originalFile, "utf8")
        .replace(/"(@.*)"/g, (_, moduleName) => {
          return `"${bindModuleToFile(moduleName, sourceDir)}"`;
        })
        .replace('"path"', '"https://external.url/path.js"')
        .replace('"circular/a"', '"../circular/a"');
      const generatedFile = join(
        __dirname,
        "__result/with-path/generated",
        file
      );
      const generated = readFileSync(generatedFile, "utf8");
      expect(generated).toEqual(original);
    });
  });
});

describe("without-path", () => {
  const root = join(__dirname, "__result/without-path/original");
  const files = read(root);
  files.forEach(file => {
    test(file, () => {
      const originalFile = join(
        __dirname,
        "__result/without-path/original",
        file
      );
      const original = readFileSync(originalFile, "utf8").replace(
        '"utils/logger"',
        '"../utils/logger"'
      );
      const generatedFile = join(
        __dirname,
        "__result/without-path/generated",
        file
      );
      const generated = readFileSync(generatedFile, "utf8");
      expect(generated).toEqual(original);
    });
  });
});

function bindModuleToFile(moduleName: string, sourceDir: string) {
  const match = /@(.*)/.exec(moduleName);
  if (match) {
    const out = match[1];
    const file = slash(relative(sourceDir, out));
    return file[0] === "." ? file : `./${file}`;
  }
}
