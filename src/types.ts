import ts, { CompilerOptions, EmitHost, Pattern, SourceFile } from "typescript";
import { HarmonyFactory } from "./utils/harmony-factory";
import { IMinimatch } from "minimatch";
import { RequireSome } from "./utils";

/* ****************************************************************************************************************** */
// region: TS Types
/* ****************************************************************************************************************** */

export type ImportOrExportDeclaration = ts.ImportDeclaration | ts.ExportDeclaration;
export type ImportOrExportClause = ts.ImportDeclaration["importClause"] | ts.ExportDeclaration["exportClause"];
export type TransformerExtras = {
  ts: typeof ts;
}

// endregion

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export interface TsTransformPathsConfig {
  readonly useRootDirs?: boolean;
  readonly exclude?: string[];
  readonly outputMode?: "commonjs" | "esm";
}

// endregion

/* ****************************************************************************************************************** */
// region: Contexts
/* ****************************************************************************************************************** */

export interface TsTransformPathsContext {
  readonly tsInstance: typeof ts;
  readonly tsFactory?: ts.NodeFactory;
  readonly program?: ts.Program;
  readonly config: RequireSome<TsTransformPathsConfig, "outputMode">;
  readonly compilerOptions: CompilerOptions;
  readonly transformationContext: ts.TransformationContext;
  readonly rootDirs?: string[];
  readonly isTsNode: boolean;
  readonly isTranspileOnly: boolean;

  /** @internal - Do not remove internal flag — this uses an internal TS type */
  readonly pathsPatterns: readonly (string | Pattern)[] | undefined;
  /** @internal - Do not remove internal flag — this uses an internal TS type */
  readonly emitHost: EmitHost;

  /** @internal */
  readonly elisionMap: Map<ts.SourceFile, Map<ImportOrExportDeclaration, ImportOrExportDeclaration>>;
  /** @internal */
  readonly excludeMatchers: IMinimatch[] | undefined;
  /** @internal */
  readonly outputFileNamesCache: Map<SourceFile, string>;
}

export interface VisitorContext extends TsTransformPathsContext {
  readonly factory: HarmonyFactory;
  readonly sourceFile: ts.SourceFile;
  readonly isDeclarationFile: boolean;
  readonly originalSourceFile: ts.SourceFile;
  readonly outputMode: 'esm' | 'commonjs';

  /** @internal */
  getVisitor(): (node: ts.Node) => ts.VisitResult<ts.Node>;
}

// endregion
