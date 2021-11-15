import { execSync } from "child_process";
import path from "path";
import ts from 'typescript'
import { projectsPath } from "../../src/config";

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`ESM Loader`, () => {
  const esmProjectRoot = ts.normalizePath(path.join(projectsPath, "esm-loader"));

  // See: https://github.com/LeDDGroup/typescript-transform-paths/issues/134
  test(`Transforms ESM project`, () => {
    const res = execSync(
      `node --no-warnings --loader tstp/esm --es-module-specifier-resolution=node ./src/index.ts`,
      { cwd: esmProjectRoot }
    ).toString();

    expect(res).toMatch(/^null($|\r?\n)/);
  });
});
