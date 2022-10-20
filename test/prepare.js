const fs = require("fs");
const path = require("path");
const tsPatch = require("ts-patch");

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const rootDir = __dirname;
const tsDirs = ["typescript-three", "typescript-four-seven", "typescript"];

/* ****************************************************************************************************************** *
 * Patch TS Modules
 * ****************************************************************************************************************** */

const baseDirs = new Set();

for (const tsDirName of tsDirs) {
  const mainDir = path.resolve(rootDir, "node_modules", tsDirName);
  if (!fs.existsSync(path.join(mainDir, "lib-backup"))) baseDirs.add(mainDir);
}

// Patch discovered modules
for (const dir of baseDirs) tsPatch.patch(["tsc.js", "typescript.js"], { basedir: dir });
