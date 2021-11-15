import type TS from 'typescript';
import fs from 'fs';
import { isImplicitExtension, stripImplicitExtension } from './extensions';
import { dirName, normalizePath, relativePath, resolvePath } from '../utils';

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface IndexDetail {
  flags: IndexFlags;
  indexPath?: string;
}

export enum IndexFlags {
  None,
  Implicit = 1 << 0,
  Package = 1 << 1,
  Node = 1 << 2,
}

type PackageIndexInfo = { packageIndex: string; packageDir: string };

// endregion

/* ****************************************************************************************************************** *
 * IndexChecker (class)
 * ****************************************************************************************************************** */

/** @internal */
export class IndexChecker {
  private packageMap = new Map</* baseDir */ string, PackageIndexInfo | undefined>();

  constructor(private _ts: typeof TS) {}

  checkBaseName(baseNameNoExt: string, ext: string | undefined, suppliedBaseNameNoExt: string): IndexDetail {
    if (baseNameNoExt === 'index' && isImplicitExtension(ext!)) {
      let flags = IndexFlags.Node;
      if (suppliedBaseNameNoExt !== baseNameNoExt) flags |= IndexFlags.Implicit;
      return {
        indexPath: baseNameNoExt + (ext ?? ''),
        flags,
      };
    }

    return { flags: IndexFlags.None };
  }

  checkPackageFile(
    fileName: string,
    pathMatch: string | TS.Pattern | undefined,
    moduleName: string,
    suppliedPackageName: string | undefined,
    suppliedPackagePath: string | undefined
  ): IndexDetail {
    const idx = this.getPackageIndexInfo(fileName);

    const fileNameStrippedExt = stripImplicitExtension(fileName);
    const suppliedPathStrippedExt = suppliedPackagePath && stripImplicitExtension(suppliedPackagePath);
    if (idx && stripImplicitExtension(idx.packageIndex) === fileNameStrippedExt) {
      const { matchedText } = this._ts;

      let flags = IndexFlags.Package;
      if (pathMatch && typeof pathMatch !== 'string' && !pathMatch?.suffix) {
        let matchedStar = stripImplicitExtension(matchedText(pathMatch, moduleName));
        if (fileNameStrippedExt.slice(-matchedStar.length) !== matchedStar) flags |= IndexFlags.Implicit;
      } else {
        if (suppliedPackageName)
          if (
            !suppliedPathStrippedExt ||
            fileNameStrippedExt.slice(-suppliedPathStrippedExt.length) !== suppliedPathStrippedExt
          )
            flags |= IndexFlags.Implicit;
      }

      const indexPath = relativePath(idx.packageDir, idx.packageIndex);
      return { flags, indexPath };
    }

    return { flags: IndexFlags.None };
  }

  getPackageIndexInfo(fileName: string): undefined | PackageIndexInfo {
    fileName = normalizePath(fileName);

    /* Walk up dirs looking for package.json */
    let dir = dirName(fileName);
    const pathStack: string[] = [];
    while (true) {
      pathStack.push(dir);

      if (this.packageMap.has(dir)) return this.packageMap.get(dir);

      const pkgFile = resolvePath(dir, 'package.json');
      if (fs.existsSync(pkgFile)) {
        let packageIndex = 'index.js';
        try {
          const { main } = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
          if (main) packageIndex = main;
        } catch (e) {
          debugger;
          throw e;
        }

        packageIndex = resolvePath(dir, packageIndex);

        const res = { packageDir: dir, packageIndex };
        pathStack.forEach((p) => this.packageMap.set(p, res));

        return res;
      }

      try {
        const parentDir = resolvePath(dir, '..');
        if (parentDir === dir) break;
        dir = parentDir;
      } catch {
        break;
      }
    }
  }
}
