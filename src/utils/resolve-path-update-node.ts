import ts from "typescript";
import tsThree from "../declarations/typescript3";
import path from "path";
import { VisitorContext } from "../types";
import { isBaseDir, isURL } from "./general-utils";
import { upSampleTsType } from "./ts-type-conversion";

/* ****************************************************************************************************************** *
 * Node Updater
 * ****************************************************************************************************************** */

/**
 * Gets proper path and calls updaterFn to get the new node if it should be updated
 */
export function resolvePathAndUpdateNode(
  context: VisitorContext,
  node: ts.Node,
  moduleName: string,
  updaterFn: (newPath: ts.StringLiteral) => ts.Node | tsThree.Node | undefined
): ts.Node | undefined {
  const {
    sourceFile,
    compilerOptions,
    tsInstance,
    config,
    rootDirs,
    implicitExtensions,
    factory,
    tsThreeInstance,
  } = context;
  let outputPath: string;

  /* Have Compiler API attempt to resolve */
  const { resolvedModule, failedLookupLocations } = tsInstance.resolveModuleName(
    moduleName,
    sourceFile.fileName,
    compilerOptions,
    tsInstance.sys
  );

  if (resolvedModule?.isExternalLibraryImport) return node;

  if (!resolvedModule) {
    const maybeURL = failedLookupLocations[0];
    if (!isURL(maybeURL)) return node;
    outputPath = maybeURL;
  } else {
    const { extension, resolvedFileName } = resolvedModule;

    const fileName = sourceFile.fileName;
    let filePath = tsInstance.normalizePath(path.dirname(sourceFile.fileName));
    let modulePath = path.dirname(resolvedFileName);

    /* Handle rootDirs mapping */
    if (config.useRootDirs && rootDirs) {
      let fileRootDir = "";
      let moduleRootDir = "";
      for (const rootDir of rootDirs) {
        if (isBaseDir(rootDir, resolvedFileName) && rootDir.length > moduleRootDir.length) moduleRootDir = rootDir;
        if (isBaseDir(rootDir, fileName) && rootDir.length > fileRootDir.length) fileRootDir = rootDir;
      }

      /* Remove base dirs to make relative to root */
      if (fileRootDir && moduleRootDir) {
        filePath = path.relative(fileRootDir, filePath);
        modulePath = path.relative(moduleRootDir, modulePath);
      }
    }

    /* Remove extension if implicit */
    outputPath = tsInstance.normalizePath(
      path.join(path.relative(filePath, modulePath), path.basename(resolvedFileName))
    );
    if (extension && implicitExtensions.includes(extension)) outputPath = outputPath.slice(0, -extension.length);
    if (!outputPath) return node;

    outputPath = outputPath[0] === "." ? outputPath : `./${outputPath}`;
  }

  const newStringLiteral = factory
    ? factory.createStringLiteral(outputPath)
    : upSampleTsType(tsThreeInstance.createStringLiteral(outputPath));

  return updaterFn(newStringLiteral) as ts.Node | undefined;
}
