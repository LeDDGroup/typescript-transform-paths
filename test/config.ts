import path from "node:path";
import ts from "typescript";

export const tsModules = [["Latest", ts, "typescript"]] as const;

export const projectsPaths = path.join(import.meta.dirname, "./projects");
export const transformerPath = import.meta.resolve("typescript-transform-paths");
export const builtTransformerPath = import.meta.resolve("typescript-transform-paths");

Error.stackTraceLimit = 120;

export { default as ts } from "typescript";
