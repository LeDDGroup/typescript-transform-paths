import ts from "typescript";
import tsThree from "typescript-three";
import tsFourSeven from "typescript-four-seven";
import path from "path";

/* ****************************************************************************************************************** */
// region: TS Instances
/* ****************************************************************************************************************** */

export { ts, tsThree, tsFourSeven };

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
export const transformerPath = require.resolve("typescript-transform-paths");
export const builtTransformerPath = require.resolve("typescript-transform-paths");

Error.stackTraceLimit = 120;

// endregion
