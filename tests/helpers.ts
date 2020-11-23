import path from "path";
import * as TS from "typescript";
import { TsTransformPathsConfig } from "../src";

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const ts = require("ttypescript") as typeof TS;

/* ****************************************************************************************************************** *
 * Test Helpers
 * ****************************************************************************************************************** */

/**
 * Create TS Program with faux files and options
 */
export function createProgram(
  files: { [fileName: string]: /* data */ string },
  disablePlugin?: boolean,
  additionalOptions?: TS.CompilerOptions,
  pluginOptions?: TsTransformPathsConfig
): TS.Program;
/**
 * Create TS Program with real tsConfigFile
 */
export function createProgram(
  tsConfigFile: string,
  disablePlugin?: boolean,
  additionalOptions?: TS.CompilerOptions,
  pluginOptions?: TsTransformPathsConfig
): TS.Program;
export function createProgram(
  configOrFiles: string | { [fileName: string]: /* data */ string },
  disablePlugin?: boolean,
  additionalOptions?: TS.CompilerOptions,
  pluginOptions?: TsTransformPathsConfig
): TS.Program {
  const transformerPath = path.resolve(__dirname, "../src/index.ts");

  const extendOptions = Object.assign({}, additionalOptions, {
    outDir: undefined,
    noEmit: false,
    plugins: disablePlugin
      ? []
      : [
          { transform: transformerPath, ...pluginOptions },
          {
            transform: transformerPath,
            afterDeclarations: true,
            ...pluginOptions,
          },
        ],
  });

  let options: any = {};
  let fileNames: string[];
  let host: TS.CompilerHost | undefined;
  if (typeof configOrFiles === "string") {
    const pcl = ts.getParsedCommandLineOfConfigFile(configOrFiles, extendOptions, <any>ts.sys)!;
    options = pcl.options;
    fileNames = pcl.fileNames;
  } else {
    const files = Object.entries(configOrFiles).reduce((p, [fileName, data]) => {
      p[ts.normalizePath(fileName)] = data;
      return p;
    }, <any>{});
    fileNames = Object.keys(files);

    host = ts.createCompilerHost(options);
    options = extendOptions;

    /* Patch host to feed mock files */
    const originalGetSourceFile: any = host.getSourceFile;
    host.getSourceFile = function (fileName: string, scriptTarget: TS.ScriptTarget) {
      if (Object.keys(files).includes(fileName)) return ts.createSourceFile(fileName, files[fileName], scriptTarget);
      else originalGetSourceFile.apply(undefined, arguments);
    };
  }

  return ts.createProgram({ options, rootNames: fileNames, host });
}

export type EmittedFiles = { [fileName: string]: { js: string; dts: string } };

/**
 * Get emitted files for program
 * @param program
 */
export function getEmitResult(program: TS.Program): EmittedFiles {
  const outputFiles: EmittedFiles = {};

  const writeFile = (fileName: string, data: string) => {
    let { 1: rootName, 2: ext } = fileName.match(/(.+)\.((d.ts)|(js))$/) ?? [];
    if (!ext) return;
    rootName = `${rootName}.ts`;
    const key = ext.replace(".", "") as keyof EmittedFiles[string];
    if (!outputFiles[rootName]) outputFiles[rootName] = <any>{};
    outputFiles[rootName][key] = data;
  };

  program.emit(undefined, writeFile);

  return outputFiles;
}
