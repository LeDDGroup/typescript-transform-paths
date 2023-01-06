import url from "url";
import path from "path";

/* ****************************************************************************************************************** *
 * General Utilities & Helpers
 * ****************************************************************************************************************** */

export const isURL = (s: string): boolean => !!s && (!!url.parse(s).host || !!url.parse(s).hostname);

export const isBaseDir = (baseDir: string, testDir: string): boolean => {
  const relative = path.relative(baseDir, testDir);
  return relative ? !relative.startsWith("..") && !path.isAbsolute(relative) : true;
};

export const maybeAddRelativeLocalPrefix = (p: string) => (p[0] === "." ? p : `./${p}`);
