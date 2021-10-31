const fs = require("fs");
const path = require("path");
const glob = require("glob");
const tsPatch = require("ts-patch");

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const rootDir = __dirname;
const tsDirs = glob.sync('./node_modules/typescript-*/lib/typescript.js', { cwd: rootDir })
  .map(d => path.resolve(rootDir, d.replace(/\/lib\/typescript.js$/, '')));

/* ****************************************************************************************************************** *
 * Patch TS Modules
 * ****************************************************************************************************************** */

for (const dir of tsDirs)
  if (!fs.existsSync(path.join(dir, "lib-backup")))
    tsPatch.patch(["tsc.js", "typescript.js"], { basedir: dir });
