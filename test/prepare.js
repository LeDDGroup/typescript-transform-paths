const fs = require("fs");
const path = require("path");
const tsPatch = require("ts-patch");
const tsp1 = require("tsp1");
const tsp2 = require("tsp2");

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const rootDir = __dirname;
const tsDirs = [
  "typescript-three",
  "typescript-four-seven",
  "typescript",
];

/* ****************************************************************************************************************** *
 * Patch TS Modules
 * ****************************************************************************************************************** */

const baseDirs = new Map();

for (const tsDirName of tsDirs) {
  const mainDir = path.resolve(rootDir, "node_modules", tsDirName);
  if (!fs.existsSync(path.join(mainDir, "lib-backup"))) baseDirs.set(tsDirName, mainDir);
}

// Patch discovered modules
for (const [dirName, dir] of baseDirs)
  if (dirName === "typescript-three") tsp1.patch(["tsc.js", "typescript.js"], { basedir: dir });
  else if (dirName === "typescript-four-seven") tsp2.patch(["tsc.js", "typescript.js"], { dir });
  else tsPatch.patch(["tsc.js", "typescript.js"], { dir });
