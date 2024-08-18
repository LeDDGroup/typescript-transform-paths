/**
 * UPDATE:
 *
 * TODO - In next major version, we can remove this file entirely due to TS PR 57223
 * https://github.com/microsoft/TypeScript/pull/57223
 *
 * This file and its contents are due to an issue in TypeScript (affecting _at least_ up to 4.1) which causes type
 * elision to break during emit for nodes which have been transformed. Specifically, if the 'original' property is set,
 * elision functionality no longer works.
 *
 * This results in module specifiers for types being output in import/export declarations in the compiled _JS files_
 *
 * The logic herein compensates for that issue by recreating type elision separately so that the transformer can update
 * the clause with the properly elided information
 *
 * Issues:
 *
 * - See https://github.com/LeDDGroup/typescript-transform-paths/issues/184
 * - See https://github.com/microsoft/TypeScript/issues/40603
 * - See https://github.com/microsoft/TypeScript/issues/31446
 *
 * @example
 *   // a.ts
 *   export type A = string;
 *   export const B = 2;
 *
 *   // b.ts
 *   import { A, B } from "./b";
 *   export { A } from "./b";
 *
 *   // Expected output for b.js
 *   import { B } from "./b";
 *
 *   // Actual output for b.js
 *   import { A, B } from "./b";
 *   export { A } from "./b";
 */
import { ImportOrExportDeclaration, VisitorContext } from "../types";
import {
  Debug,
  EmitResolver,
  ExportSpecifier,
  ImportClause,
  ImportsNotUsedAsValues,
  ImportSpecifier,
  isInJSFile,
  NamedExportBindings,
  NamedExports,
  NamedImportBindings,
  NamespaceExport,
  Node,
  StringLiteral,
  Visitor,
  VisitResult,
} from "typescript";

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Get import / export clause for node (replicates TS elision behaviour for js files) See notes in
 * get-import-export-clause.ts header for why this is necessary
 *
 * @returns Import or export clause or undefined if it entire declaration should be elided
 */
export function elideImportOrExportDeclaration<T extends ImportOrExportDeclaration>(
  context: VisitorContext,
  node: T,
  newModuleSpecifier: StringLiteral,
  resolver: EmitResolver,
): T | undefined;

export function elideImportOrExportDeclaration(
  context: VisitorContext,
  node: ImportOrExportDeclaration,
  newModuleSpecifier: StringLiteral,
  resolver: EmitResolver,
): ImportOrExportDeclaration | undefined {
  const { tsInstance, factory } = context;
  const { compilerOptions } = context;

  const {
    visitNode,
    isNamedImportBindings,
    isImportSpecifier,
    SyntaxKind,
    visitNodes,
    isNamedExportBindings,
    // 3.8 does not have this, so we have to define it ourselves
    // isNamespaceExport,
    isIdentifier,
    isExportSpecifier,
  } = tsInstance;

  const isNamespaceExport =
    tsInstance.isNamespaceExport ?? ((node: Node): node is NamespaceExport => node.kind === SyntaxKind.NamespaceExport);

  if (tsInstance.isImportDeclaration(node)) {
    // Do not elide a side-effect only import declaration.
    //  import "foo";
    if (!node.importClause) return node.importClause;

    // Always elide type-only imports
    if (node.importClause.isTypeOnly) return undefined;

    const importClause = visitNode(node.importClause, <Visitor>visitImportClause);

    if (
      importClause ||
      compilerOptions.importsNotUsedAsValues === ImportsNotUsedAsValues.Preserve ||
      compilerOptions.importsNotUsedAsValues === ImportsNotUsedAsValues.Error
    )
      return factory.updateImportDeclaration(
        node,
        /*modifiers*/ undefined,
        importClause,
        newModuleSpecifier,
        // This will be changed in the next release of TypeScript, but by that point we can drop elision entirely
        (node as any).attributes || node.assertClause,
      );
    else return undefined;
  } else {
    if (node.isTypeOnly) return undefined;

    if (!node.exportClause || node.exportClause.kind === SyntaxKind.NamespaceExport) {
      // never elide `export <whatever> from <whereever>` declarations -
      // they should be kept for sideffects/untyped exports, even when the
      // type checker doesn't know about any exports
      return node;
    }

    const allowEmpty =
      !!compilerOptions.verbatimModuleSyntax ||
      (!!node.moduleSpecifier &&
        (compilerOptions.importsNotUsedAsValues === ImportsNotUsedAsValues.Preserve ||
          compilerOptions.importsNotUsedAsValues === ImportsNotUsedAsValues.Error));

    const exportClause = visitNode(
      node.exportClause,
      <Visitor>((bindings: NamedExportBindings) => visitNamedExportBindings(bindings, allowEmpty)),
      isNamedExportBindings,
    );

    return exportClause
      ? factory.updateExportDeclaration(
          node,
          /*modifiers*/ undefined,
          node.isTypeOnly,
          exportClause,
          newModuleSpecifier,
          // This will be changed in the next release of TypeScript, but by that point we can drop elision entirely
          (node as any).attributes || node.assertClause,
        )
      : undefined;
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
    const name = shouldEmitAliasDeclaration(node) ? node.name : undefined;
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
      return shouldEmitAliasDeclaration(node) ? node : undefined;
    } else {
      // Elide named imports if all of its import specifiers are elided.
      const allowEmpty =
        compilerOptions.verbatimModuleSyntax ||
        (compilerOptions.preserveValueImports &&
          (compilerOptions.importsNotUsedAsValues === ImportsNotUsedAsValues.Preserve ||
            compilerOptions.importsNotUsedAsValues === ImportsNotUsedAsValues.Error));

      const elements = visitNodes(node.elements, <Visitor>visitImportSpecifier, isImportSpecifier);
      return allowEmpty || tsInstance.some(elements) ? factory.updateNamedImports(node, elements) : undefined;
    }
  }

  /**
   * Visits an import specifier, eliding it if it is not referenced.
   *
   * @param node The import specifier node.
   */
  function visitImportSpecifier(node: ImportSpecifier): VisitResult<ImportSpecifier> {
    // Elide an import specifier if it is not referenced.
    return !node.isTypeOnly && shouldEmitAliasDeclaration(node) ? node : undefined;
  }

  /** Visits named exports, eliding it if it does not contain an export specifier that resolves to a value. */
  function visitNamedExports(node: NamedExports, allowEmpty: boolean): VisitResult<NamedExports> | undefined {
    // Elide the named exports if all of its export specifiers were elided.
    const elements = visitNodes(node.elements, <Visitor>visitExportSpecifier, isExportSpecifier);
    return allowEmpty || tsInstance.some(elements) ? factory.updateNamedExports(node, elements) : undefined;
  }

  function visitNamedExportBindings(
    node: NamedExportBindings,
    allowEmpty: boolean,
  ): VisitResult<NamedExportBindings> | undefined {
    return isNamespaceExport(node) ? visitNamespaceExports(node) : visitNamedExports(node, allowEmpty);
  }

  function visitNamespaceExports(node: NamespaceExport): VisitResult<NamespaceExport> {
    // Note: This may not work entirely properly, more likely it's just extraneous, but this won't matter soon,
    // as we'll be removing elision entirely
    return factory.updateNamespaceExport(node, Debug.checkDefined(visitNode(node.name, (n) => n, isIdentifier)));
  }

  /**
   * Visits an export specifier, eliding it if it does not resolve to a value.
   *
   * @param node The export specifier node.
   */
  function visitExportSpecifier(node: ExportSpecifier): VisitResult<ExportSpecifier> {
    // Elide an export specifier if it does not reference a value.
    return !node.isTypeOnly && (compilerOptions.verbatimModuleSyntax || resolver.isValueAliasDeclaration(node))
      ? node
      : undefined;
  }

  function shouldEmitAliasDeclaration(node: Node): boolean {
    return (
      !!compilerOptions.verbatimModuleSyntax ||
      isInJSFile(node) ||
      (compilerOptions.preserveValueImports
        ? resolver.isValueAliasDeclaration(node)
        : resolver.isReferencedAliasDeclaration(node))
    );
  }
}

// endregion
