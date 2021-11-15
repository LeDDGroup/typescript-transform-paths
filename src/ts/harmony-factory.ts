import TS from 'typescript';

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface HarmonyFactory extends TS.NodeFactory {}

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

// Leave this for now, as it serves as an example for when factory diverges again

// function getTs3Prop(instance: typeof TsThree, prop: string | symbol) {
//   switch (prop) {
//     case "updateCallExpression":
//       return (...args: any) => instance.updateCall.apply(void 0, args);
//     case "updateImportClause":
//       return function (
//         node: TsThree.ImportClause,
//         isTypeOnly: boolean,
//         name: TsThree.Identifier | undefined,
//         namedBindings: TsThree.NamedImportBindings | undefined
//       ) {
//         return instance.updateImportClause(node, name, namedBindings);
//       };
//     case "createImportClause":
//       return function (
//         name: TsThree.Identifier | undefined,
//         isTypeOnly: boolean,
//         namedBindings: TsThree.NamedImportBindings | undefined
//       ) {
//         return instance.createImportClause(name, namedBindings);
//       };
//     case "updateExportDeclaration":
//       return function (
//         node: TsThree.ExportDeclaration,
//         decorators: readonly TsThree.Decorator[] | undefined,
//         modifiers: readonly TsThree.Modifier[] | undefined,
//         isTypeOnly: boolean,
//         exportClause: TsThree.NamedExports | undefined,
//         moduleSpecifier: TsThree.Expression | undefined
//       ) {
//         return instance.updateExportDeclaration(
//           node,
//           node.decorators,
//           node.modifiers,
//           exportClause,
//           moduleSpecifier,
//           // @ts-ignore - This was added in later versions of 3.x
//           node.isTypeOnly
//         );
//       };
//     case "createExportDeclaration":
//       return function (
//         decorators: readonly TsThree.Decorator[] | undefined,
//         modifiers: readonly TsThree.Modifier[] | undefined,
//         isTypeOnly: boolean,
//         exportClause: TsThree.NamedExports | undefined,
//         moduleSpecifier: TsThree.Expression | undefined
//       ) {
//         return instance.createExportDeclaration(
//           decorators,
//           modifiers,
//           exportClause,
//           moduleSpecifier,
//           // @ts-ignore - This was added in later versions of 3.x
//           isTypeOnly
//         );
//       };
//     default:
//       return (...args: any) => (<any>instance)[prop](...args);
//   }
// }

/**
 * Creates a factory capable of working with any TS version using modern parameters
 */
export function createHarmonyFactory(tsInstance: typeof TS, factory: TS.NodeFactory | undefined): HarmonyFactory {
  const [majorVer, minorVer] = tsInstance.versionMajorMinor.split('.');

  return new Proxy(factory ?? tsInstance, {
    get(target, prop) {
      // if (!factory) return getTs3Prop(cast<typeof TsThree>(tsInstance), prop);

      // For 4.0 - 4.4
      if (+majorVer < 4 || +minorVer < 5) return (<any>target)[prop];

      // TODO - Handle 4.5
      return (<any>target)[prop];
    },
  }) as HarmonyFactory;
}

// endregion
