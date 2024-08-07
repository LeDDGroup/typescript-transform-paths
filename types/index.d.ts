import ts from "typescript";
export { default as register } from "./register";

/* ****************************************************************************************************************** *
 * Hardcoded declarations file for npm package
 * ****************************************************************************************************************** */

export interface TsTransformPathsConfig {
  readonly useRootDirs?: boolean;
  readonly exclude?: string[];
  readonly afterDeclarations?: boolean;
  readonly tsConfig?: string;
  readonly transform?: string;
}

export interface TransformerExtras {
  /**
   * Originating TypeScript instance
   */
  ts: typeof ts;
}

export default function transformer(
  program?: ts.Program,
  pluginConfig?: TsTransformPathsConfig,
  transformerExtras?: TransformerExtras,
  /**
   * Supply if manually transforming with compiler API via 'transformNodes' / 'transformModule'
   */
  manualTransformOptions?: {
    compilerOptions?: ts.CompilerOptions;
    fileNames?: string[];
  },
): ts.CustomTransformerFactory;

/* ****************************************************************************************************************** *
 * NX
 * ****************************************************************************************************************** */

export type NxTransformerFactory = (
  config?: Omit<TsTransformPathsConfig, "transform">,
  program?: ts.Program,
) => ts.TransformerFactory<ts.SourceFile>;

export interface NxTransformerPlugin {
  before: NxTransformerFactory;
  afterDeclarations: NxTransformerFactory;
}

export const nxTransformerPlugin: NxTransformerPlugin;
