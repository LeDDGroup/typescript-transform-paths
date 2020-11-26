import ts from "typescript";
import url from "url";
import path from "path";
import { TsTransformPathsContext, TypeScriptThree } from "../types";
import tsThree from "../declarations/typescript3";

/* ****************************************************************************************************************** *
 * General Utilities & Helpers
 * ****************************************************************************************************************** */

export const isURL = (s: string): boolean => !!s && (!!url.parse(s).host || !!url.parse(s).hostname);
export const isBaseDir = (base: string, dir: string) => path.relative(base, dir)?.[0] !== ".";
export const cast = <T>(v: any): T => v;

/**
 * @returns Array of implicit extensions, given CompilerOptions
 */
export function getImplicitExtensions(options: ts.CompilerOptions) {
  let res: string[] = [".ts", ".d.ts"];

  let { allowJs, jsx, resolveJsonModule: allowJson } = options;
  const allowJsx = !!jsx && <any>jsx !== ts.JsxEmit.None;

  allowJs && res.push(".js");
  allowJsx && res.push(".tsx");
  allowJs && allowJsx && res.push(".jsx");
  allowJson && res.push(".json");

  return res;
}

/**
 * Creates a mutable clone of a TS Node (accommodates both TS4+ and earlier versions)
 */
export function cloneNode<T extends ts.Node>(context: TsTransformPathsContext, node: T): T {
  const { factory, tsInstance } = context;
  return factory
    ? factory.cloneNode(node)
    : ((cast<TypeScriptThree>(tsInstance).getMutableClone(cast<tsThree.Node>(node)) as unknown) as T);
}
