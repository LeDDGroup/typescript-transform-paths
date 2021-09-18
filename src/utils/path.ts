// noinspection JSUnusedLocalSymbols,JSUnusedAssignment

import path from "path";
import { normalizePath, Pattern, removePrefix, removeSuffix, ResolvedModuleFull } from "typescript";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface OutputPathDetail {
  isImplicitExtension: boolean
  isExternalLibraryImport: boolean
  resolvedExt: string | undefined;
  resolvedPath: string;
  outputPath: string | undefined;
  suppliedExt: string | undefined;
  implicitPath?: string;
  /** Package name from package.json */
  packageName?: string;
  /** Package name as written (could differ due to npm aliasing) */
  suppliedPackageName?: string
  suppliedPackagePath?: string
  packagePath?: string;
  tsPathMatch?: string;
}

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

const pkgRegex = /^((@[^/]+\/[^/@]+)|([^@/]+))(?:\/([^@]+?))?$/;

/** @internal */
function getPaths(supplied: string, resolved: string) {
  let endMatchPos = 0;
  for (let i = 0; i < supplied.length && i < resolved.length; i++) {
    if (supplied[i] !== resolved[i]) {
      endMatchPos = i;
      break;
    }
  }

  const outputPath = supplied.slice(0, endMatchPos);
  const implicitPath = resolved.slice(endMatchPos);

  return { outputPath, implicitPath };
}

function getPackagePaths(moduleName: string, suppliedExt: string, subModule: string) {
  const { 1: suppliedPackageName, 2: suppliedPackagePath } = pkgRegex.exec(moduleName)!;

  const packagePathNoExt = fixupPartialPath(suppliedPackagePath, suppliedExt);

  if (!subModule) return { outputPath: packagePathNoExt };

  const subModuleNoExt = fixupPartialPath(subModule, path.extname(subModule));

  return {
    ...getPaths(packagePathNoExt, subModuleNoExt),
    suppliedPackageName,
    suppliedPackagePath
  };
}

function getModulePaths(
  moduleName: string,
  suppliedExt: string,
  resolvedFileName: string,
  resolvedExt: string,
  tsPathMatch: string | Pattern | undefined
) {
  // In this case, the file ending is a fixed path, so no further information needs to be determined
  if (typeof tsPathMatch === "string" || tsPathMatch?.suffix) return { outputPath: void 0 };

  const resolvedFileNameNoExt = fixupPartialPath(resolvedFileName, resolvedExt);
  const modulePathNoExt = tsPathMatch?.prefix
    ? fixupPartialPath(removePrefix(moduleName, tsPathMatch?.prefix), suppliedExt)
    : fixupPath(moduleName, suppliedExt);

  return getPaths(modulePathNoExt, resolvedFileNameNoExt);
}

function getTsPathMatch(match: string | Pattern): string {
  return typeof match === "string" ? match : [match.prefix, match.suffix].join("*");
}

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export function joinPaths(...paths: (string | undefined)[]): string {
  return normalizePath(path.join('', ...paths.filter(p => typeof p === 'string') as string[]));
}

/**
 * Remove leading or trailing slashes
 * @p path to fix
 * @extName extname to remove
 */
export function fixupPartialPath(p: string, extName?: string): string {
  p = p.replace(/^[/\\]*(.+?)[/\\]*$/g, "$1");
  if (extName && p.slice(-extName.length) === extName) p = p.slice(0, p.length - extName.length);
  return p;
}

/**
 * Remove trailing slashes
 * @p path to fix
 * @extName extname to remove
 */
export function fixupPath(p: string, extName?: string): string {
  p = p.replace(/^(.+?)[/\\]*$/g, "$1");
  if (extName && p.slice(-extName.length) === extName) p = p.slice(0, p.length - extName.length);
  return p;
}

/** @internal — Uses internal TS type */
export function getOutputPathDetail(
  moduleName: string,
  resolvedModule: ResolvedModuleFull,
  pathMatch: string | Pattern | undefined
): OutputPathDetail {
  moduleName = fixupPath(moduleName);
  let suppliedExtName = path.extname(moduleName);
  const suppliedBaseName = path.basename(moduleName);
  let suppliedBaseNameNoExt = path.basename(moduleName, suppliedExtName);

  const resolvedFileName = resolvedModule.originalPath ?? resolvedModule.resolvedFileName;
  const resolvedExtName = path.extname(resolvedFileName);
  const resolvedFileNameNoExt = removeSuffix(resolvedFileName, resolvedExtName);
  const resolvedBaseName = path.basename(resolvedFileName);
  const resolvedBaseNameNoExt = path.basename(resolvedFileName, suppliedExtName);

  const tsPathMatch = pathMatch && getTsPathMatch(pathMatch);

  const { isExternalLibraryImport, packageId } = resolvedModule;
  const packageName = packageId?.name;
  const packageFileName = packageId && fixupPartialPath(packageId.subModuleName);
  const packageExtName = packageFileName && path.extname(packageFileName);
  const packageFileNameNoExt = packageFileName && removeSuffix(packageFileName, resolvedExtName);
  const packageBaseName = packageFileName && path.basename(packageFileName);
  const packageBaseNameNoExt = packageFileName && path.basename(packageFileName, packageExtName);

  const effectiveResolvedFileName = packageFileNameNoExt || resolvedFileNameNoExt;
  const effectiveResolvedBaseName = packageBaseName || resolvedBaseName;
  const effectiveResolvedBaseNameNoExt = packageBaseNameNoExt || resolvedBaseNameNoExt;
  const effectiveResolvedExtName = packageExtName || resolvedExtName;

  // Detect and fix invalid extname due to implicit ext (ie. `file.accounting.ts` could decide `accounting` is the extension)
  if (suppliedExtName && effectiveResolvedBaseNameNoExt && suppliedBaseName && effectiveResolvedBaseNameNoExt === suppliedBaseName) {
    suppliedBaseNameNoExt = suppliedBaseName;
    suppliedExtName = "";
  }

  const isImplicitExtension = !suppliedExtName;

  const pathDetail = resolvedModule.isExternalLibraryImport
    ? getPackagePaths(moduleName, suppliedExtName, packageId!.subModuleName)
    : getModulePaths(moduleName, suppliedExtName, resolvedFileName, resolvedExtName, tsPathMatch);

  return {
    isImplicitExtension,
    isExternalLibraryImport: !!isExternalLibraryImport,
    resolvedExt: effectiveResolvedExtName,
    suppliedExt: suppliedExtName,
    resolvedPath: effectiveResolvedFileName,
    tsPathMatch,
    packageName,
    packagePath: packageFileName,
    ...pathDetail,
  };
}

// endregion
