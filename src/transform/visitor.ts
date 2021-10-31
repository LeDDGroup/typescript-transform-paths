import type TS from "typescript";
import { VisitorContext } from "../types";
import { elideImportOrExportClause } from "./elide-import-export";
import { resolvePathAndUpdateNode } from "../resolve";
import { copyNodeComments } from '../ts';

/* ****************************************************************************************************************** *
 * Helpers
 * ****************************************************************************************************************** */

const isAsyncImport = ({ tsInstance }: VisitorContext, node: TS.Node): node is TS.CallExpression =>
  tsInstance.isCallExpression(node) &&
  node.expression.kind === tsInstance.SyntaxKind.ImportKeyword &&
  tsInstance.isStringLiteral(node.arguments[0]) &&
  node.arguments.length === 1;

const isRequire = ({ tsInstance }: VisitorContext, node: TS.Node): node is TS.CallExpression =>
  tsInstance.isCallExpression(node) &&
  tsInstance.isIdentifier(node.expression) &&
  node.expression.text === "require" &&
  tsInstance.isStringLiteral(node.arguments[0]) &&
  node.arguments.length === 1;

/* ****************************************************************************************************************** *
 * Node Visitor
 * ****************************************************************************************************************** */

/**
 * Visit and replace nodes with module specifiers
 */
export function nodeVisitor(this: VisitorContext, node: TS.Node): TS.Node | undefined {
  const { factory, tsInstance, transformationContext, sourceFile } = this;

  /**
   * Update require / import functions
   *
   * require('module')
   * import('module')
   */
  if (isRequire(this, node) || isAsyncImport(this, node))
    return resolvePathAndUpdateNode(this, node, (<TS.StringLiteral>node.arguments[0]).text, (p) => {
      const res = factory.updateCallExpression(node, node.expression, node.typeArguments, [p]);

      /* Copy inner comments */
      const textNode = node.arguments[0];
      copyNodeComments(tsInstance, sourceFile, textNode, p);

      return res;
    });

  /**
   * Update ExternalModuleReference
   *
   * import foo = require("foo");
   */
  if (tsInstance.isExternalModuleReference(node) && tsInstance.isStringLiteral(node.expression))
    return resolvePathAndUpdateNode(this, node, node.expression.text, (p) =>
      factory.updateExternalModuleReference(node, p)
    );

  /**
   * Update ImportTypeNode
   *
   * typeof import("./bar");
   */
  if (tsInstance.isImportTypeNode(node)) {
    const argument = node.argument as TS.LiteralTypeNode;
    if (!tsInstance.isStringLiteral(argument.literal)) return node;

    const { text } = argument.literal;
    if (!text) return node;

    return resolvePathAndUpdateNode(this, node, text, (p) =>
      factory.updateImportTypeNode(
        node,
        factory.updateLiteralTypeNode(argument, p),
        node.qualifier,
        node.typeArguments,
        node.isTypeOf
      )
    );
  }

  /**
   * Update ImportDeclaration
   *
   * import ... 'module';
   */
  if (tsInstance.isImportDeclaration(node) && node.moduleSpecifier && tsInstance.isStringLiteral(node.moduleSpecifier))
    return resolvePathAndUpdateNode(this, node, node.moduleSpecifier.text, (p) => {
      let importClause = node.importClause;

      if (!this.isDeclarationFile && importClause?.namedBindings) {
        const updatedImportClause = elideImportOrExportClause(this, node);
        if (!updatedImportClause) return undefined; // No imports left, elide entire declaration
        importClause = updatedImportClause;
      }

      return factory.updateImportDeclaration(node, node.decorators, node.modifiers, importClause, p);
    });

  /**
   * Update ExportDeclaration
   *
   * export ... 'module';
   */
  if (tsInstance.isExportDeclaration(node) && node.moduleSpecifier && tsInstance.isStringLiteral(node.moduleSpecifier))
    return resolvePathAndUpdateNode(this, node, node.moduleSpecifier.text, (p) => {
      let exportClause = node.exportClause;

      if (!this.isDeclarationFile && exportClause && tsInstance.isNamedExports(exportClause)) {
        const updatedExportClause = elideImportOrExportClause(this, node);
        if (!updatedExportClause) return undefined; // No export left, elide entire declaration
        exportClause = updatedExportClause;
      }

      return factory.updateExportDeclaration(node, node.decorators, node.modifiers, node.isTypeOnly, exportClause, p);
    });

  /**
   * Update module augmentation
   */
  if (tsInstance.isModuleDeclaration(node) && tsInstance.isStringLiteral(node.name))
    return resolvePathAndUpdateNode(this, node, node.name.text, (p) =>
      factory.updateModuleDeclaration(node, node.decorators, node.modifiers, p, node.body)
    );

  return tsInstance.visitEachChild(node, this.getVisitor(), transformationContext);
}
