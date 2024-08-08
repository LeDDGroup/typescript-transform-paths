// @ts-check
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { patch } from "ts-patch";
import { patch as _patch } from "tsp1";
import { patch as __patch } from "tsp2";

const __dirname = dirname(fileURLToPath(import.meta.url)); // https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const rootDir = __dirname;
const tsDirs = ["typescript-three", "typescript-four-seven", "typescript"];

/* ****************************************************************************************************************** *
 * Patch TS Modules
 * ****************************************************************************************************************** */

const baseDirs = new Map();

for (const tsDirName of tsDirs) {
  const mainDir = resolve(rootDir, "node_modules", tsDirName);
  if (!existsSync(join(mainDir, "lib-backup"))) baseDirs.set(tsDirName, mainDir);
}

// Patch discovered modules
for (const [dirName, dir] of baseDirs)
  if (dirName === "typescript-three") _patch(["tsc.js", "typescript.js"], { basedir: dir });
  else if (dirName === "typescript-four-seven") __patch(["tsc.js", "typescript.js"], { dir });
  else patch(["tsc.js", "typescript.js"], { dir });
