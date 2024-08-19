import ts from "typescript";
import tsThree from "typescript-3";
import tsFourSeven from "typescript-4.7";
import path from "node:path";



export const tsModules = <const>[
  ["3.6.5", tsThree, "typescript-3"],
  ["4.7.4", tsFourSeven, "typescript-4.7"],
  ["Latest", ts, "typescript"],
];

export const projectsPaths = path.join(__dirname, "./projects");
export const transformerPath = require.resolve("typescript-transform-paths");
export const builtTransformerPath = require.resolve("typescript-transform-paths");

Error.stackTraceLimit = 120;

export {default as ts} from "typescript";