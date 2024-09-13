import path from "node:path";
import { default as tstpTransform, TsTransformPathsConfig } from "typescript-transform-paths";
import fs from "node:fs";
import ts from "typescript";
import * as tsNode from "ts-node";
import * as config from "../config";

export type EmittedFiles = { [fileName: string]: { js: string; dts: string } };

export interface CreateTsProgramOptions {
  tsInstance: typeof ts;
  files?: { [fileName: string]: /* data */ string };
  tsConfigFile?: string;
  disablePlugin?: boolean;
  additionalOptions?: ts.CompilerOptions;
  pluginOptions?: TsTransformPathsConfig;
}

export interface CreateTsSolutionBuilderOptions {
  tsInstance: typeof ts;
  projectDir: string;
}

function createWriteFile(outputFiles: EmittedFiles) {
  return (fileName: string, data: string) => {
    let { 1: rootName, 2: ext } = fileName.match(/(.+)\.((d.ts)|(js))$/) ?? [];
    if (!ext) return;
    rootName = `${rootName}.ts`;
    const key = ext.replace(".", "") as keyof EmittedFiles[string];
    outputFiles[rootName] ??= {} as EmittedFiles[string];
    outputFiles[rootName][key] = data;
  };
}

function createReadFile(
  outputFiles: EmittedFiles,
  originalReadFile: (path: string, encoding?: string) => string | undefined,
) {
  return (fileName: string) => {
    let { 1: rootName, 2: ext } = fileName.match(/(.+)\.((d.ts)|(js))$/) ?? [];
    if (ext) {
      rootName = `${rootName}.ts`;
      const key = ext.replace(".", "") as keyof EmittedFiles[string];
      const res = outputFiles[rootName]?.[key];
      if (res) return res;
    }
    return originalReadFile(fileName);
  };
}

/** Create TS Program with faux files and options */
export function createTsProgram(
  opt: CreateTsProgramOptions,
  transformerPath: string = config.transformerPath,
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
    // @ts-expect-error TS(2345) FIXME: Argument of type 'System' is not assignable to parameter of type 'ParseConfigFileHost'.
    const pcl = tsInstance.getParsedCommandLineOfConfigFile(opt.tsConfigFile, extendOptions, tsInstance.sys)!;
    compilerOptions = pcl.options;
    fileNames = pcl.fileNames;
  } else {
    const files = Object.entries(compilerOptions.files!).reduce((p, [fileName, data]) => {
      // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
      p[tsInstance.normalizePath(fileName)] = data;
      return p;
    }, {});
    fileNames = Object.keys(files);

    host = tsInstance.createCompilerHost(compilerOptions);
    compilerOptions = extendOptions;

    /* Patch host to feed mock files */
    const originalGetSourceFile: unknown = host.getSourceFile;
    host.getSourceFile = function (fileName: string, scriptTarget: ts.ScriptTarget, ...rest) {
      if (Object.keys(files).includes(fileName))
        // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
        return tsInstance.createSourceFile(fileName, files[fileName], scriptTarget);
      // @ts-expect-error TS(18046) FIXME: 'originalGetSourceFile' is of type 'unknown'.
      else originalGetSourceFile(fileName, scriptTarget, ...rest);
    };
  }

  return tsInstance.createProgram({ options: compilerOptions, rootNames: fileNames, host });
}

export function createTsSolutionBuilder(
  opt: CreateTsSolutionBuilderOptions,
): ts.SolutionBuilder<ts.BuilderProgram> & { getEmitFiles(): EmittedFiles } {
  const { tsInstance, projectDir } = opt;

  const outputFiles: EmittedFiles = {};

  const host = tsInstance.createSolutionBuilderHost();
  const originalReadFile = host.readFile;
  Object.assign(host, {
    readFile: createReadFile(outputFiles, originalReadFile),
    writeFile: createWriteFile(outputFiles),
  });

  const builder = tsInstance.createSolutionBuilder(host, [projectDir], { force: true });

  return Object.assign(builder, {
    getEmitFiles() {
      builder.build();
      return outputFiles;
    },
  });
}

/** Get emitted files for program */
export function getEmitResultFromProgram(program: ts.Program): EmittedFiles {
  const outputFiles: EmittedFiles = {};
  program.emit(undefined, createWriteFile(outputFiles));
  return outputFiles;
}

export function getManualEmitResult(
  pluginConfig: TsTransformPathsConfig,
  tsInstance: unknown,
  pcl: ts.ParsedCommandLine,
) {
  const { options: compilerOptions, fileNames } = pcl;
  // @ts-expect-error TS(2345) FIXME: Argument of type 'unknown' is not assignable to parameter of type 'TransformerExtras | undefined'.
  const transformer = tstpTransform(void 0, pluginConfig, { ts: tsInstance } as unknown, {
    compilerOptions,
    fileNames,
  });

  // @ts-expect-error TS(18046) FIXME: 'tsInstance' is of type 'unknown'.
  const { transformed } = tsInstance.transform(
    fileNames.map((f) =>
      // @ts-expect-error TS(18046) FIXME: 'tsInstance' is of type 'unknown'.
      tsInstance.createSourceFile(f, fs.readFileSync(f, "utf8"), tsInstance.ScriptTarget.ESNext, true),
    ),
    [transformer],
    compilerOptions,
  );

  // @ts-expect-error TS(18046) FIXME: 'tsInstance' is of type 'unknown'.
  const printer = tsInstance.createPrinter();

  const res: EmittedFiles = {};
  // @ts-expect-error TS(2322) FIXME: Type 'unknown' is not assignable to type '{ js: string; dts: string; }'.
  for (const sourceFile of transformed) res[sourceFile.fileName] = <unknown>{ js: printer.printFile(sourceFile) };

  return res;
}

export function getTsNodeEmitResult(
  pluginConfig: TsTransformPathsConfig,
  pcl: ts.ParsedCommandLine,
  tsSpecifier: string,
) {
  const compiler = tsNode.create({
    transpileOnly: true,
    transformers: {
      // @ts-expect-error TS(2345) FIXME: Argument of type 'unknown' is not assignable to parameter of type 'TransformerExtras | undefined'.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      before: [tstpTransform(void 0, pluginConfig, <unknown>{ ts: require(tsSpecifier) })],
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
    for (const fileName of pcl.fileNames.filter((f) => !/\.d\.ts$/.test(f))) {
      // @ts-expect-error TS(2322) FIXME: Type 'unknown' is not assignable to type '{ js: string; dts: string; }'.
      res[fileName] = <unknown>{ js: compiler.compile(fs.readFileSync(fileName, "utf8"), fileName) };
    }

    return res;
  } finally {
    global.process[tsNode.REGISTER_INSTANCE] = originalRegister;
  }
}

/**
 * @exapmle
 *   const projectDir = ts.normalizePath(path.join(projectsPaths, "project-ref"));
 *   const builder = createTsSolutionBuilder({ tsInstance: ts, projectDir });
 *   const emittedFiles = getRelativeEmittedFiles(projectDir, builder.getEmitFiles());
 */
export function getRelativeEmittedFiles(projectDir: string, pathRecord: EmittedFiles) {
  const result = {} as EmittedFiles;
  for (const key in pathRecord) {
    result[path.relative(projectDir, key)] = pathRecord[key];
  }
  return result;
}
