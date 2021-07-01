import tsThree from "./declarations/typescript3";
import ts, { CompilerOptions, EmitHost, GetCanonicalFileName, Pattern, SourceFile } from "typescript";
import { PluginConfig } from "ts-patch";
import { HarmonyFactory } from "./utils/harmony-factory";
import { IMinimatch } from "minimatch";

/* ****************************************************************************************************************** */
// region: TS Types
/* ****************************************************************************************************************** */

export type TypeScriptLatest = typeof ts;
export type TypeScriptThree = typeof tsThree;
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
   * TS Instance passed from ts-patch / ttypescript with TS4+ typings
   */
  readonly tsInstance: TypeScriptLatest;
  /**
   * TS Instance passed from ts-patch / ttypescript with TS3 typings
   */
  readonly tsThreeInstance: TypeScriptThree;
  readonly tsFactory?: ts.NodeFactory;
  readonly program: ts.Program | tsThree.Program;
  readonly config: TsTransformPathsConfig;
  readonly compilerOptions: CompilerOptions;
  readonly elisionMap: Map<ts.SourceFile, Map<ImportOrExportDeclaration, ImportOrExportDeclaration>>;
  readonly transformationContext: ts.TransformationContext;
  readonly rootDirs?: string[];
  readonly excludeMatchers: IMinimatch[] | undefined;
  readonly outputFileNamesCache: Map<SourceFile, string>;
  readonly pathsBasePath: string;
  readonly getCanonicalFileName: GetCanonicalFileName;
  readonly pathsPatterns: (string | Pattern)[];
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
