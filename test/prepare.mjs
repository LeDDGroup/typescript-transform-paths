// @ts-check
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { patch } from "ts-patch";

const __dirname = dirname(fileURLToPath(import.meta.url)); // https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules

function patchTsModules() {
  const rootDir = __dirname;

  /** @param {string} moduleName */
  function patchTypescript(moduleName, tspatch) {
    const basedir = resolve(rootDir, "node_modules", moduleName);
    tspatch(["tsc.js", "typescript.js"], { basedir, dir: basedir });
  }

  patchTypescript("typescript", patch);
}

patchTsModules();
