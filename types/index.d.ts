import TSNode from 'ts-node'
import ts from 'typescript'
import { NXTransformerPlugin } from '../src/nxTransformerPlugin';

/* ****************************************************************************************************************** *
 * Hardcoded declarations file for npm package
 * ****************************************************************************************************************** */

export interface TsTransformPathsConfig {
  readonly useRootDirs?: boolean;
  readonly exclude?: string[];
  readonly before?: boolean;
  readonly afterDeclarations?: boolean;
  readonly tsConfig?: string;
  readonly transform?: string
}

export interface TransformerExtras {
  /**
   * Originating TypeScript instance
   */
  ts: typeof ts;
}

export function register(): TSNode.RegisterOptions | undefined

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
  }
): ts.CustomTransformer

export const nxTransformerPlugin: NXTransformerPlugin
