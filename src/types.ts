import { Minimatch } from "minimatch";
import { type PluginConfig } from "ts-patch";
import ts, { type CompilerOptions, type EmitHost, type Pattern, type SourceFile } from "typescript";

/* ****************************************************************************************************************** */
// region: TS Types
/* ****************************************************************************************************************** */

export type ImportOrExportDeclaration = ts.ImportDeclaration | ts.ExportDeclaration;
export type ImportOrExportClause = ts.ImportDeclaration["importClause"] | ts.ExportDeclaration["exportClause"];

// endregion

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export interface TsTransformPathsConfig extends PluginConfig {
  readonly useRootDirs?: boolean;
  readonly exclude?: string[];
}

// endregion

/* ****************************************************************************************************************** */
// region: Contexts
/* ****************************************************************************************************************** */

export interface TsTransformPathsContext {
  /** TS Instance passed from ts-patch / ttypescript */
  readonly tsInstance: typeof ts;
  readonly tsVersionMajor: number;
  readonly tsVersionMinor: number;
  readonly tsFactory?: ts.NodeFactory;
  readonly runMode: RunMode;
  readonly tsNodeState?: TsNodeState;
  readonly program?: ts.Program;
  readonly config: TsTransformPathsConfig;
  readonly compilerOptions: CompilerOptions;
  readonly elisionMap: Map<ts.SourceFile, Map<ImportOrExportDeclaration, ImportOrExportDeclaration>>;
  readonly transformationContext: ts.TransformationContext;
  readonly rootDirs?: string[];
  readonly excludeMatchers: Minimatch[] | undefined;
  readonly outputFileNamesCache: Map<SourceFile, string>;
  readonly pathsPatterns: readonly (string | Pattern)[] | undefined;
  readonly emitHost: EmitHost;
}

export interface VisitorContext extends TsTransformPathsContext {
  readonly factory: ts.NodeFactory;
  readonly sourceFile: ts.SourceFile;
  readonly isDeclarationFile: boolean;
  readonly originalSourceFile: ts.SourceFile;
  getVisitor(): (node: ts.Node) => ts.VisitResult<ts.Node>;
}

// endregion

/* ****************************************************************************************************************** */
// region: General
/* ****************************************************************************************************************** */

export const RunMode = {
  TsNode: "ts-node",
  Manual: "manual",
  Program: "program",
};

export type RunMode = (typeof RunMode)[keyof typeof RunMode];

export const TsNodeState = {
  Full: 0,
  Stripped: 1,
};

export type TsNodeState = (typeof TsNodeState)[keyof typeof TsNodeState];

// endregion
