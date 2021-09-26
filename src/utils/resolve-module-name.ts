import { VisitorContext } from "../types";
import { isBaseDir, isURL, maybeAddRelativeLocalPrefix } from "./general-utils";
import { Node, Pattern, removeFileExtension, ResolvedModuleFull, SourceFile } from "typescript";
import { getOutputPathDetail, joinPaths, OutputPathDetail } from "./path";
import { getOutputPathForSourceFile } from "./ts-helpers";
import path from "path";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface ResolvedModule {
  resolvedPath?: string;
  outputPath: string;
}

interface GetReturnPathContext {
  visitorContext: VisitorContext
  node: Node
  moduleName: string
  pathDetail?: OutputPathDetail
  resolvedModule?: ResolvedModuleFull
  resolvedSourceFile?: SourceFile
  outputPath: string | (string | undefined)[]
}

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function getResolvedSourceFile(context: VisitorContext, fileName: string): SourceFile {
  let res: SourceFile | undefined;
  const { program, tsInstance } = context;

  if (program) {
    /* Attempt to directly pull from Program */
    res = program.getSourceFile(fileName) as SourceFile;
    if (res) return res;

    /* Attempt to find without extension */
    res = (program.getSourceFiles() as SourceFile[]).find(
      (s) => removeFileExtension(s.fileName) === removeFileExtension(fileName)
    );
    if (res) return res;
  }

  /*
   * Create basic synthetic SourceFile for use with compiler API - Applies if SourceFile not found in program due to
   * import being added by another transformer
   */
  return tsInstance.createSourceFile(fileName, ``, tsInstance.ScriptTarget.ESNext, /* setParentNodes */ false);
}

function getReturnPath(ctx: GetReturnPathContext) {
  const { pathDetail, outputPath } = ctx;
  const { outputMode } = ctx.visitorContext;
  const {
    resolvedExt,
    suppliedExt,
    resolvedPath,
    isImplicitExtension,
    implicitPath,
  } = ctx.pathDetail ?? {};

  const isEsm = outputMode === "esm";
  const paths = [ outputPath ].flat();

  let res = joinPaths(...paths);
  if (!res)
    throw new Error(`Could not resolve path! Please file an issue!\nDetail: ${JSON.stringify(pathDetail, null,2)}`);

  if (pathDetail) {
    const ext = isEsm ? resolvedExt : isImplicitExtension ? void 0 : suppliedExt;
    const implicit = isEsm ? implicitPath : void 0;
    if (ext) res = joinPaths(res, implicit, ext);
  }

  return { resolvedPath: resolvedPath, outputPath: res };
}

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

/**
 * Resolve a module name
 * @internal — Uses internal TS type
 */
export function resolveModuleName(
  context: VisitorContext,
  node: Node,
  moduleName: string,
  pathMatch: string | Pattern | undefined
): ResolvedModule | undefined {
  const { tsInstance, compilerOptions, sourceFile, config, rootDirs } = context;

  // Attempt to resolve with TS Compiler API
  const { resolvedModule, failedLookupLocations } = tsInstance.resolveModuleName(
    moduleName,
    sourceFile.fileName,
    compilerOptions,
    tsInstance.sys
  );

  // Handle non-resolvable module
  if (!resolvedModule) {
    const maybeURL = failedLookupLocations[0];
    const pathIsUrl = isURL(maybeURL);

    if (pathIsUrl && !context.resolver) return void 0;
    return getReturnPath({
      moduleName,
      visitorContext: context,
      node,
      outputPath: pathIsUrl ? maybeURL : moduleName
    });
  }

  const resolvedSourceFile = getResolvedSourceFile(context, resolvedModule.resolvedFileName);
  const pathDetail = getOutputPathDetail(moduleName, resolvedModule, pathMatch);

  const { isExternalLibraryImport } = pathDetail;

  // External packages without a path match hit do not require path relativization
  if (isExternalLibraryImport && !pathMatch) {
    const { suppliedPackageName, outputPath } = pathDetail;
    return getReturnPath({
      moduleName,
      node,
      visitorContext: context,
      resolvedModule,
      resolvedSourceFile,
      pathDetail,
      outputPath: [ suppliedPackageName, outputPath ]
    });
  }

  /* Determine output dirs */
  let srcFileOutputDir = path.dirname(getOutputPathForSourceFile(context, sourceFile));
  let moduleFileOutputDir = path.dirname(
    resolvedModule.packageId ? pathDetail.outputPath! : getOutputPathForSourceFile(context, resolvedSourceFile)
  );

  // Handle rootDirs remapping
  if (config.useRootDirs && rootDirs) {
    let fileRootDir = "";
    let moduleRootDir = "";
    for (const rootDir of rootDirs) {
      if (isBaseDir(rootDir, moduleFileOutputDir) && rootDir.length > moduleRootDir.length) moduleRootDir = rootDir;
      if (isBaseDir(rootDir, srcFileOutputDir) && rootDir.length > fileRootDir.length) fileRootDir = rootDir;
    }

    /* Remove base dirs to make relative to root */
    if (fileRootDir && moduleRootDir) {
      srcFileOutputDir = path.relative(fileRootDir, srcFileOutputDir);
      moduleFileOutputDir = path.relative(moduleRootDir, moduleFileOutputDir);
    }
  }

  const outputDir = path.relative(srcFileOutputDir, moduleFileOutputDir);

  /* Compose final output path */
  const outputBaseName = pathDetail.implicitPath ? void 0 : path.basename(pathDetail.resolvedPath, pathDetail.resolvedExt);
  const outputPath = maybeAddRelativeLocalPrefix(joinPaths(outputDir, outputBaseName));

  return getReturnPath({
    moduleName,
    node,
    visitorContext: context,
    resolvedModule,
    resolvedSourceFile,
    pathDetail,
    outputPath
  });
}

// endregion
