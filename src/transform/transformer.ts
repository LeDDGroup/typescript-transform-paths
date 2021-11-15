import path from 'path';
import type TS from 'typescript';
import {
  ManualTransformOptions,
  PathResolver,
  TransformerConfig,
  TransformerContext,
  TransformerExtras,
  TransformerOptions,
  VisitorContext,
} from '../types';
import { nodeVisitor } from './visitor';
import { checkTsSupport, createHarmonyFactory, createSyntheticEmitHost, getTsNodeRegistrationProperties } from '../ts';
import { Minimatch } from 'minimatch';
import { IndexChecker } from '../resolve/index-checker';

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function getTsDetail(p: {
  program: TS.Program | undefined;
  extras: TransformerExtras | undefined;
  manualTransformOptions: ManualTransformOptions | undefined;
  transformationContext: TS.TransformationContext;
}) {
  let tsInstance: typeof TS;
  let compilerOptions: TS.CompilerOptions;
  let fileNames: readonly string[] | undefined;
  let isTranspileOnly = false;
  let isTsNode = false;

  const { program, extras, manualTransformOptions, transformationContext } = p;

  tsInstance = extras?.ts ?? require('typescript');
  checkTsSupport(tsInstance);

  compilerOptions = manualTransformOptions?.compilerOptions!;

  /* Handle ts-node */
  const tsNodeProps = getTsNodeRegistrationProperties(tsInstance);
  if (tsNodeProps) isTsNode = true;

  /* Fixup options based on transform type */
  if (program) {
    compilerOptions ??= Object.assign({}, program.getCompilerOptions(), tsNodeProps?.compilerOptions);
  } else if (manualTransformOptions) {
    fileNames = manualTransformOptions.fileNames;
  } else {
    if (!tsNodeProps)
      throw new Error(
        `Cannot transform without a Program, ts-node instance, or manual parameters supplied. ` +
          `Make sure you're using ts-patch or ts-node with transpileOnly.`
      );
    isTranspileOnly = true;
    compilerOptions = tsNodeProps.compilerOptions;
    fileNames = tsNodeProps.fileNames;
  }

  /* Get EmitHost */
  const getCanonicalFileName = tsInstance.createGetCanonicalFileName(tsInstance.sys.useCaseSensitiveFileNames);

  let emitHost = transformationContext.getEmitHost();
  if (!emitHost || (isTsNode && isTranspileOnly)) {
    if (!fileNames)
      throw new Error(
        `No EmitHost found and could not determine files to be processed. Please file an issue with a reproduction!`
      );
    emitHost = createSyntheticEmitHost(compilerOptions, tsInstance, getCanonicalFileName, fileNames as string[]);
  }

  const projectReferences = program?.getResolvedProjectReferences()?.map((r) => r?.sourceFile);

  return { tsInstance, compilerOptions, fileNames, isTranspileOnly, isTsNode, emitHost, projectReferences };
}

function loadResolver(p: string): PathResolver {
  const resolver = require(p).default;
  if (typeof resolver !== 'function')
    throw new Error(`Cannot load resolver! Resolver file must export a resolver function as default`);

  return resolver;
}

/** @internal - Used by UT */
export function getTransformerConfig(options?: TransformerOptions): TransformerConfig {
  return {
    ...options,
    outputIndexes: options?.outputIndexes || 'auto',
    outputExtensions: options?.outputExtensions || 'auto',
    usePaths: options?.usePaths ?? true,
  };
}

// endregion

/* ****************************************************************************************************************** */
// region: Transformer
/* ****************************************************************************************************************** */

export function transformer(
  program?: TS.Program,
  options?: TransformerOptions,
  extras?: TransformerExtras,
  /**
   * Supply if manually transforming with compiler API via 'transformNodes' / 'transformModule'
   */
  manualTransformOptions?: ManualTransformOptions
) {
  return (transformationContext: TS.TransformationContext) => {
    const config = getTransformerConfig(options);
    const { tsInstance, compilerOptions, isTranspileOnly, isTsNode, emitHost } = getTsDetail({
      program,
      extras,
      manualTransformOptions,
      transformationContext,
    });

    const rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);
    const { configFile, paths } = compilerOptions;
    const resolver = config.resolver ? loadResolver(config.resolver) : void 0;

    // Older TS does not have this, so we type it accordingly to determine path parse method
    const tryParsePatterns: typeof TS.tryParsePatterns | undefined = tsInstance.tryParsePatterns;

    const tsTransformPathsContext: TransformerContext = {
      compilerOptions,
      config,
      elisionMap: new Map(),
      tsFactory: transformationContext.factory,
      program,
      rootDirs,
      transformationContext: transformationContext,
      tsInstance,
      emitHost,
      resolver,
      isTranspileOnly,
      isTsNode,
      indexChecker: new IndexChecker(tsInstance),
      excludeMatchers: config.exclude?.map((globPattern) => new Minimatch(globPattern, { matchBase: true })),
      outputFileNamesCache: new Map(),
      pathsPatterns:
        paths &&
        (tryParsePatterns
          ? configFile?.configFileSpecs?.pathPatterns || tryParsePatterns(paths)
          : tsInstance.getOwnKeys(paths)),
    };

    return (sourceFile: TS.SourceFile) => {
      const visitorContext: VisitorContext = {
        ...tsTransformPathsContext,
        sourceFile,
        isDeclarationFile: sourceFile.isDeclarationFile,
        originalSourceFile: (<typeof TS>tsInstance).getOriginalSourceFile(sourceFile),
        getVisitor() {
          return nodeVisitor.bind(this);
        },
        factory: createHarmonyFactory(tsInstance, transformationContext.factory),
      };

      return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
    };
  };
}

// endregion
