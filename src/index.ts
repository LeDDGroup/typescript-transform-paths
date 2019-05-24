import * as ts from "typescript";
import { dirname, resolve, relative } from "path";
import slash = require("slash");

const transformer = (_: ts.Program) => (context: ts.TransformationContext) => (
  sourceFile: ts.SourceFile
) => {
  const resolver =
    typeof (context as any).getEmitResolver === "function"
      ? (context as any).getEmitResolver()
      : undefined;
  const compilerOptions = context.getCompilerOptions();
  const sourceDir = dirname(sourceFile.fileName);

  const { baseUrl = "", paths = {} } = compilerOptions;

  const binds = Object.keys(paths)
    .filter(key => paths[key].length)
    .map(key => ({
      regexp: new RegExp(`^${key.replace(/\*$/, "(.*)")}$`),
      paths: paths[key].map(p => resolve(baseUrl, p.replace(/\*$/, "")))
    }));

  if (!baseUrl || binds.length === 0) {
    // There is nothing we can do without baseUrl and paths specified.
    return sourceFile;
  }

  function bindModuleToFile(moduleName: string) {
    for (const { regexp, paths } of binds) {
      const match = regexp.exec(moduleName);
      if (match) {
        try {
          let file = require.resolve(match[1], { paths });
          file = file.replace(/\.\w+$/, "");
          file = relative(sourceDir, file);
          file = slash(file);
          file = file[0] === "." ? file : "./" + file;
          return file;
        } catch (error) {
          if (error.code !== "MODULE_NOT_FOUND") {
            throw error;
          }
        }
      }
    }
  }

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (
      resolver &&
      ts.isExportDeclaration(node) &&
      !node.exportClause &&
      !compilerOptions.isolatedModules &&
      !resolver.moduleExportsSomeValue(node.moduleSpecifier)
    ) {
      return undefined;
    }
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const file = bindModuleToFile(node.moduleSpecifier.text);
      if (file) {
        node.moduleSpecifier.text = file;
        return node;
      }
    }
    return ts.visitEachChild(node, visit, context);
  }

  return ts.visitNode(sourceFile, visit);
};

export default transformer;
