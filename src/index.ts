import { dirname, relative, resolve } from "path";
import ts from "typescript";
import slash from "slash";

const transformer = <T extends ts.Node>(_: ts.Program) => {
  return (context: ts.TransformationContext) => (rootNode: T) => {
    const compilerOptions = context.getCompilerOptions();
    if (
      compilerOptions.baseUrl === undefined ||
      compilerOptions.paths === undefined
    ) {
      throw new Error(
        "Should define baseUrl and paths properties in the tsconfig"
      );
    }
    const baseUrl = compilerOptions.baseUrl;
    const paths = compilerOptions.paths;
    const regPaths = Object.keys(paths)
      .map(key => ({
        regexp: new RegExp("^" + key.replace("*", "(.*)") + "$"),
        resolve: paths[key][0]
      }));
    let fileDir = "";
    function findFileInPaths(text: string) {
      for (const path of regPaths) {
        const match = text.match(path.regexp);
        if (match) {
          const out = path.resolve.replace(/\*/g, match[1]);
          const file = slash(relative(fileDir, resolve(baseUrl, out)));
          return file[0] === "." ? file : `./${file}`;
        }
      }
      return null;
    }
    function visit(node: ts.Node): ts.Node {
      if (ts.isSourceFile(node)) {
        fileDir = dirname(node.fileName);
        return ts.visitEachChild(node, visit, context);
      }
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const file = findFileInPaths(node.moduleSpecifier.text);
        if (file) {
          node.moduleSpecifier.text = file;
          return node;
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
};

export default transformer;
