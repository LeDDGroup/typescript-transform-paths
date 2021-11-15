import type TSNode from 'ts-node';
import type { REGISTER_INSTANCE } from 'ts-node';
import type TS from 'typescript';
import { transformer } from '../transform';

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

const checkModuleIsTsTp = (m: string) => {
  let transformerModule: any;
  try {
    transformerModule = require(m);
  } catch {}

  if (!transformerModule) return m === 'typescript-transform-paths';

  return transformerModule.isTsTp;
};

function getProjectTransformerConfig(pcl: TS.ParsedCommandLine) {
  const plugins = pcl.options.plugins as Record<string, string>[] | undefined;
  if (!plugins) return;

  const res: { afterDeclarations?: Record<string, string>; before?: Record<string, string> } = {};
  for (const plugin of plugins) {
    if (plugin.transform && checkModuleIsTsTp(plugin.transform) && !plugin.after)
      res[plugin.afterDeclarations ? 'afterDeclarations' : 'before'] = plugin;
  }

  return res;
}

function getTransformers(
  program?: TS.Program,
  beforeConfig?: Record<string, string>,
  afterDeclarationsConfig?: Record<string, string>
): TS.CustomTransformers {
  return {
    ...(beforeConfig && { before: [transformer(program, beforeConfig)] }),
    ...(afterDeclarationsConfig && { afterDeclarations: [transformer(program, afterDeclarationsConfig)] }),
  } as TS.CustomTransformers;
}

export function mergeTransformers(
  baseTransformers: TS.CustomTransformers,
  transformers: TS.CustomTransformers
): TS.CustomTransformers {
  const res = {
    ...((baseTransformers.before || transformers.before) && {
      before: [...(transformers.before ?? []), ...(baseTransformers.before ?? [])],
    }),
    ...((baseTransformers.afterDeclarations || transformers.afterDeclarations) && {
      afterDeclarations: [...(transformers.afterDeclarations ?? []), ...(baseTransformers.afterDeclarations ?? [])],
    }),
  };

  const remainingBaseTransformers = { ...baseTransformers };
  delete remainingBaseTransformers.before;
  delete remainingBaseTransformers.afterDeclarations;

  return Object.assign(res, remainingBaseTransformers);
}

// endregion

/* ****************************************************************************************************************** */
// region: TsNode Registration Utility
/* ****************************************************************************************************************** */

export function nodeRegister(): TSNode.Service | undefined {
  const { tsNodeInstance, tsNode } = nodeRegister.initialize();

  const transformerConfig = getProjectTransformerConfig(tsNodeInstance.config);
  if (!transformerConfig) return;

  const { before: beforeConfig, afterDeclarations: afterDeclarationsConfig } = transformerConfig;

  const registerOptions: TSNode.RegisterOptions = Object.assign({}, tsNodeInstance.options);
  if (registerOptions.transformers) {
    if (typeof registerOptions.transformers === 'function') {
      let oldTransformersFactory = registerOptions.transformers;
      registerOptions.transformers = (program) => {
        const transformers = getTransformers(program, beforeConfig, afterDeclarationsConfig);
        const baseTransformers = oldTransformersFactory(program);
        return mergeTransformers(baseTransformers, transformers);
      };
    } else {
      registerOptions.transformers = mergeTransformers(
        registerOptions.transformers,
        getTransformers(undefined, beforeConfig, afterDeclarationsConfig)
      );
    }
  } else {
    registerOptions.transformers = getTransformers(undefined, beforeConfig, afterDeclarationsConfig);
  }

  // Re-register with new transformers
  return tsNode.register(registerOptions);
}

export namespace nodeRegister {
  export function initialize(): {
    tsNode: typeof TSNode;
    instanceSymbol: typeof REGISTER_INSTANCE;
    tsNodeInstance: TSNode.Service;
  } {
    let tsNode: typeof TSNode;
    try {
      tsNode = require('ts-node');
    } catch {
      throw new Error(
        `Cannot resolve ts-node. Make sure ts-node is installed before using typescript-transform-paths/register`
      );
    }

    const instanceSymbol: typeof REGISTER_INSTANCE = tsNode['REGISTER_INSTANCE'];

    let tsNodeInstance = global.process[instanceSymbol];
    if (!tsNodeInstance) {
      tsNode.register(); // Register initially
      tsNodeInstance = global.process[instanceSymbol];
    }
    if (!tsNodeInstance) throw new Error(`Could not register ts-node instance!`);

    return { tsNode, instanceSymbol, tsNodeInstance };
  }
}

// endregion
