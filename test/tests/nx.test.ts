import { execSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";

import ts from "typescript";

import { projectsPaths } from "../config.ts";

describe(`NX Transformer`, () => {
  describe(`(e2e) Works in NX project`, () => {
    const projectRoot = ts.normalizePath(path.join(projectsPaths, "nx"));

    // TODO - Investigate ways to do without emit
    test(`Transformer works for emitted declaration`, (t) => {
      execSync("yarn run build", { cwd: projectRoot });

      try {
        const file = readFileSync(`${projectRoot}/dist/packages/library1/src/index.d.ts`, "utf8");
        t.assert.match(file, /import { name as library2Name } from "..\/..\/library2";/);
      } finally {
        rmSync(`${projectRoot}/dist`, { recursive: true, force: true });
      }
    });
  });
});
