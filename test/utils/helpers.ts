import path from "path";
import * as TS from "typescript";
import { TsTransformPathsConfig } from "../../src/types";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export type EmittedFiles = { [fileName: string]: { js: string; dts: string } };

export interface CreateTsProgramOptions {
  tsInstance: any;
  files?: { [fileName: string]: /* data */ string };
  tsConfigFile?: string;
  disablePlugin?: boolean;
  additionalOptions?: TS.CompilerOptions;
  pluginOptions?: TsTransformPathsConfig;
}

// endregion

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

const transformerPath = path.resolve(__dirname, "../../src/index.ts");

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Create TS Program with faux files and options
 */
export function createTsProgram(opt: CreateTsProgramOptions): TS.Program {
  const { disablePlugin, additionalOptions, pluginOptions } = opt;
  const tsInstance: typeof TS = opt.tsInstance;

  if ((!opt.files && !opt.tsConfigFile) || (opt.files && opt.tsConfigFile))
    throw new Error(`Must supply *either* files or tsConfigFile to createProgram`);

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

  let compilerOptions: TS.CompilerOptions = {};
  let fileNames: string[];
  let host: TS.CompilerHost | undefined;

  if (opt.tsConfigFile) {
    const pcl = tsInstance.getParsedCommandLineOfConfigFile(opt.tsConfigFile, extendOptions, <any>tsInstance.sys)!;
    compilerOptions = pcl.options;
    fileNames = pcl.fileNames;
  } else {
    const files = Object.entries(compilerOptions.files!).reduce((p, [fileName, data]) => {
      p[tsInstance.normalizePath(fileName)] = data;
      return p;
    }, <any>{});
    fileNames = Object.keys(files);

    host = tsInstance.createCompilerHost(compilerOptions);
    compilerOptions = extendOptions;

    /* Patch host to feed mock files */
    const originalGetSourceFile: any = host.getSourceFile;
    host.getSourceFile = function (fileName: string, scriptTarget: TS.ScriptTarget) {
      if (Object.keys(files).includes(fileName))
        return tsInstance.createSourceFile(fileName, files[fileName], scriptTarget);
      else originalGetSourceFile.apply(undefined, arguments);
    };
  }

  return tsInstance.createProgram({ options: compilerOptions, rootNames: fileNames, host });
}

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

// endregion
