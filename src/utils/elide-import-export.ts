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
import { ImportOrExportClause, ImportOrExportDeclaration, VisitorContext } from '../types';
import {
  ExportDeclaration, ExportSpecifier, ImportClause, ImportDeclaration, ImportSpecifier, NamedExports,
  NamedImportBindings, Visitor, VisitResult
} from 'typescript';

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Get import / export clause for node (replicates TS elision behaviour for js files)
 * See notes in get-import-export-clause.ts header for why this is necessary
 *
 * @returns import or export clause or undefined if it entire declaration should be elided
 */
export function elideImportOrExportClause<T extends ImportOrExportDeclaration>(
  context: VisitorContext,
  node: T
): (T extends ImportDeclaration ? ImportDeclaration["importClause"] : ExportDeclaration["exportClause"]) | undefined;

export function elideImportOrExportClause(
  context: VisitorContext,
  node: ImportOrExportDeclaration
): ImportOrExportClause | undefined {
  const { tsInstance, transformationContext, factory } = context;
  const resolver = transformationContext.getEmitResolver();
  const {
    visitNode,
    isNamedImportBindings,
    isImportSpecifier,
    SyntaxKind,
    visitNodes,
    isNamedExportBindings,
    isExportSpecifier
  } = tsInstance;

  if (tsInstance.isImportDeclaration(node)) {
    if (node.importClause!.isTypeOnly) return undefined;
    return visitNode(node.importClause, <Visitor>visitImportClause);
  } else {
    if (node.isTypeOnly) return undefined;
    return visitNode(node.exportClause, <Visitor>visitNamedExports, isNamedExportBindings);
  }

  /* ********************************************************* *
   * Helpers
   * ********************************************************* */
  // The following visitors are adapted from the TS source-base src/compiler/transformers/ts

  /**
   * Visits an import clause, eliding it if it is not referenced.
   *
   * @param node The import clause node.
   */
  function visitImportClause(node: ImportClause): VisitResult<ImportClause> {
    // Elide the import clause if we elide both its name and its named bindings.
    const name = resolver.isReferencedAliasDeclaration(node) ? node.name : undefined;
    const namedBindings = visitNode(node.namedBindings, <Visitor>visitNamedImportBindings, isNamedImportBindings);
    return name || namedBindings
      ? factory.updateImportClause(node, /*isTypeOnly*/ false, name, namedBindings)
      : undefined;
  }

  /**
   * Visits named import bindings, eliding it if it is not referenced.
   *
   * @param node The named import bindings node.
   */
  function visitNamedImportBindings(node: NamedImportBindings): VisitResult<NamedImportBindings> {
    if (node.kind === SyntaxKind.NamespaceImport) {
      // Elide a namespace import if it is not referenced.
      return resolver.isReferencedAliasDeclaration(node) ? node : undefined;
    } else {
      // Elide named imports if all of its import specifiers are elided.
      const elements = visitNodes(node.elements, <Visitor>visitImportSpecifier, isImportSpecifier);
      return tsInstance.some(elements) ? factory.updateNamedImports(node, elements) : undefined;
    }
  }

  /**
   * Visits an import specifier, eliding it if it is not referenced.
   *
   * @param node The import specifier node.
   */
  function visitImportSpecifier(node: ImportSpecifier): VisitResult<ImportSpecifier> {
    // Elide an import specifier if it is not referenced.
    return resolver.isReferencedAliasDeclaration(node) ? node : undefined;
  }

  /**
   * Visits named exports, eliding it if it does not contain an export specifier that
   * resolves to a value.
   *
   * @param node The named exports node.
   */
  function visitNamedExports(node: NamedExports): VisitResult<NamedExports> {
    // Elide the named exports if all of its export specifiers were elided.
    const elements = visitNodes(node.elements, <Visitor>visitExportSpecifier, isExportSpecifier);
    return tsInstance.some(elements) ? factory.updateNamedExports(node, elements) : undefined;
  }

  /**
   * Visits an export specifier, eliding it if it does not resolve to a value.
   *
   * @param node The export specifier node.
   */
  function visitExportSpecifier(node: ExportSpecifier): VisitResult<ExportSpecifier> {
    // Elide an export specifier if it does not reference a value.
    return resolver.isValueAliasDeclaration(node) ? node : undefined;
  }
}

// endregion
