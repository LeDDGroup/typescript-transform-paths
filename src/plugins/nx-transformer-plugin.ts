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

export const before: NxTransformerFactory = (pluginConfig, program) =>
  pluginConfig?.afterDeclarations ? voidTransformer : transformer(program, { ...pluginConfig });

export const afterDeclarations: NxTransformerFactory = (pluginConfig, program) =>
  !pluginConfig?.afterDeclarations ? voidTransformer : transformer(program, { ...pluginConfig });
