import { default as tstpTransform, TransformerOptions } from 'typescript-transform-paths';
import fs from 'fs';
import type * as TS from 'typescript';
import type { CompilerOptions, ParsedCommandLine, Program, SourceFile } from 'typescript';
import * as tsNode from 'ts-node';

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export type EmittedFiles = {
  [fileName: string]: { js: string; dts?: string; js_src?: SourceFile; dts_src?: SourceFile };
};

export interface CreateTsProgramOptions {
  tsInstance: typeof TS;
  tsConfigFile: string;
  disablePlugin?: boolean;
  additionalOptions?: CompilerOptions;
  pluginOptions?: TransformerOptions;
}

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function createWriteFile(ts: typeof TS, outputFiles: EmittedFiles) {
  return (fileName: string, data: string) => {
    let { 1: rootName, 2: ext } = fileName.match(/(.+)\.((d.ts)|(js))$/) ?? [];
    if (!ext) return;
    rootName = `${rootName}.ts`;
    const key = ext.replace('.', '') as 'js' | 'dts';
    if (!outputFiles[rootName]) outputFiles[rootName] = <any>{};
    outputFiles[rootName][key] = data;
    (<any>outputFiles[rootName])[key + '_src'] = ts.createSourceFile(fileName, data, ts.ScriptTarget!.ESNext);
  };
}

function createReadFile(outputFiles: EmittedFiles, originalReadFile: Function) {
  return (fileName: string) => {
    let { 1: rootName, 2: ext } = fileName.match(/(.+)\.((d.ts)|(js))$/) ?? [];
    if (ext) {
      rootName = `${rootName}.ts`;
      const key = ext.replace('.', '') as keyof EmittedFiles[string];
      const res = outputFiles[rootName]?.[key];
      if (res) return res;
    }
    return originalReadFile(fileName);
  };
}

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Create TS Program with faux files and options
 */
export function createTsProgram(opt: CreateTsProgramOptions): Program {
  const { disablePlugin, additionalOptions, pluginOptions } = opt;
  const ts: typeof TS = opt.tsInstance;

  const extendOptions = Object.assign({}, additionalOptions, <CompilerOptions>{
    outDir: undefined,
    noEmit: false,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    types: ['@types/underscore-test'],
    typeRoots: [],
    target: ts.ScriptTarget.ESNext,
    plugins: disablePlugin
      ? []
      : <any>[
          { transform: 'typescript-transform-paths', ...pluginOptions },
          {
            transform: 'typescript-transform-paths',
            afterDeclarations: true,
            ...pluginOptions,
          },
        ],
  });

  let compilerOptions: CompilerOptions;
  let fileNames: string[];

  const pcl = ts.getParsedCommandLineOfConfigFile(opt.tsConfigFile, extendOptions, <any>ts.sys)!;
  compilerOptions = pcl.options;
  fileNames = pcl.fileNames;

  return ts.createProgram({ options: compilerOptions, rootNames: fileNames });
}

export function createTsSolutionBuilder(
  ts: typeof TS,
  projectDir: string,
  getTransformers?: (program: TS.Program) => TS.CustomTransformers
) {
  // It is annoying to have to do this, but I don't know of any other way to get the program, which is necessary to
  // create a TypeChecker instance in the walker
  const originalCreateProgram = ts.createProgram as any;
  ts.createProgram = function () {
    const program = originalCreateProgram(...arguments) as Program;
    const transformers = getTransformers?.(program);

    if (transformers) {
      const originalEmit = program.emit;
      program.emit = (
        targetSourceFile?: TS.SourceFile,
        writeFile?: TS.WriteFileCallback,
        cancellationToken?: TS.CancellationToken,
        emitOnlyDtsFiles?: boolean,
        customTransformers?: TS.CustomTransformers
      ): TS.EmitResult => {
        customTransformers = {
          before: [...(customTransformers?.before ?? []), ...(transformers.before ?? [])],
          after: [...(customTransformers?.after ?? []), ...(transformers.after ?? [])],
          afterDeclarations: [
            ...(customTransformers?.afterDeclarations ?? []),
            ...(transformers.afterDeclarations ?? []),
          ],
        };

        return originalEmit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
      };
    }

    return program;
  };

  const host = ts.createSolutionBuilderHost();

  host.createDirectory = () => {};

  const virtualFiles = new Map<string, string>();
  const originalReadFile = host.readFile;
  host.readFile = (p: string, enc: any) => virtualFiles.get(p) ?? originalReadFile(p, enc);
  host.writeFile = (p: string, data: string) => virtualFiles.set(p, data);

  return Object.assign(ts.createSolutionBuilder(host, [projectDir], { force: true }), {
    restoreTs: () => {
      ts.createProgram = originalCreateProgram;
    },
  });
}

/**
 * Get emitted files for program
 */
export function getEmitResultFromProgram(tsInstance: typeof TS, program: Program): EmittedFiles {
  const outputFiles: EmittedFiles = {};
  program.emit(undefined, createWriteFile(tsInstance, outputFiles));
  return outputFiles;
}

export function getManualEmitResult(
  pluginConfig: TransformerOptions,
  tsInstance: any,
  pcl: ParsedCommandLine,
  disablePlugin?: boolean
) {
  const { options: compilerOptions, fileNames } = pcl;
  const transformer = disablePlugin
    ? () => (s: TS.SourceFile) => s
    : tstpTransform(void 0, pluginConfig, { ts: tsInstance } as any, { compilerOptions, fileNames });

  const { transformed } = tsInstance.transform(
    fileNames.map((f) =>
      tsInstance.createSourceFile(f, fs.readFileSync(f, 'utf8'), tsInstance.ScriptTarget.ESNext, true)
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
  pluginConfig: TransformerOptions,
  pcl: ParsedCommandLine,
  tsSpecifier: string,
  disablePlugin?: boolean
) {
  const transformers = disablePlugin
    ? void 0
    : { before: [tstpTransform(void 0, pluginConfig, <any>{ ts: require(tsSpecifier) })] };

  const compiler = tsNode.create({
    transpileOnly: true,
    transformers,
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
      res[fileName] = <any>{
        js: compiler.compile(fs.readFileSync(fileName, 'utf8'), fileName).replace(/\/\/# sourceMappingURL.+$/g, ''),
      };

    return res;
  } finally {
    global.process[tsNode.REGISTER_INSTANCE] = originalRegister;
  }
}

// endregion
