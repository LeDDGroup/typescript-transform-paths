import ts from "typescript";
import path from "node:path";

export const tsModules = <const>[["Latest", ts, "typescript"]];

export const projectsPaths = path.join(__dirname, "./projects");
export const transformerPath = require.resolve("typescript-transform-paths");
export const builtTransformerPath = require.resolve("typescript-transform-paths");

Error.stackTraceLimit = 120;

export { default as ts } from "typescript";
