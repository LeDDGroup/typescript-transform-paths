import ts from "typescript";
import TypeScriptThree from "typescript-three";
import TypeScriptFourSeven from "typescript-four-seven";
import path from "path";

/* ****************************************************************************************************************** */
// region: TS Instances
/* ****************************************************************************************************************** */

export { ts };
export const tsThree: typeof TypeScriptThree = require("typescript-three");
export const tsFourSeven: typeof TypeScriptFourSeven = require("typescript-four-seven");

// endregion

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export const tsModules = <const>[
  ["3.6.5", tsThree, "typescript-three"],
  ["4.7.4", tsFourSeven, "typescript-four-seven"],
  ["Latest", ts, "typescript"],
];

export const projectsPaths = path.join(__dirname, "./projects");
export const transformerPath = path.resolve(__dirname, "../src/index.ts");
export const builtTransformerPath = path.resolve(__dirname, "../dist/index.js");

Error.stackTraceLimit = 120;

// endregion
