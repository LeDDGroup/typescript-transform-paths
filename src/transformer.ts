// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import path from "path";
import ts from "typescript";
import { cast } from "./utils";
import { TsTransformPathsConfig, TsTransformPathsContext, TypeScriptThree, VisitorContext } from "./types";
import { nodeVisitor } from "./visitor";
import { createHarmonyFactory } from "./utils/harmony-factory";
import { Minimatch } from "minimatch";
import { createParsedCommandLineForProgram } from "./utils/ts-helpers";

/* ****************************************************************************************************************** *
 * Transformer
 * ****************************************************************************************************************** */

export default function transformer(
  program: ts.Program,
  config: TsTransformPathsConfig,
  { ts: tsInstance }: { ts: typeof ts }
) {
  if (!tsInstance) tsInstance = ts;

  const compilerOptions = program.getCompilerOptions();
  const rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);

  return (transformationContext: ts.TransformationContext) => {
    const pathsBasePath = compilerOptions.pathsBasePath ?? compilerOptions.baseUrl;

    if (!pathsBasePath || !compilerOptions.paths) return (sourceFile: ts.SourceFile) => sourceFile;

    const { configFile, paths } = compilerOptions;
    // TODO - Remove typecast when tryParsePatterns is recognized (probably after ts v4.4)
    const { tryParsePatterns } = tsInstance as any;

    const tsTransformPathsContext: TsTransformPathsContext = {
      compilerOptions,
      config,
      elisionMap: new Map(),
      tsFactory: transformationContext.factory,
      program,
      rootDirs,
      transformationContext,
      tsInstance,
      pathsBasePath,
      getCanonicalFileName: tsInstance.createGetCanonicalFileName(tsInstance.sys.useCaseSensitiveFileNames),
      tsThreeInstance: cast<TypeScriptThree>(tsInstance),
      excludeMatchers: config.exclude?.map((globPattern) => new Minimatch(globPattern, { matchBase: true })),
      parsedCommandLine: createParsedCommandLineForProgram(tsInstance, program),
      outputFileNamesCache: new Map(),
      // Get paths patterns appropriate for TS compiler version
      pathsPatterns: tryParsePatterns
        // TODO - Remove typecast when pathPatterns is recognized (probably after ts v4.4)
        ? (configFile?.configFileSpecs as any)?.pathPatterns || tryParsePatterns(paths)
        : tsInstance.getOwnKeys(paths)
    };

    return (sourceFile: ts.SourceFile) => {
      const visitorContext: VisitorContext = {
        ...tsTransformPathsContext,
        sourceFile,
        isDeclarationFile: sourceFile.isDeclarationFile,
        originalSourceFile: (<typeof ts>tsInstance).getOriginalSourceFile(sourceFile),
        getVisitor() {
          return nodeVisitor.bind(this);
        },
        factory: createHarmonyFactory(tsTransformPathsContext),
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
}
