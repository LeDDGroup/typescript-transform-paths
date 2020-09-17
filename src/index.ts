import path from "path";
import {} from "ts-expose-internals";
import { PluginConfig } from "ttypescript/lib/PluginCreator";
import ts from "typescript";
import url from "url";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface TsTransformPathsConfig {
  useRootDirs?: boolean;
}

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

const getImplicitExtensions = (options: ts.CompilerOptions) => {
  let res: string[] = [".ts", ".d.ts"];

  let { allowJs, jsx, resolveJsonModule: allowJson } = options;
  const allowJsx = !!jsx && <any>jsx !== ts.JsxEmit.None;

  allowJs && res.push(".js");
  allowJsx && res.push(".tsx");
  allowJs && allowJsx && res.push(".jsx");
  allowJson && res.push(".json");

  return res;
};

const isURL = (s: string): boolean =>
  !!s && (!!url.parse(s).host || !!url.parse(s).hostname);
const isBaseDir = (base: string, dir: string) =>
  path.relative(base, dir)?.[0] !== ".";

const isRequire = (node: ts.Node): node is ts.CallExpression =>
  ts.isCallExpression(node) &&
  ts.isIdentifier(node.expression) &&
  node.expression.text === "require" &&
  ts.isStringLiteral(node.arguments[0]) &&
  node.arguments.length === 1;

const isAsyncImport = (node: ts.Node): node is ts.CallExpression =>
  ts.isCallExpression(node) &&
  node.expression.kind === ts.SyntaxKind.ImportKeyword &&
  ts.isStringLiteral(node.arguments[0]) &&
  node.arguments.length === 1;

// endregion

/* ****************************************************************************************************************** *
 * Transformer
 * ****************************************************************************************************************** */

export default function transformer(
  program: ts.Program,
  config: PluginConfig & TsTransformPathsConfig
) {
  const { useRootDirs } = config;
  const compilerOptions = program.getCompilerOptions();
  const implicitExtensions = getImplicitExtensions(compilerOptions);

  return (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => {
    // TS 4 - new node factory
    const factory: ts.NodeFactory | undefined = context.factory;

    const { fileName } = sourceFile;
    const fileDir = ts.normalizePath(path.dirname(fileName));
    const { baseUrl } = compilerOptions;
    if (!baseUrl || !compilerOptions.paths) return sourceFile;

    let rootDirs = compilerOptions.rootDirs?.filter(path.isAbsolute);

    return ts.visitEachChild(sourceFile, visit, context);

    /* ********************************************************* *
     * Transformer Helpers
     * ********************************************************* */

    /**
     * Gets proper path and calls updaterFn to update the node
     */
    function update(
      original: ts.Node,
      moduleName: string,
      updaterFn: (newPath: ts.StringLiteral) => ts.Node
    ): ts.Node {
      let p: string;

      /* Have Compiler API attempt to resolve */
      const { resolvedModule, failedLookupLocations } = ts.resolveModuleName(
        moduleName,
        fileName,
        compilerOptions,
        ts.sys
      );

      if (!resolvedModule) {
        const maybeURL = failedLookupLocations[0];
        if (!isURL(maybeURL)) return original;
        p = maybeURL;
      } else if (resolvedModule.isExternalLibraryImport) return original;
      else {
        const { extension, resolvedFileName } = resolvedModule;

        let filePath = fileDir;
        let modulePath = path.dirname(resolvedFileName);

        /* Handle rootDirs mapping */
        if (useRootDirs && rootDirs) {
          let fileRootDir = "";
          let moduleRootDir = "";
          for (const rootDir of rootDirs) {
            if (
              isBaseDir(rootDir, resolvedFileName) &&
              rootDir.length > moduleRootDir.length
            )
              moduleRootDir = rootDir;
            if (
              isBaseDir(rootDir, fileName) &&
              rootDir.length > fileRootDir.length
            )
              fileRootDir = rootDir;
          }

          /* Remove base dirs to make relative to root */
          if (fileRootDir && moduleRootDir) {
            filePath = path.relative(fileRootDir, filePath);
            modulePath = path.relative(moduleRootDir, modulePath);
          }
        }

        /* Remove extension if implicit */
        p = ts.normalizePath(
          path.join(
            path.relative(filePath, modulePath),
            path.basename(resolvedFileName)
          )
        );
        if (extension && implicitExtensions.includes(extension))
          p = p.slice(0, -extension.length);
        if (!p) return original;

        p = p[0] === "." ? p : `./${p}`;
      }

      return updaterFn(ts.createLiteral(p));
    }

    /**
     * Visit and replace nodes with module specifiers
     */
    function visit(node: ts.Node): ts.Node | undefined {
      /* Update require() or import() */
      if (isRequire(node) || isAsyncImport(node))
        return update(node, (<ts.StringLiteral>node.arguments[0]).text, (p) =>
          factory
            ? factory.updateCallExpression(
                node,
                node.expression,
                node.typeArguments,
                [p]
              )
            : ts.updateCall(node, node.expression, node.typeArguments, [p])
        );

      /* Update ExternalModuleReference - import foo = require("foo"); */
      if (
        ts.isExternalModuleReference(node) &&
        ts.isStringLiteral(node.expression)
      )
        return update(node, node.expression.text, (p) =>
          factory
            ? factory.updateExternalModuleReference(node, p)
            : ts.updateExternalModuleReference(node, p)
        );

      /**
       * Update ImportDeclaration / ExportDeclaration
       * import ... 'module';
       * export ... 'module';
       *
       * This implements a workaround for the following TS issues:
       * @see https://github.com/microsoft/TypeScript/issues/40603
       * @see https://github.com/microsoft/TypeScript/issues/31446
       */
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        return update(node, node.moduleSpecifier.text, (p) =>
          factory
            ? Object.assign(node, {
                moduleSpecifier: p,
              })
            : Object.assign(node, {
                moduleSpecifier: (<any>ts).updateNode(p, node.moduleSpecifier),
              })
        );

      /* Update ImportTypeNode - typeof import("./bar"); */
      if (ts.isImportTypeNode(node)) {
        const argument = node.argument as ts.LiteralTypeNode;
        if (!ts.isStringLiteral(argument.literal)) return node;
        const { text } = argument.literal;

        return !text
          ? node
          : update(node, text, (p) =>
              factory
                ? factory.updateImportTypeNode(
                    node,
                    factory.updateLiteralTypeNode(argument, p),
                    node.qualifier,
                    node.typeArguments,
                    node.isTypeOf
                  )
                : ts.updateImportTypeNode(
                    node,
                    ts.updateLiteralTypeNode(argument, p),
                    node.qualifier,
                    node.typeArguments,
                    node.isTypeOf
                  )
            );
      }

      return ts.visitEachChild(node, visit, context);
    }
  };
}
