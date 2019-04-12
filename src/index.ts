import ts from "typescript";
import { dirname, resolve, relative } from "path";

const transformer = <T extends ts.Node>(_: ts.Program) => {
  return (context: ts.TransformationContext) => (rootNode: T) => {
    if (!is<ts.SourceFile>(rootNode, ts.SyntaxKind.SourceFile)) {
      return rootNode;
    }
    const compilerOptions = context.getCompilerOptions();
    // TODO should check if baseUrl and paths are defined
    const baseUrl = compilerOptions.baseUrl!;
    const paths = compilerOptions.paths!;
    const fileDir = dirname(rootNode.fileName);
    const regPaths = Object.keys(paths).map(key => ({
      regexp: new RegExp("^" + key.replace("*", "(.*)") + "$"),
      resolve: paths[key][0] // TODO should check if is not empty
    }));
    function visit(node: ts.Node): ts.Node {
      if (is<ts.ImportDeclaration>(node, ts.SyntaxKind.ImportDeclaration)) {
        if (
          is<ts.StringLiteral>(
            node.moduleSpecifier,
            ts.SyntaxKind.StringLiteral
          )
        ) {
          for (const path of regPaths) {
            const match = node.moduleSpecifier.text.match(path.regexp);
            if (match) {
              const out = path.resolve.replace(/\*/g, match[1]);
              const file = relative(fileDir, resolve(baseUrl, out));
              // If it's in the same level or below add the ./
              node.moduleSpecifier.text = file[0] === "." ? file : `./${file}`;
              break;
            }
          }
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
};

function is<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): node is T {
  return node.kind === kind;
}

export default transformer;
