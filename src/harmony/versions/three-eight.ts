/**
 * Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-40
 */
import TsCurrentModule, {
  EntityName,
  ExportDeclaration,
  Expression,
  Identifier,
  ImportClause,
  ImportDeclaration,
  ImportTypeAssertionContainer,
  ImportTypeNode,
  Modifier,
  ModuleBody,
  ModuleDeclaration,
  ModuleName,
  NamedExportBindings,
  NamedImportBindings,
  TypeNode,
} from "typescript";
import type TsThreeEightModule from "../../declarations/typescript3";
import { TsTransformPathsContext } from "../../types";
import { DownSampleTsTypes } from "../utils";

/* ****************************************************************************************************************** */
// region: Mapping
/* ****************************************************************************************************************** */

export type TypeMap = [
  [TsCurrentModule.SourceFile, TsThreeEightModule.SourceFile],
  [TsCurrentModule.StringLiteral, TsThreeEightModule.StringLiteral],
  [TsCurrentModule.CompilerOptions, TsThreeEightModule.CompilerOptions],
  [TsCurrentModule.EmitResolver, TsThreeEightModule.EmitResolver],
  [TsCurrentModule.CallExpression, TsThreeEightModule.CallExpression],
  [TsCurrentModule.ExternalModuleReference, TsThreeEightModule.ExternalModuleReference],
  [TsCurrentModule.LiteralTypeNode, TsThreeEightModule.LiteralTypeNode],
  [TsCurrentModule.ExternalModuleReference, TsThreeEightModule.ExternalModuleReference],
  [TsCurrentModule.ImportTypeNode, TsThreeEightModule.ImportTypeNode],
  [TsCurrentModule.EntityName, TsThreeEightModule.EntityName],
  [TsCurrentModule.TypeNode, TsThreeEightModule.TypeNode],
  [readonly TsCurrentModule.TypeNode[], readonly TsThreeEightModule.TypeNode[]],
  [TsCurrentModule.LiteralTypeNode, TsThreeEightModule.LiteralTypeNode],
  [TsCurrentModule.ImportDeclaration, TsThreeEightModule.ImportDeclaration],
  [TsCurrentModule.ImportClause, TsThreeEightModule.ImportClause],
  [TsCurrentModule.Identifier, TsThreeEightModule.Identifier],
  [TsCurrentModule.NamedImportBindings, TsThreeEightModule.NamedImportBindings],
  [TsCurrentModule.ImportDeclaration, TsThreeEightModule.ImportDeclaration],
  [TsCurrentModule.ExportDeclaration, TsThreeEightModule.ExportDeclaration],
  [TsCurrentModule.ModuleDeclaration, TsThreeEightModule.ModuleDeclaration],
  [TsCurrentModule.Expression, TsThreeEightModule.Expression],
  [TsCurrentModule.ModuleBody, TsThreeEightModule.ModuleBody],
  [TsCurrentModule.ModuleName, TsThreeEightModule.ModuleName],
  [TsCurrentModule.ExportDeclaration["exportClause"], TsThreeEightModule.ExportDeclaration["exportClause"]],
];

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export const predicate = (context: TsTransformPathsContext) => context.tsVersionMajor < 4;

export function handler(context: TsTransformPathsContext, prop: string | symbol) {
  const ts = context.tsInstance as unknown as typeof TsThreeEightModule;

  switch (prop) {
    case "updateCallExpression":
      return (...args: any) => ts.updateCall.apply(void 0, args);
    case "updateImportClause":
      return function (
        node: ImportClause,
        isTypeOnly: boolean,
        name: Identifier | undefined,
        namedBindings: NamedImportBindings | undefined,
      ) {
        return ts.updateImportClause.apply(void 0, downSample(node, name, namedBindings));
      };
    case "updateImportDeclaration":
      return function (
        node: ImportDeclaration,
        modifiers: readonly Modifier[] | undefined,
        importClause: ImportClause | undefined,
        moduleSpecifier: Expression,
      ) {
        const [dsNode, dsImportClause, dsModuleSpecifier] = downSample(node, importClause, moduleSpecifier);

        return ts.updateImportDeclaration(
          dsNode,
          dsNode.decorators,
          dsNode.modifiers,
          dsImportClause,
          dsModuleSpecifier,
        );
      };
    case "updateExportDeclaration":
      return function (
        node: ExportDeclaration,
        modifiers: readonly Modifier[] | undefined,
        isTypeOnly: boolean,
        exportClause: NamedExportBindings | undefined,
        moduleSpecifier: Expression | undefined,
      ) {
        const [dsNode, dsModuleSpecifier, dsExportClause] = downSample(node, moduleSpecifier, exportClause);
        return ts.updateExportDeclaration(
          dsNode,
          dsNode.decorators,
          dsNode.modifiers,
          dsExportClause,
          dsModuleSpecifier,
          // @ts-ignore - This was added in later versions of 3.x
          dsNode.isTypeOnly,
        );
      };
    case "updateModuleDeclaration":
      return function (
        node: ModuleDeclaration,
        modifiers: readonly Modifier[] | undefined,
        name: ModuleName,
        body: ModuleBody | undefined,
      ) {
        const [dsNode, dsName, dsBody] = downSample(node, name, body);

        return ts.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
      };
    case "updateImportTypeNode":
      return function (
        node: ImportTypeNode,
        argument: TypeNode,
        assertions: ImportTypeAssertionContainer | undefined,
        qualifier: EntityName | undefined,
        typeArguments: readonly TypeNode[] | undefined,
        isTypeOf?: boolean,
      ) {
        const [dsNode, dsArgument, dsQualifier, dsTypeArguments] = downSample(node, argument, qualifier, typeArguments);

        return ts.updateImportTypeNode(dsNode, dsArgument, dsQualifier, dsTypeArguments, isTypeOf);
      };
    default:
      return (...args: any) => (<any>ts)[prop](...args);
  }
}

export function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T> {
  return <any>args;
}

// endregion
