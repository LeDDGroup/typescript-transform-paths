// @ts-check
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { patch } from "ts-patch";

const __dirname = dirname(fileURLToPath(import.meta.url)); // https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules

function patchTsModules() {
  const rootDir = __dirname;
  const moduleName = "typescript";

  const basedir = resolve(rootDir, "node_modules", moduleName);
  // @ts-expect-error -- TODO fix later
  patch(["tsc.js", "typescript.js"], { basedir, dir: basedir });
}

patchTsModules();
