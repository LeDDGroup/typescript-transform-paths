/**
 * This file and its contents are due to an issue in TypeScript (affecting *at least* up to 4.1) which causes type
 * elision to break during emit for nodes which have been transformed. Specifically, if the 'original' property is set,
 * elision functionality no longer works.
 *
 * This results in module specifiers for types being output in import/export declarations in the compiled *JS files*
 *
 * The logic herein compensates for that issue by recreating type elision separately so that the transformer can update
 * the clause with the properly elided information
 *
 * Issues:
 * @see https://github.com/microsoft/TypeScript/issues/40603
 * @see https://github.com/microsoft/TypeScript/issues/31446
 *
 * @example
 * // a.ts
 * export type A = string
 * export const B = 2
 *
 * // b.ts
 * import { A, B } from './b'
 * export { A } from './b'
 *
 * // Expected output for b.js
 * import { B } from './b'
 *
 * // Actual output for b.js
 * import { A, B } from './b'
 * export { A } from './b'
 */
import { ImportOrExportClause, ImportOrExportDeclaration, VisitorContext } from "../types";
import TS, { ImportDeclaration, NodeFactoryFlags } from "typescript";
import { cast, cloneNode } from "./general-utils";
import { downSampleTsTypes } from "./ts-type-conversion";

/* ****************************************************************************************************************** */
// region: Transformer Factories
/* ****************************************************************************************************************** */

/**
 * Creates a typescript transformer which removes all statements except import / export declarations (and the module
 * nodes which contain them). Also renames the 'original' property in order to preserve type elision.
 *
 * See notes at the top of this file for more detail.
 */
function createPruneSourceFileTransformer(context: VisitorContext) {
  const { tsInstance } = context;

  return (ctx: TS.TransformationContext) =>
    function visitor(n: TS.Node): TS.Node | undefined {
      if (tsInstance.isModuleDeclaration(n) || tsInstance.isSourceFile(n))
        return tsInstance.visitEachChild(n, visitor, ctx);

      if (tsInstance.isImportDeclaration(n) || tsInstance.isExportDeclaration(n)) {
        (<any>n)["_baseNode"] = n.original;
        delete n.original;
        return n;
      }

      return (context.factory ?? context.tsInstance).createEmptyStatement();
    } as (n: TS.Node) => TS.SourceFile;
}

/**
 * Creates a typescript transformer which does no actual transformation. Rather, it uses the visitor to walk the nodes
 * and populate the nodeMap with proper linkage of original -> transformed (elided) nodes
 */
function createPopulateNodeMapTransformer(
  { tsInstance }: VisitorContext,
  nodeMap: Map<ImportOrExportDeclaration, ImportOrExportDeclaration>
) {
  return (ctx: TS.TransformationContext) =>
    function visitor(n: TS.Node): TS.Node | undefined {
      if (tsInstance.isModuleDeclaration(n) || tsInstance.isSourceFile(n))
        return tsInstance.visitEachChild(n, visitor, ctx);

      if (tsInstance.isImportDeclaration(n) || tsInstance.isExportDeclaration(n)) {
        const baseNode = (<any>n).original?._baseNode ?? (<any>n).original ?? n;
        if (baseNode) nodeMap.set(baseNode, n);
      }

      return n;
    } as (n: TS.Node) => TS.SourceFile;
}

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Get import / export clause for node (replicates TS elision behaviour for js files)
 * See notes in get-import-export-clause.ts header for why this is necessary
 *
 * @returns import or export clause or undefined if it entire declaration should be elided
 */
export function getImportOrExportClause<T extends ImportOrExportDeclaration>(
  context: VisitorContext,
  node: T
): T extends ImportDeclaration
  ? TS.ImportDeclaration["importClause"] | undefined
  : TS.ExportDeclaration["exportClause"] | undefined;

export function getImportOrExportClause(
  context: VisitorContext,
  node: ImportOrExportDeclaration
): ImportOrExportClause | undefined {
  const {
    tsInstance,
    tsThreeInstance,
    isDeclarationFile,
    sourceFile,
    elisionMap,
    transformationContext,
    compilerOptions,
    factory,
  } = context;

  if (isDeclarationFile) return tsInstance.isImportDeclaration(node) ? node.importClause : node.exportClause;

  /* Prepare elision map for SourceFile if not already generated */
  if (!elisionMap.has(sourceFile)) {
    const emitResolver = transformationContext.getEmitResolver();
    const transformCompilerOptions = { ...compilerOptions, plugins: undefined };
    const nodeMap = new Map<ImportOrExportDeclaration, ImportOrExportDeclaration>();

    elisionMap.set(sourceFile, nodeMap);

    // Create transformers in order
    const transformers = [
      createPruneSourceFileTransformer(context),
      tsInstance.transformTypeScript,
      createPopulateNodeMapTransformer(context, nodeMap),
    ];

    /* Transform nodes using TS compiler API to get proper elision output */
    if (factory) {
      const transformFactory = tsInstance.createNodeFactory(NodeFactoryFlags.None, tsInstance.createBaseNodeFactory());
      tsInstance.transformNodes(
        emitResolver,
        /* host */ void 0,
        transformFactory,
        transformCompilerOptions,
        /* nodes */ [sourceFile],
        transformers,
        /* allowDtsFiles */ false
      );
    } else {
      tsThreeInstance.transformNodes.apply(
        undefined,
        downSampleTsTypes(
          emitResolver,
          /* host */ void 0,
          transformCompilerOptions,
          /* nodes */ [sourceFile],
          cast(transformers),
          /* allowDtsFiles */ false
        )
      );
    }
  }

  /* Find matching node with proper elision */
  const nodeMap = elisionMap.get(sourceFile)!;
  const transformedMatchNode = nodeMap.get(node);

  // Match is undefined if entire declaration is elided
  if (!transformedMatchNode) return void 0;

  const maybeClause = tsInstance.isImportDeclaration(transformedMatchNode)
    ? transformedMatchNode.importClause
    : transformedMatchNode.exportClause;

  return maybeClause && cloneNode(context, maybeClause);
}

// endregion
