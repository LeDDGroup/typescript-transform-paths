/** Changes after this point: https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes#typescript-48 */
import type {
  default as TsCurrentModule,
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
import type TsFourSevenModule from "typescript-4.7";
import type { TsTransformPathsContext } from "../../types";
import type { DownSampleTsTypes } from "../utils";

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
    case "updateImportDeclaration": {
      return function (
        node: ImportDeclaration,
        _modifiers: readonly Modifier[] | undefined,
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
    }
    case "updateExportDeclaration": {
      return function (
        node: ExportDeclaration,
        _modifiers: readonly Modifier[] | undefined,
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
    }
    case "updateModuleDeclaration": {
      return function (
        node: ModuleDeclaration,
        _modifiers: readonly Modifier[] | undefined,
        name: ModuleName,
        body: ModuleBody | undefined,
      ) {
        const [dsNode, dsName, dsBody] = downSample(node, name, body);

        return factory.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
      };
    }
    default: {
      // @ts-expect-error TS(7019) FIXME: Rest parameter 'args' implicitly has an 'any[]' type.
      return (...args) => factory[prop](...args);
    }
  }
}

export function downSample<T extends [...unknown[]]>(...args: T): DownSampleTsTypes<TypeMap, T> {
  // @ts-expect-error TS(2322) FIXME: Type 'T' is not assignable to type 'DownSampleTsTypes<TypeMap, T>'.
  return args;
}

// endregion
