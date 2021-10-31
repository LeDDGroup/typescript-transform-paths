import ts, { Node, SourceFile } from "typescript";
import { UnderscoreTestContext } from "../types";

/* ****************************************************************************************************************** *
 * Node Helpers
 * ****************************************************************************************************************** */

export const isAsyncImport = (tsInstance: typeof ts, node: ts.Node): node is ts.CallExpression =>
  tsInstance.isCallExpression(node) &&
  node.expression.kind === tsInstance.SyntaxKind.ImportKeyword &&
  tsInstance.isStringLiteral(node.arguments[0]) &&
  node.arguments.length === 1;

export const isRequire = (tsInstance: typeof ts, node: ts.Node): node is ts.CallExpression =>
  tsInstance.isCallExpression(node) && node.expression &&
  tsInstance.isIdentifier(node.expression) &&
  node.expression.text === "require" &&
  tsInstance.isStringLiteral(node.arguments[0]) &&
  node.arguments.length === 1;

export function getFirstOriginal<T extends Node>(node: T): T {
  for (let n: any = node; n; n = n.original)
    if (!n.original) return n;

  return node;
}

export function getString({ ts, printer }: UnderscoreTestContext, node: Node, sourceFile: SourceFile): string {
  const res: string | undefined =
    ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text :
    void 0;

  if (!res) throw new Error(`Expression is not a string! Expression: ${getFirstOriginal(node).getText(sourceFile)}`);
  return res;
}

export function getStringOrFunctionOrObjectLiteral<T>(ctx: UnderscoreTestContext, node: Node, sourceFile: SourceFile): T {
  try {
    return getStringOrFunction<unknown>(ctx, node, sourceFile) as T;
  } catch {
    try {
      return getObjectLiteral<unknown>(ctx, node, sourceFile) as T;
    } catch {
      throw new Error(`Expression is not a valid string, function, or object literal. Expression ${getFirstOriginal(node).getText(sourceFile)}`);
    }
  }
}

export function getStringOrFunction<T>({ ts, printer }: UnderscoreTestContext, node: Node, sourceFile: SourceFile): T {
  const res: string | Function | undefined =
    ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text :
    ts.isArrowFunction(node) || ts.isFunctionExpression(node) ? eval(`(${printer.printNode(ts.EmitHint.Expression, node, sourceFile)})`) as Function :
    void 0;

  if (!res) throw new Error(`Expression is not a string or function! Expression: ${getFirstOriginal(node).getText(sourceFile)}`);
  return res as unknown as T;
}

export function getObjectLiteral<T>({ ts, printer }: UnderscoreTestContext, node: Node, sourceFile: SourceFile): T {
  const res: object | undefined = ts.isObjectLiteralExpression(node)
                                  ? eval(`(${printer.printNode(ts.EmitHint.Expression, node, sourceFile)})`)
                                  : void 0;

  if (!res) throw new Error(`Expression is not an object literal! Expression: ${getFirstOriginal(node).getText(sourceFile)}`);
  return res as unknown as T;
}
