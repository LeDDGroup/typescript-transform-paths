import path from "node:path";
import { createTsProgram, getEmitResultFromProgram, getRelativeEmittedFiles } from "../../utils";
import { ts, tsModules, projectsPaths } from "../../config";

describe(`Transformer -> General Tests`, () => {
  const projectRoot = path.join(projectsPaths, "general");
  const tsConfigFile = path.join(projectRoot, "tsconfig.json");

  test.each(tsModules)(`TypeScript %s`, (_description, tsInstance) => {
    const programWithTransformer = createTsProgram({ tsInstance: tsInstance as typeof ts, tsConfigFile });
    const transformedFiles = getEmitResultFromProgram(programWithTransformer);
    const emittedFiles = getRelativeEmittedFiles(projectRoot, transformedFiles);
    expect(emittedFiles).toMatchSnapshot();
  });
});
