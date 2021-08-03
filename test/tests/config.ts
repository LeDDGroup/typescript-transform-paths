import ts from "typescript";
import TypeScriptThree from "typescript-three";
import path from "path";

/* ****************************************************************************************************************** */
// region: TS Instances
/* ****************************************************************************************************************** */

export { ts };
export const tsThree: typeof TypeScriptThree = require("typescript-three");

// endregion

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export const tsModules = <const>[
  ["Latest", ts, "typescript"],
  ["3.6.5", tsThree, "typescript-three"],
];
export const projectsPaths = path.join(__dirname, "../projects");
Error.stackTraceLimit = 120;

// endregion
