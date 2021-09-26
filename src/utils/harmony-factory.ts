import TS, {
  Decorator,
  ExportDeclaration,
  Expression,
  Identifier,
  ImportClause,
  Modifier,
  NamedExportBindings,
  NamedImportBindings,
} from "typescript";
import { cast } from "./general-utils";
import * as TsThree from '../declarations/typescript3';
import { TsTransformPathsContext } from "../types";
import { downSampleTsTypes } from "./ts-type-conversion";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface HarmonyFactory extends TS.NodeFactory {}

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Creates a node factory compatible with TS v3+
 */
export function createHarmonyFactory(context: TsTransformPathsContext): HarmonyFactory {
  const { tsInstance } = context;
  const tsThreeInstance = cast<typeof TsThree>(tsInstance);

  return new Proxy(context.tsFactory ?? context.tsInstance, {
    get(target, prop) {
      if (context.tsFactory) return (<any>target)[prop];

      switch (prop) {
        case "updateCallExpression":
          return (...args: any) => tsThreeInstance.updateCall.apply(void 0, args);
        case "updateImportClause":
          return function (
            node: ImportClause,
            isTypeOnly: boolean,
            name: Identifier | undefined,
            namedBindings: NamedImportBindings | undefined
          ) {
            return tsThreeInstance.updateImportClause.apply(void 0, downSampleTsTypes(node, name, namedBindings));
          };
        case "updateExportDeclaration":
          return function (
            node: ExportDeclaration,
            decorators: readonly Decorator[] | undefined,
            modifiers: readonly Modifier[] | undefined,
            isTypeOnly: boolean,
            exportClause: NamedExportBindings | undefined,
            moduleSpecifier: Expression | undefined
          ) {
            const [dsNode, dsModuleSpecifier, dsExportClause] = downSampleTsTypes(node, moduleSpecifier, exportClause);
            return tsThreeInstance.updateExportDeclaration(
              dsNode,
              dsNode.decorators,
              dsNode.modifiers,
              dsExportClause,
              dsModuleSpecifier,
              // @ts-ignore - This was added in later versions of 3.x
              dsNode.isTypeOnly
            );
          };
        default:
          return (...args: any) => (<any>tsThreeInstance)[prop](...args);
      }
    },
  }) as HarmonyFactory;
}

// endregion
