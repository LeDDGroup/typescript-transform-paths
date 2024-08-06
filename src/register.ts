import type TSNode from "ts-node";
import type { REGISTER_INSTANCE } from "ts-node";
import ts from "typescript";
import transformer from "./transformer";

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function getProjectTransformerConfig(pcl: ts.ParsedCommandLine) {
  const plugins = pcl.options.plugins as Record<string, string>[] | undefined;
  if (!plugins) return;

  const res: { afterDeclarations?: Record<string, string>; before?: Record<string, string> } = {};
  for (const plugin of plugins) {
    if (plugin.transform === "typescript-transform-paths" && !plugin.after)
      res[plugin.afterDeclarations ? "afterDeclarations" : "before"] = plugin;
  }

  return res;
}

function getTransformers(
  program?: ts.Program,
  beforeConfig?: Record<string, string>,
  afterDeclarationsConfig?: Record<string, string>,
): ts.CustomTransformers {
  return {
    ...(beforeConfig && { before: [transformer(program, beforeConfig)] }),
    ...(afterDeclarationsConfig && { afterDeclarations: [transformer(program, afterDeclarationsConfig)] }),
  } as ts.CustomTransformers;
}

export function mergeTransformers(
  baseTransformers: ts.CustomTransformers,
  transformers: ts.CustomTransformers,
): ts.CustomTransformers {
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

export function register(): TSNode.RegisterOptions | undefined {
  const { tsNodeInstance, tsNode } = register.initialize();

  const transformerConfig = getProjectTransformerConfig(tsNodeInstance.config);
  if (!transformerConfig) return;

  const { before: beforeConfig, afterDeclarations: afterDeclarationsConfig } = transformerConfig;

  const registerOptions: TSNode.RegisterOptions = Object.assign({}, tsNodeInstance.options);
  if (registerOptions.transformers) {
    if (typeof registerOptions.transformers === "function") {
      let oldTransformersFactory = registerOptions.transformers;
      registerOptions.transformers = (program) => {
        const transformers = getTransformers(program, beforeConfig, afterDeclarationsConfig);
        const baseTransformers = oldTransformersFactory(program);
        return mergeTransformers(baseTransformers, transformers);
      };
    } else {
      registerOptions.transformers = mergeTransformers(
        registerOptions.transformers,
        getTransformers(undefined, beforeConfig, afterDeclarationsConfig),
      );
    }
  } else {
    registerOptions.transformers = getTransformers(undefined, beforeConfig, afterDeclarationsConfig);
  }

  // Re-register with new transformers
  tsNode.register(registerOptions);
  return registerOptions;
}

export namespace register {
  export function initialize(): {
    tsNode: typeof TSNode;
    instanceSymbol: typeof REGISTER_INSTANCE;
    tsNodeInstance: TSNode.Service;
  } {
    let tsNode: typeof TSNode;
    try {
      tsNode = require("ts-node");
    } catch {
      throw new Error(
        `Cannot resolve ts-node. Make sure ts-node is installed before using typescript-transform-paths/register`,
      );
    }

    const instanceSymbol: typeof REGISTER_INSTANCE = tsNode["REGISTER_INSTANCE"];

    let tsNodeInstance = global.process[instanceSymbol];
    if (!tsNodeInstance) {
      tsNode.register(); // Register initially
      tsNodeInstance = global.process[instanceSymbol];
    }
    if (!tsNodeInstance) throw new Error(`Could not register ts-node instance!`);

    return { tsNode, instanceSymbol, tsNodeInstance };
  }
}

export default register;

// endregion
