import type TS from "typescript";
import type { HarmonyFactory } from "./ts";
import type { IMinimatch } from "minimatch";
import { IndexChecker, IndexDetail } from "./resolve/index-checker";

/* ****************************************************************************************************************** */
// region: Config
/* ****************************************************************************************************************** */

export interface TransformerConfig {
  /**
   * Automatically remap directories according to tsconfig.json -> `rootDirs`
   * @default false
   */
  readonly useRootDirs?: boolean;

  /**
   * Transform using path mapping in tsconfig.json -> `paths`
   * @default true
   */
  readonly usePaths: boolean;

  /**
   * Method for handling implicit indexes
   * @example
   * // File: './dir/index.ts'
   *
   * // Output:
   * //  'auto': './dir'
   * //  'always': './dir/index'
   * //  'never': './dir'
   * import './dir'
   *
   * // Output:
   * //  'auto': './dir/index'
   * //  'always': './dir/index'
   * //  'never': './dir'
   * import './dir/index'
   *
   * // Package: 'pkg'
   * // Package `main` entry: 'dist/main.js'
   *
   * // Output:
   * //   'auto': 'pkg'
   * //   'always': 'pkg/dist/main.js'
   * //   'never: 'pkg'
   * import 'pkg';
   */
  readonly outputIndexes: 'auto' | 'always' | 'never'

  /**
   * Method for handling implicit extensions
   * @example
   * // File: './dir/index.ts'
   *
   * // Output:
   * //  'auto': './dir/index'
   * //  'always': './dir/index.js'
   * //  'never': './dir/index'
   * import './dir/index'
   *
   * // Output:
   * //  'auto': './dir/index.js'
   * //  'always': './dir/index.js'
   * //  'never': './dir/index'
   * import './dir/index.js'
   *
   * // Output:
   * //  'auto': './dir'
   * //  'always': './dir'
   * //  'never': './dir'
   * import './dir'
   */
  readonly outputExtensions: 'auto' | 'always' | 'never'

  /**
   * Transform Exclusion patterns — exclude from transform if file path matches pattern
   */
  readonly exclude?: string[];

  /**
   * Path to custom resolve middleware
   */
  readonly resolver?: string;
}

// endregion

/* ****************************************************************************************************************** */
// region: Resolver
/* ****************************************************************************************************************** */

export interface PathResolver {
  (ctx: ResolutionContext): string | undefined
}

export interface ResolutionContext {
  /**
   * Supplied module name
   *
   * @example
   * // moduleName = 'typescript-transform-paths/dist/index'
   * import './src/index';
   */
  moduleName: string

  /**
   * Supplied module name's extension (if specified)
   *
   * @example
   * // moduleExtName = undefined
   * import './src/index';
   * // moduleExtName = '.ts'
   * import './src/index.ts';
   */
  moduleExtName?: string

  /**
   * This is the path that will normally be output by the plugin
   */
  outputPath: string

  /**
   * Extension for output path
   */
  outputExt: string | undefined

  /**
   * If there is a match from tsconfig.json -> 'compilerOptions' -> 'paths', the matched key name will be here
   * @example
   * // tsconfig.json
   * {
   *   "compilerOptions": {
   *     "paths": {
   *       "#src/*": [ "./src/*" ]
   *     }
   *   }
   * }
   *
   * // tsPathsKey = '#src/*'
   * import '#src/hello';
   */
  tsPathsKey?: string

  /**
   * True if target is a URL
   */
  isURL: boolean

  /**
   * Info on resolved target (not supplied if module can't be resolved to file)
   */
  target?: {
    /**
     * If the resolved file is a symlink, this will be the initial resolved path (before following link)
     */
    originalPath?: string

    /**
     * Implicit index detail
     */
    indexDetail: IndexDetail

    /**
     * Final resolved file path (after following any symlink — for pre-follow, use `originalPath`)
     */
    resolvedFilePath: string

    /**
     * If module resolves to a sub-package within the current package or an external package, this is the sub-path within the package
     *
     * Note: This field is especially important with ESM, as it's possible for the import path not to correspond to the actual
     * resolved file path.
     */
    packagePath?: string

    /**
     * Resolved ts.SourceFile
     */
    sourceFile?: TS.SourceFile
  }

  /**
   * If the module resolves to a sub-package or external package, this contains that detail
   */
  package?: {
    /**
     * Name of the package according to its package.json
     *
     * @example
     * // packageName = '@scope/package'
     * import '@scope/package/dist/index';
     */
    packageName: string

    /**
     * Package name as specified
     * Note: In some cases, a package may be aliased so that the name used to import/require it does not match the package.json
     * If that is the case, the supplied name is here.
     *
     * @example
     * // package.json
     * {
     *   "dependencies": {
     *     "aliased-typescript": "npm:typescript@latest"
     *   }
     * }
     *
     * // packageName = 'typescript'
     * // originalPackageName = 'aliased-typescript'
     * import 'aliased-typescript';
     */
    originalPackageName?: string

    isExternalLibrary: boolean
  }

  /**
   * Context for visitor
   * @see https://github.com/LeDDGroup/typescript-transform-paths/blob/master/src/types.ts
   */
  visitorContext: VisitorContext

  /**
   * AST Node being transformed
   */
  node: TS.Node
}

// endregion

/* ****************************************************************************************************************** */
// region: Transformer
/* ****************************************************************************************************************** */

export type TransformerOptions = Partial<TransformerConfig>;

export interface ManualTransformOptions {
  compilerOptions?: TS.CompilerOptions;
  fileNames?: string[];
}

export interface TransformerContext {
  readonly tsInstance: typeof TS;
  readonly tsFactory?: TS.NodeFactory;
  readonly program?: TS.Program;
  readonly config: TransformerConfig;
  readonly compilerOptions: TS.CompilerOptions;
  readonly transformationContext: TS.TransformationContext;
  readonly rootDirs?: string[];
  readonly isTsNode: boolean;
  readonly isTranspileOnly: boolean;
  readonly resolver?: PathResolver;

  /** @internal - Do not remove internal flag — this uses an internal TS type */
  readonly pathsPatterns: readonly (string | TS.Pattern)[] | undefined;
  /** @internal - Do not remove internal flag — this uses an internal TS type */
  readonly emitHost: TS.EmitHost;

  /** @internal */
  indexChecker: IndexChecker
  /** @internal */
  readonly elisionMap: Map<TS.SourceFile, Map<ImportOrExportDeclaration, ImportOrExportDeclaration>>;
  /** @internal */
  readonly excludeMatchers: IMinimatch[] | undefined;
  /** @internal */
  readonly outputFileNamesCache: Map<TS.SourceFile, string>;
}

export interface VisitorContext extends TransformerContext {
  readonly factory: HarmonyFactory;
  readonly sourceFile: TS.SourceFile;
  readonly isDeclarationFile: boolean;
  readonly originalSourceFile: TS.SourceFile;

  /** @internal */
  getVisitor(): (node: TS.Node) => TS.VisitResult<TS.Node>;
}

// endregion

/* ****************************************************************************************************************** */
// region: Internal / External / Deprecated
/* ****************************************************************************************************************** */

/** @deprecated - use TransformerOptions */
export type TsTransformPathsConfig = TransformerOptions;

/** Represents Extras type passed by ttypescript or ts-patch */
export type TransformerExtras = {
  ts: typeof TS;
}

/** @internal */
export type ImportOrExportDeclaration = TS.ImportDeclaration | TS.ExportDeclaration;

/** @internal */
export type ImportOrExportClause = TS.ImportDeclaration["importClause"] | TS.ExportDeclaration["exportClause"];

// endregion
