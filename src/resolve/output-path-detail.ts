import { Pattern, ResolvedModuleFull } from "typescript";
import { baseName, extName, joinPaths, normalizeSlashes, removeSuffix } from "../utils";
import { VisitorContext } from "../types";
import { IndexDetail } from "./index-checker";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface OutputPathDetail {
  isImplicitExtension: boolean;
  isExternalLibraryImport: boolean;
  resolvedExt: string | undefined;
  resolvedPath: string;
  suppliedExt: string | undefined;
  /** Package name from package.json */
  packageName?: string;
  /** Package name as written (could differ due to npm aliasing) */
  suppliedPackageName?: string;
  suppliedPackagePath?: string;
  packageRoot?: string;
  packageFileName?: string;
  tsPathsKey?: string;
  indexDetail: IndexDetail
}

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

const pkgRegex = /^((?:@[^/]+\/)?[^/@]+)(?:\/([^@]+?))?$/;

function getSuppliedPackageInfo(moduleName: string | undefined) {
  if (!moduleName) return void 0;
  const { 1: suppliedPackageName, 2: suppliedPackagePath } = pkgRegex.exec(moduleName)!;
  return { suppliedPackageName, suppliedPackagePath };
}

function getTsPathMatch(match: string | Pattern): string {
  return typeof match === 'string' ? match : [match.prefix, match.suffix].join('*');
}

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

/** @internal — Uses internal TS type */
export function getOutputPathDetail(
  context: VisitorContext,
  moduleName: string,
  resolvedModule: ResolvedModuleFull,
  pathMatch: string | Pattern | undefined
): OutputPathDetail {
  const { indexChecker } = context;

  /* Get paths */
  moduleName = normalizeSlashes(moduleName, { removeTrailingSlash: true });
  let suppliedExtName = extName(moduleName);
  let suppliedBaseName = baseName(moduleName);
  let suppliedBaseNameNoExt = removeSuffix(suppliedBaseName, suppliedExtName);

  const resolvedFileName = resolvedModule.originalPath ?? resolvedModule.resolvedFileName;
  const resolvedExtName = extName(resolvedFileName);
  const resolvedBaseName = baseName(resolvedFileName);
  const resolvedBaseNameNoExt = removeSuffix(resolvedBaseName, resolvedExtName);

  const { isExternalLibraryImport, packageId } = resolvedModule;
  const packageName = packageId?.name;
  const packageRoot = packageId && indexChecker.getPackageIndexInfo(resolvedFileName)!.packageDir;
  const packageFileName = packageId && joinPaths(packageRoot, packageId.subModuleName);
  const packageExtName = packageFileName && extName(packageFileName);
  const packageBaseName = packageFileName && baseName(packageFileName);
  const packageBaseNameNoExt = packageBaseName && removeSuffix(packageBaseName, packageExtName!);

  const effectiveFileName = packageFileName || resolvedFileName;
  const effectiveBaseNameNoExt = packageBaseNameNoExt || resolvedBaseNameNoExt;
  const effectiveExtName = packageExtName || resolvedExtName;

  // Detect and fix invalid extname due to implicit ext (ie. `file.accounting.ts` could decide `accounting` is the extension)
  if (suppliedExtName && effectiveBaseNameNoExt && effectiveBaseNameNoExt === suppliedBaseName) {
    suppliedBaseNameNoExt = suppliedBaseName;
    suppliedExtName = '';
  }

  /* Get Extras */
  const isImplicitExtension = !suppliedExtName && !!effectiveExtName;

  let suppliedPackageName: string | undefined;
  let suppliedPackagePath: string | undefined;
  if (packageName) {
    const pkgInfo = getSuppliedPackageInfo(moduleName);
    suppliedPackageName = pkgInfo?.suppliedPackageName;
    suppliedPackagePath = pkgInfo?.suppliedPackagePath;
  }

  const tsPathsKey = pathMatch && getTsPathMatch(pathMatch);

  /* Get IndexDetail */
  const indexDetail = packageId
    ? indexChecker.checkPackageFile(effectiveFileName, pathMatch, moduleName, suppliedPackageName, suppliedPackagePath)
    : indexChecker.checkBaseName(effectiveBaseNameNoExt, effectiveExtName, suppliedBaseNameNoExt);

  return {
    isImplicitExtension,
    isExternalLibraryImport: !!isExternalLibraryImport,
    resolvedExt: effectiveExtName,
    suppliedExt: suppliedExtName,
    resolvedPath: effectiveFileName,
    tsPathsKey,
    packageRoot,
    packageName,
    suppliedPackagePath,
    suppliedPackageName,
    packageFileName,
    indexDetail
  };
}

// endregion
