import ts, { CompilerOptions, EmitHost, Pattern, SourceFile } from "typescript";
import { PluginConfig } from "ts-patch";
import { HarmonyFactory } from "./harmony";
import { IMinimatch } from "minimatch";

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
  /**
   * TS Instance passed from ts-patch / ttypescript
   */
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
  readonly excludeMatchers: IMinimatch[] | undefined;
  readonly outputFileNamesCache: Map<SourceFile, string>;
  readonly pathsPatterns: readonly (string | Pattern)[] | undefined;
  readonly emitHost: EmitHost;
}

export interface VisitorContext extends TsTransformPathsContext {
  readonly factory: HarmonyFactory;
  readonly sourceFile: ts.SourceFile;
  readonly isDeclarationFile: boolean;
  readonly originalSourceFile: ts.SourceFile;
  getVisitor(): (node: ts.Node) => ts.VisitResult<ts.Node>;
}

// endregion

/* ****************************************************************************************************************** */
// region: General
/* ****************************************************************************************************************** */

export enum RunMode {
  TsNode = "ts-node",
  Manual = "manual",
  Program = "program",
}

export enum TsNodeState {
  Full,
  Stripped,
}

// endregion
