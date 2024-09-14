import TS from "typescript";
import { TsTransformPathsContext } from "../types";

export interface HarmonyFactory extends TS.NodeFactory {}

/** Creates a node factory compatible with TS v3+ */
export function createHarmonyFactory(context: TsTransformPathsContext): HarmonyFactory {
  return (context.tsFactory ?? context.tsInstance) as HarmonyFactory;
}
