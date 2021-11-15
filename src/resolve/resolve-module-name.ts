import { ResolutionContext, VisitorContext } from '../types';
import {
  baseName,
  dirName,
  isBaseDir,
  isURL,
  joinPaths,
  maybeAddRelativeLocalPrefix,
  normalizeSlashes,
  relativePath,
  removeSuffix,
} from '../utils';
import { Node, Pattern, removeFileExtension, ResolvedModuleFull, SourceFile } from 'typescript';
import { getOutputPathForSourceFile, getOutputExtension } from '../ts';
import { getOutputPathDetail, OutputPathDetail } from './output-path-detail';
import { IndexFlags } from './index-checker';

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface ResolvedModule {
  fullResolvedPath?: string;
  outputPath: string;
}

interface GetReturnPathContext {
  visitorContext: VisitorContext;
  node: Node;
  moduleName: string;
  pathDetail?: OutputPathDetail;
  resolvedModule?: ResolvedModuleFull;
  resolvedSourceFile?: SourceFile;
  isURL?: boolean;
  outputPath: string;
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
  const { pathDetail, resolvedSourceFile } = ctx;
  const {
    resolver,
    config: { outputExtensions, outputIndexes },
    compilerOptions,
    tsInstance,
    isDeclarationFile,
  } = ctx.visitorContext;
  const { suppliedExt, resolvedPath, isImplicitExtension, indexDetail, isExternalLibraryImport } = ctx.pathDetail ?? {};

  let res = ctx.outputPath;

  let outputExt: string | undefined;
  if (pathDetail) {
    outputExt =
      !isImplicitExtension && outputExtensions !== 'never'
        ? suppliedExt
        : outputExtensions === 'always'
        ? getOutputExtension(tsInstance, compilerOptions, resolvedSourceFile!, isDeclarationFile)
        : void 0;

    let usesStrippedIndex = false;
    if (indexDetail && indexDetail.flags & ~IndexFlags.None)
      if (
        (indexDetail.flags & IndexFlags.Implicit && outputIndexes !== 'always') ||
        (indexDetail.flags & ~IndexFlags.Implicit && outputIndexes === 'never')
      ) {
        const indexPath = isExternalLibraryImport
          ? removeFileExtension(indexDetail.indexPath!)
          : normalizeSlashes(removeFileExtension(indexDetail.indexPath!), { removeTrailingSlash: true });
        res = normalizeSlashes(removeSuffix(res, indexPath), { removeTrailingSlash: true });
        usesStrippedIndex = true;
      }

    if (!usesStrippedIndex) res += outputExt ?? '';
  }

  if (resolver) {
    const { moduleName, node, visitorContext, isURL, resolvedModule } = ctx;
    const { resolvedFileName, originalPath } = resolvedModule ?? {};
    const { packageName, suppliedPackageName, tsPathsKey, packageFileName, isExternalLibraryImport } =
      ctx.pathDetail ?? {};

    const resolutionContext: ResolutionContext = {
      moduleExtName: suppliedExt,
      moduleName,
      tsPathsKey,
      isURL: !!isURL,
      ...(packageName && {
        package: {
          packageName,
          originalPackageName: suppliedPackageName,
          isExternalLibrary: isExternalLibraryImport!,
        },
      }),
      ...(pathDetail && {
        target: {
          indexDetail: indexDetail!,
          packagePath: packageFileName,
          resolvedFilePath: resolvedFileName!,
          originalPath,
          sourceFile: resolvedSourceFile,
        },
      }),
      outputPath: res,
      outputExt,
      node,
      visitorContext,
    };

    const resolverRes = resolver(resolutionContext);
    return !resolverRes ? void 0 : { outputPath: resolverRes };
  }

  return { fullResolvedPath: resolvedPath, outputPath: res };
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
  const { removeFileExtension } = tsInstance;

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

    if (pathIsUrl && !context.resolver) return { outputPath: maybeURL };
    return getReturnPath({
      moduleName,
      visitorContext: context,
      node,
      isURL: pathIsUrl,
      outputPath: pathIsUrl ? maybeURL : moduleName,
    });
  }

  const resolvedSourceFile = getResolvedSourceFile(context, resolvedModule.resolvedFileName);
  const pathDetail = getOutputPathDetail(context, moduleName, resolvedModule, pathMatch);

  const { isExternalLibraryImport, resolvedPath, resolvedExt } = pathDetail;

  // External packages without a paths match should be be relative to package specifier
  if (isExternalLibraryImport && !pathMatch) {
    const { suppliedPackageName, suppliedPackagePath, indexDetail } = pathDetail;

    let outputPath = joinPaths(suppliedPackageName, suppliedPackagePath && removeFileExtension(suppliedPackagePath));
    if (indexDetail.flags & IndexFlags.Implicit)
      outputPath = joinPaths(outputPath, removeFileExtension(indexDetail.indexPath!));

    return getReturnPath({
      moduleName,
      node,
      visitorContext: context,
      resolvedModule,
      resolvedSourceFile,
      pathDetail,
      outputPath,
    });
  }

  /* Determine output dirs */
  let srcFileOutputDir = dirName(getOutputPathForSourceFile(context, sourceFile));
  let moduleFileOutputDir = dirName(getOutputPathForSourceFile(context, resolvedSourceFile));

  // Handle rootDirs remapping
  if (config.useRootDirs && rootDirs) {
    let fileRootDir = '';
    let moduleRootDir = '';
    for (const rootDir of rootDirs) {
      if (isBaseDir(rootDir, moduleFileOutputDir) && rootDir.length > moduleRootDir.length) moduleRootDir = rootDir;
      if (isBaseDir(rootDir, srcFileOutputDir) && rootDir.length > fileRootDir.length) fileRootDir = rootDir;
    }

    /* Remove base dirs to make relative to root */
    if (fileRootDir && moduleRootDir) {
      srcFileOutputDir = relativePath(fileRootDir, srcFileOutputDir);
      moduleFileOutputDir = relativePath(moduleRootDir, moduleFileOutputDir);
    }
  }

  const outputDir = relativePath(srcFileOutputDir, moduleFileOutputDir);
  const outputPath = maybeAddRelativeLocalPrefix(joinPaths(outputDir, baseName(resolvedPath, resolvedExt)));

  return getReturnPath({
    moduleName,
    node,
    visitorContext: context,
    resolvedModule,
    resolvedSourceFile,
    pathDetail,
    outputPath,
  });
}

// endregion
