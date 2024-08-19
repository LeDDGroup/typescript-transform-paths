import { VisitorContext } from "../types";
import { isBaseDir, isURL, maybeAddRelativeLocalPrefix } from "./general-utils";
import * as path from "path";
import { removeFileExtension, removeSuffix, ResolvedModuleFull, SourceFile } from "typescript";
import { getOutputDirForSourceFile } from "./ts-helpers";
import { getRelativePath } from "./get-relative-path";

export interface ResolvedModule {
  /** Absolute path to resolved module */
  resolvedPath: string | undefined;
  /** Output path */
  outputPath: string;
  /** Resolved to URL */
  isURL: boolean;
}

enum IndexType {
  NonIndex,
  Explicit,
  Implicit,
  ImplicitPackage,
}

function getPathDetail(moduleName: string, resolvedModule: ResolvedModuleFull) {
  const resolvedFileName = resolvedModule.originalPath ?? resolvedModule.resolvedFileName;
  const implicitPackageIndex = resolvedModule.packageId?.subModuleName;

  const resolvedDir = implicitPackageIndex
    ? removeSuffix(resolvedFileName, `/${implicitPackageIndex}`)
    : path.dirname(resolvedFileName);
  const resolvedBaseName = implicitPackageIndex ? void 0 : path.basename(resolvedFileName);
  const resolvedBaseNameNoExtension = resolvedBaseName && removeFileExtension(resolvedBaseName);
  const resolvedExtName = resolvedBaseName && path.extname(resolvedFileName);

  let baseName = !implicitPackageIndex ? path.basename(moduleName) : void 0;
  let baseNameNoExtension = baseName && removeFileExtension(baseName);
  let extName = baseName && path.extname(moduleName);

  // Account for possible false extensions. Example scenario:
  //   moduleName = './file.accounting'
  //   resolvedBaseName = 'file.accounting.ts'
  // ('accounting' would be considered the extension)
  if (resolvedBaseNameNoExtension && baseName && resolvedBaseNameNoExtension === baseName) {
    baseNameNoExtension = baseName;
    extName = void 0;
  }

  // prettier-ignore
  const indexType =
    implicitPackageIndex ? IndexType.ImplicitPackage :
      baseNameNoExtension === 'index' && resolvedBaseNameNoExtension === 'index' ? IndexType.Explicit :
        baseNameNoExtension !== 'index' && resolvedBaseNameNoExtension === 'index' ? IndexType.Implicit :
          IndexType.NonIndex;

  if (indexType === IndexType.Implicit) {
    baseName = void 0;
    baseNameNoExtension = void 0;
    extName = void 0;
  }

  return {
    baseName,
    baseNameNoExtension,
    extName,
    resolvedBaseName,
    resolvedBaseNameNoExtension,
    resolvedExtName,
    resolvedDir,
    indexType,
    implicitPackageIndex,
    resolvedFileName,
  };
}

function getResolvedSourceFile(context: VisitorContext, fileName: string): SourceFile {
  let res: SourceFile | undefined;
  const { program, tsInstance } = context;

  if (program) {
    /* Attempt to directly pull from Program */
    res = program.getSourceFile(fileName) as SourceFile;
    if (res) return res;

    /* Attempt to find without extension */
    res = (program.getSourceFiles() as SourceFile[]).find(
      (s) => removeFileExtension(s.fileName) === removeFileExtension(fileName),
    );
    if (res) return res;
  }

  /*
   * Create basic synthetic SourceFile for use with compiler API - Applies if SourceFile not found in program due to
   * import being added by another transformer
   */
  return tsInstance.createSourceFile(fileName, ``, tsInstance.ScriptTarget.ESNext, /* setParentNodes */ false);
}

/** Resolve a module name */
export function resolveModuleName(context: VisitorContext, moduleName: string): ResolvedModule | undefined {
  const { tsInstance, compilerOptions, sourceFile, config, rootDirs } = context;

  // Attempt to resolve with TS Compiler API
  const { resolvedModule, failedLookupLocations } = tsInstance.resolveModuleName(
    moduleName,
    sourceFile.fileName,
    compilerOptions,
    tsInstance.sys,
  );

  // Handle non-resolvable module
  if (!resolvedModule) {
    const maybeURL = failedLookupLocations[0];
    if (!isURL(maybeURL)) return undefined;
    return {
      isURL: true,
      resolvedPath: undefined,
      outputPath: maybeURL,
    };
  }

  const resolvedSourceFile = getResolvedSourceFile(context, resolvedModule.resolvedFileName);

  const { indexType, resolvedBaseNameNoExtension, resolvedFileName, implicitPackageIndex, extName, resolvedDir } =
    getPathDetail(moduleName, resolvedModule);

  /* Determine output filename */
  let outputBaseName = resolvedBaseNameNoExtension ?? "";

  if (indexType === IndexType.Implicit) outputBaseName = outputBaseName.replace(/(\/index$)|(^index$)/, "");
  if (outputBaseName && extName) outputBaseName = `${outputBaseName}${extName}`;

  /* Determine output dir */
  let srcFileOutputDir = getOutputDirForSourceFile(context, sourceFile);
  let moduleFileOutputDir = implicitPackageIndex ? resolvedDir : getOutputDirForSourceFile(context, resolvedSourceFile);

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
      srcFileOutputDir = getRelativePath(fileRootDir, srcFileOutputDir);
      moduleFileOutputDir = getRelativePath(moduleRootDir, moduleFileOutputDir);
    }
  }

  const outputDir = getRelativePath(srcFileOutputDir, moduleFileOutputDir);

  /* Compose final output path */
  const outputPath = maybeAddRelativeLocalPrefix(tsInstance.normalizePath(path.join(outputDir, outputBaseName)));

  return { isURL: false, outputPath, resolvedPath: resolvedFileName };
}
