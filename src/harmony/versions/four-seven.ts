/**
 * Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-48
 */
import TsCurrentModule, {
  AssertClause,
  ExportDeclaration,
  Expression,
  ImportClause,
  ImportDeclaration,
  Modifier,
  ModuleBody,
  ModuleDeclaration,
  ModuleName,
  NamedExportBindings,
} from "typescript";
import TsFourSevenModule from "typescript-4.7";
import { TsTransformPathsContext } from "../../types";
import { DownSampleTsTypes } from "../utils";

/* ****************************************************************************************************************** */
// region: Mapping
/* ****************************************************************************************************************** */

export type TypeMap = [
  [TsCurrentModule.ImportDeclaration, TsFourSevenModule.ImportDeclaration],
  [TsCurrentModule.Modifier, TsFourSevenModule.Modifier],
  [TsCurrentModule.ImportClause, TsFourSevenModule.ImportClause],
  [TsCurrentModule.Expression, TsFourSevenModule.Expression],
  [TsCurrentModule.AssertClause, TsFourSevenModule.AssertClause],
  [TsCurrentModule.ExportDeclaration, TsFourSevenModule.ExportDeclaration],
  [TsCurrentModule.NamedExportBindings, TsFourSevenModule.NamedExportBindings],
  [TsCurrentModule.ModuleDeclaration, TsFourSevenModule.ModuleDeclaration],
  [TsCurrentModule.ModuleName, TsFourSevenModule.ModuleName],
  [TsCurrentModule.ModuleBody, TsFourSevenModule.ModuleBody],
];

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export const predicate = ({ tsVersionMajor, tsVersionMinor }: TsTransformPathsContext) =>
  tsVersionMajor == 4 && tsVersionMinor < 8;

export function handler(context: TsTransformPathsContext, prop: string | symbol) {
  const factory = context.tsFactory as unknown as TsFourSevenModule.NodeFactory;

  switch (prop) {
    case "updateImportDeclaration":
      return function (
        node: ImportDeclaration,
        modifiers: readonly Modifier[] | undefined,
        importClause: ImportClause | undefined,
        moduleSpecifier: Expression,
        assertClause: AssertClause | undefined,
      ) {
        const [dsNode, dsImportClause, dsModuleSpecifier, dsAssertClause] = downSample(
          node,
          importClause,
          moduleSpecifier,
          assertClause,
        );

        return factory.updateImportDeclaration(
          dsNode,
          dsNode.decorators,
          dsNode.modifiers,
          dsImportClause,
          dsModuleSpecifier,
          dsAssertClause,
        );
      };
    case "updateExportDeclaration":
      return function (
        node: ExportDeclaration,
        modifiers: readonly Modifier[] | undefined,
        isTypeOnly: boolean,
        exportClause: NamedExportBindings | undefined,
        moduleSpecifier: Expression | undefined,
        assertClause: AssertClause | undefined,
      ) {
        const [dsNode, dsExportClause, dsModuleSpecifier, dsAssertClause] = downSample(
          node,
          exportClause,
          moduleSpecifier,
          assertClause,
        );

        return factory.updateExportDeclaration(
          dsNode,
          dsNode.decorators,
          dsNode.modifiers,
          isTypeOnly,
          dsExportClause,
          dsModuleSpecifier,
          dsAssertClause,
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

        return factory.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
      };
    default:
      return (...args: any) => (<any>factory)[prop](...args);
  }
}

export function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T> {
  return <any>args;
}

// endregion
