import ts from "typescript";
import TypeScriptThree from "typescript-three";
import path from "path";
import { loadTypeScript } from "ttypescript/lib/loadTypescript";

/* ****************************************************************************************************************** */
// region: TS Instances
/* ****************************************************************************************************************** */

export { ts };
export const tsThree: typeof TypeScriptThree = require("typescript-three");
export const tTypeScript = loadTypeScript("typescript.js", { folder: path.resolve(__dirname, "../../") });

// endregion

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export const tsModules = <const>[
  ["Latest", ts],
  ["Latest (ttypescript)", tTypeScript],
  ["3.6.5", tsThree],
];
export const projectsPaths = path.join(__dirname, "../projects");
Error.stackTraceLimit = 120;

// endregion
