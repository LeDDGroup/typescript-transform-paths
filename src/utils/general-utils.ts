import url from "url";
import path from "path";
import { realpathSync } from "fs";

/* ****************************************************************************************************************** *
 * General Utilities & Helpers
 * ****************************************************************************************************************** */

export const isURL = (s: string): boolean => !!s && (!!url.parse(s).host || !!url.parse(s).hostname);

export const cast = <T>(v: any): T => v;

export const isBaseDir = (baseDir: string, testDir: string): boolean => {
  const relative = path.relative(baseDir, testDir);
  return relative ? !relative.startsWith("..") && !path.isAbsolute(relative) : true;
};

export const maybeAddRelativeLocalPrefix = (p: string) => (p[0] === "." ? p : `./${p}`);

export function tryRealpathNative(value: string) {
  try {
    return realpathSync.native(value);
  } catch {
    return value;
  }
}

export function nativeRelativePath(from: string, to: string) {
  return path.relative(tryRealpathNative(from), tryRealpathNative(to));
}
