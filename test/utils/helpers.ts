import { default as tstpTransform, TsTransformPathsConfig } from "../../src";
import fs from "fs";
import ts from "typescript";
import * as tsNode from "ts-node";
import * as config from "../tests/config";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export type EmittedFiles = { [fileName: string]: { js: string; dts: string } };

export interface CreateTsProgramOptions {
  tsInstance: any;
  files?: { [fileName: string]: /* data */ string };
  tsConfigFile?: string;
  disablePlugin?: boolean;
  additionalOptions?: ts.CompilerOptions;
  pluginOptions?: TsTransformPathsConfig;
}

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Create TS Program with faux files and options
 */
export function createTsProgram(
  opt: CreateTsProgramOptions,
  transformerPath: string = config.transformerPath
): ts.Program {
  const { disablePlugin, additionalOptions, pluginOptions } = opt;
  const tsInstance: typeof ts = opt.tsInstance;

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

  let compilerOptions: ts.CompilerOptions = {};
  let fileNames: string[];
  let host: ts.CompilerHost | undefined;

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
    host.getSourceFile = function (fileName: string, scriptTarget: ts.ScriptTarget) {
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
export function getEmitResultFromProgram(program: ts.Program): EmittedFiles {
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

export function getManualEmitResult(pluginConfig: TsTransformPathsConfig, tsInstance: any, pcl: ts.ParsedCommandLine) {
  const { options: compilerOptions, fileNames } = pcl;
  const transformer = tstpTransform(void 0, pluginConfig, { ts: tsInstance } as any, { compilerOptions, fileNames });

  const { transformed } = tsInstance.transform(
    fileNames.map((f) =>
      tsInstance.createSourceFile(f, fs.readFileSync(f, "utf8"), tsInstance.ScriptTarget.ESNext, true)
    ),
    [transformer],
    compilerOptions
  );

  const printer = tsInstance.createPrinter();

  const res: EmittedFiles = {};
  for (const sourceFile of transformed) res[sourceFile.fileName] = <any>{ js: printer.printFile(sourceFile) };

  return res;
}

export function getTsNodeEmitResult(
  pluginConfig: TsTransformPathsConfig,
  pcl: ts.ParsedCommandLine,
  tsSpecifier: string
) {
  const compiler = tsNode.create({
    transpileOnly: true,
    transformers: {
      before: [tstpTransform(void 0, pluginConfig, <any>{ ts: require(tsSpecifier) })],
    },
    project: pcl.options.configFilePath,
    compiler: tsSpecifier,
    logError: true,
    ignoreDiagnostics: [1144, 1005], // Issues with old TS and type only imports
  });

  const originalRegister = global.process[tsNode.REGISTER_INSTANCE];
  global.process[tsNode.REGISTER_INSTANCE] = compiler;
  try {
    const res: EmittedFiles = {};
    for (const fileName of pcl.fileNames.filter((f) => !/\.d\.ts$/.test(f)))
      res[fileName] = <any>{ js: compiler.compile(fs.readFileSync(fileName, "utf8"), fileName) };

    return res;
  } finally {
    global.process[tsNode.REGISTER_INSTANCE] = originalRegister;
  }
}

// endregion
