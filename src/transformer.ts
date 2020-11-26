// noinspection ES6UnusedImports
import {} from "ts-expose-internals";
import path from "path";
import ts from "typescript";
import { cast, getImplicitExtensions } from "./utils";
import { TsTransformPathsConfig, TsTransformPathsContext, TypeScriptThree, VisitorContext } from "./types";
import { nodeVisitor } from "./visitor";

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
  const implicitExtensions = getImplicitExtensions(compilerOptions);
  const rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);

  return (transformationContext: ts.TransformationContext) => {
    const tsTransformPathsContext: TsTransformPathsContext = {
      compilerOptions,
      config,
      elisionMap: new Map(),
      factory: transformationContext.factory,
      implicitExtensions,
      program,
      rootDirs,
      transformationContext,
      tsInstance,
      tsThreeInstance: cast<TypeScriptThree>(tsInstance),
    };

    return (sourceFile: ts.SourceFile) => {
      if (!compilerOptions.baseUrl || !compilerOptions.paths) return sourceFile;

      const visitorContext: VisitorContext = {
        ...tsTransformPathsContext,
        sourceFile,
        isDeclarationFile: sourceFile.isDeclarationFile,
        originalSourceFile: (<typeof ts>tsInstance).getOriginalSourceFile(sourceFile),
        getVisitor() {
          return nodeVisitor.bind(this);
        },
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
}
