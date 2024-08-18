import TS from "typescript";
import { TsTransformPathsContext } from "../types";
import { TsFourSeven, TsThreeEight } from "./versions";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface HarmonyFactory extends TS.NodeFactory {}

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/** Creates a node factory compatible with TS v3+ */
export function createHarmonyFactory(context: TsTransformPathsContext): HarmonyFactory {
  return new Proxy(context.tsFactory ?? context.tsInstance, {
    get(target, prop) {
      if (TsThreeEight.predicate(context)) {
        return TsThreeEight.handler(context, prop);
      } else if (TsFourSeven.predicate(context)) {
        return TsFourSeven.handler(context, prop);
      } else {
        return (<any>target)[prop];
      }
    },
  }) as HarmonyFactory;
}

// endregion
