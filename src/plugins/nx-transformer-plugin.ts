import { NxTransformerPlugin } from "../../types";
import transformer from "../transformer";
import ts from "typescript";

/* ****************************************************************************************************************** *
 * Locals
 * ****************************************************************************************************************** */

const voidTransformer: ts.TransformerFactory<ts.SourceFile> = () => (s: ts.SourceFile) => s;

/* ****************************************************************************************************************** *
 * Transformer
 * ****************************************************************************************************************** */

export const nxTransformerPlugin: NxTransformerPlugin = {
  before: (pluginConfig, program) =>
    pluginConfig?.afterDeclarations ? voidTransformer : transformer(program, { ...pluginConfig }),
  afterDeclarations: (pluginConfig, program) =>
    !pluginConfig?.afterDeclarations ? voidTransformer : transformer(program, { ...pluginConfig }),
};
