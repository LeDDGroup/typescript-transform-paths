// @ts-check
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { patch } from "ts-patch";
import { patch as patch1 } from "tsp1";
import { patch as patch2 } from "tsp2";

const __dirname = dirname(fileURLToPath(import.meta.url)); // https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules

function patchTsModules() {
  const rootDir = __dirname;

  /** @param {string} moduleName */
  function patchTypescript(moduleName, tspatch) {
    const basedir = resolve(rootDir, "node_modules", moduleName);
    tspatch(["tsc.js", "typescript.js"], { basedir, dir: basedir });
  }

  patchTypescript("typescript-3", patch1);
  patchTypescript("typescript-4.7", patch2);
  patchTypescript("typescript-5.5", patch);
  patchTypescript("typescript-5.6", patch);
  patchTypescript("typescript", patch);
}

patchTsModules();
