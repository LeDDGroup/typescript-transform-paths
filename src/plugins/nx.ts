// See nx-transformer-plugin.ts
// https://github.com/nrwl/nx/blob/229f71ef1758ee625869aaa6fa6355dc3284fa5b/packages/js/src/utils/typescript/types.ts#L19-L32
// https://github.com/nrwl/nx/blob/master/packages/js/src/utils/typescript/load-ts-transformers.ts
import ts from "typescript";

import transformer from "../transformer.ts";

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
  pluginConfig?.afterDeclarations ? transformer(program, { ...pluginConfig }) : voidTransformer;
