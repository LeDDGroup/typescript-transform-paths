import transformer from "../transformer";
import ts from "typescript";

export interface TsTransformPathsConfig {
  readonly useRootDirs?: boolean;
  readonly exclude?: string[];
  readonly afterDeclarations?: boolean;
  readonly tsConfig?: string;
  readonly transform?: string;
}

export type NxTransformerFactory = (
  config?: Omit<TsTransformPathsConfig, "transform">,
  program?: ts.Program,
) => ts.TransformerFactory<ts.SourceFile>;

export interface NxTransformerPlugin {
  before: NxTransformerFactory;
  afterDeclarations: NxTransformerFactory;
}

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
