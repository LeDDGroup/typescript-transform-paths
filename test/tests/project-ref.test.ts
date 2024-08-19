import path from "node:path";
import { createTsSolutionBuilder, EmittedFiles } from "../utils";
import { projectsPaths, ts } from "../config";

/* File Paths */
const projectDir = ts.normalizePath(path.join(projectsPaths, "project-ref"));

/**
 * @exapmle
 *   const projectDir = ts.normalizePath(path.join(projectsPaths, "project-ref"));
 *   const builder = createTsSolutionBuilder({ tsInstance: ts, projectDir });
 *   const emittedFiles = getRelativeEmittedFiles(projectDir, builder.getEmitFiles());
 */
function getRelativeEmittedFiles(projectDir: string, pathRecord: EmittedFiles) {
  const result = {} as EmittedFiles;
  for (const key in pathRecord) {
    result[path.relative(projectDir, key)] = pathRecord[key];
  }
  return result;
}

// see: https://github.com/LeDDGroup/typescript-transform-paths/issues/125
test("project references", () => {
  const builder = createTsSolutionBuilder({ tsInstance: ts, projectDir });
  const emittedFiles = getRelativeEmittedFiles(projectDir, builder.getEmitFiles());
  expect(emittedFiles).toMatchInlineSnapshot(`
{
  "lib/a/index.ts": {
    "dts": "export declare const AReffedConst = 43;
",
    "js": "export const AReffedConst = 43;
",
  },
  "lib/b/index.ts": {
    "dts": "export { AReffedConst } from "../a/index";
export { LocalConst } from "./local/index";
",
    "js": "export { AReffedConst } from "../a/index";
export { LocalConst } from "./local/index";
",
  },
  "lib/b/local/index.ts": {
    "dts": "export declare const LocalConst = 55;
",
    "js": "export const LocalConst = 55;
",
  },
}
`);
});
