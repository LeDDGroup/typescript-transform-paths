import TS from "typescript";
import { TsTransformPathsContext } from "../types";
import { TsFourSeven } from "./versions";

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
      if (TsFourSeven.predicate(context)) {
        return TsFourSeven.handler(context, prop);
      } else {
        // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expression of type 'string | symbol' can't be used to index type 'typeof import("typescript") | NodeFactory'.
        return target[prop];
      }
    },
  }) as HarmonyFactory;
}

// endregion
