const fs = require("fs");
const path = require("path");
const glob = require("glob");
const tsPatch = require("ts-patch");

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const rootDir = __dirname;
const cacheDir = path.resolve(rootDir, ".yarn-cache");
const tsDirs = ["typescript-three", "typescript"];

/* ****************************************************************************************************************** *
 * Patch TS Modules
 * ****************************************************************************************************************** */

const baseDirs = new Set();

for (const tsDirName of tsDirs) {
  const mainDir = path.resolve(rootDir, "node_modules", tsDirName);

  /* Find un-patched typescript modules */
  if (!fs.existsSync(path.join(mainDir, "lib-backup"))) {
    baseDirs.add(mainDir);

    // Add cached module path
    glob
      .sync(`**/${tsDirName}/lib/@(typescript|tsc).js`, { cwd: cacheDir })
      .map((f) => path.resolve(cacheDir, path.dirname(f), ".."))
      .forEach((d) => baseDirs.add(d));
  }
}

// Patch discovered modules
for (const dir of baseDirs) tsPatch.patch(["tsc.js", "typescript.js"], { basedir: dir });
