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
  ["3.6.5", tsThree, "typescript-three"],
  ["Latest", ts, "typescript"],
];

export const projectsPaths = path.join(__dirname, "./projects");
export const transformerPath = path.resolve(__dirname, "../src/index.ts");
export const builtTransformerPath = path.resolve(__dirname, "../dist/index.js");

Error.stackTraceLimit = 120;

// endregion
