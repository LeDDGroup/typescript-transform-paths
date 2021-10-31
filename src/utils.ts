import path from "path";
import url from 'url';

/* ****************************************************************************************************************** *
 * TS Exports
 * ****************************************************************************************************************** */

import { normalizePath } from 'typescript';
export { removeFileExtension, isAnySupportedFileExtension, removeSuffix } from 'typescript';
export { normalizePath };

/* ****************************************************************************************************************** */
// region: General Utils
/* ****************************************************************************************************************** */

export const isURL = (s: string): boolean => !!s && (!!url.parse(s).host || !!url.parse(s).hostname);
export const cast = <T>(v: any): T => v;
export const isBaseDir = (baseDir: string, testDir: string): boolean => {
  const relative = path.relative(baseDir, testDir);
  return relative ? !relative.startsWith("..") && !path.isAbsolute(relative) : true;
};
export const maybeAddRelativeLocalPrefix = (p: string) => (p[0] === "." ? p : `./${p}`);

// endregion

/* ****************************************************************************************************************** */
// region: Path Utils
/* ****************************************************************************************************************** */

/**
 * Merge and normalize paths (preserves relative prefix – ie. `./my/path`)
 */
export function joinPaths(...paths: (string | undefined)[]): string {
  // path.join / normalizePath cannot be used here, because they remove relative prefix
  return normalizeSlashes((paths.filter(p => !!p) as string[]).join('/'))!;
}

/**
 * Normalize slashes in path
 */
export function normalizeSlashes<T extends string | undefined>(p: T, opt?: { removeLeadingSlash?: boolean, removeTrailingSlash?: boolean }): T {
  if (!p) return p;

  let res = p.replace(/\\+|\/+/g, '/');

  if (opt?.removeLeadingSlash && res[0] === '/') res = res.slice(1);
  if (opt?.removeTrailingSlash && res[res.length-1] === '/') res = res.slice(0, res.length - 1);

  return res as T;
}

/**
 * Get extension for path (supports declaration style – ie. `d.ts`)
 */
export function extName(p: string) {
  const res = path.extname(p);
  const baseName = path.basename(p, res);
  return baseName.slice(-2) === '.d' ? `.d${res}` : res;
}

export function baseName(p: string, stripExtension: boolean | string = false) {
  const ext = !stripExtension ? void 0 : (typeof stripExtension === 'string' ? stripExtension : extName(p));
  return path.basename(p, ext);
}

export function resolvePath(...p: (string | undefined)[]): string {
  return normalizePath(path.resolve(joinPaths(...p))) as string;
}

export function dirName(p: string) {
  return normalizePath(path.dirname(p));
}

export function relativePath(from: string, to: string) {
  return normalizePath(path.relative(from, to));
}

// endregion
