import ts from "typescript";
import { TsTransformPathsConfig } from "../types";
import transformer from "./transformer";

type NXTransformer = (
  config?: Omit<TsTransformPathsConfig, "transform">,
  program?: ts.Program
) => ts.TransformerFactory<ts.SourceFile>;

export interface NXTransformerPlugin {
  before: NXTransformer;
  afterDeclarations: NXTransformer;
}

function getNxTransformer(phase: "before" | "afterDeclarations"): NXTransformer {
  return (pluginConfig, program) => {
    const config = { ...pluginConfig };
    delete config.before;
    if (phase === "before" && (pluginConfig?.before || !pluginConfig?.afterDeclarations)) {
      return transformer(program, { ...config, afterDeclarations: false });
    } else if (phase === "afterDeclarations" && pluginConfig?.afterDeclarations) {
      return transformer(program, { ...config, afterDeclarations: true });
    } else {
      return () => (sourceFile: ts.SourceFile) => sourceFile;
    }
  };
}

export const nxTransformerPlugin: NXTransformerPlugin = {
  before: getNxTransformer("before"),
  afterDeclarations: getNxTransformer("afterDeclarations"),
};
