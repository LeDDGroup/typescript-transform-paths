import { dirname, extname, relative, posix } from "path";
import ts from "typescript";
import { parse } from "url";
import { existsSync } from "fs";

const transformer = (_: ts.Program) => (context: ts.TransformationContext) => (
  sourceFile: ts.SourceFile
) => {
  const resolver =
    typeof (context as any).getEmitResolver === "function"
      ? (context as any).getEmitResolver()
      : undefined;
  const compilerOptions = context.getCompilerOptions();
  const sourceDir = dirname(sourceFile.fileName);

  const implicitExtensions = [".ts", ".d.ts"];

  const allowJs = compilerOptions.allowJs === true;
  const allowJsx =
    compilerOptions.jsx !== undefined &&
    compilerOptions.jsx !== ts.JsxEmit.None;
  const allowJson = compilerOptions.resolveJsonModule === true;

  allowJs && implicitExtensions.push(".js");
  allowJsx && implicitExtensions.push(".tsx");
  allowJs && allowJsx && implicitExtensions.push(".jsx");
  allowJson && implicitExtensions.push(".json");

  const { isDeclarationFile } = sourceFile;

  const { baseUrl = "", paths = {} } = compilerOptions;

  const binds = Object.keys(paths)
    .filter(key => paths[key].length)
    .map(key => ({
      regexp: new RegExp("^" + key.replace("*", "(.*)") + "$"),
      path: paths[key][0]
    }));

  if (!baseUrl || binds.length === 0) {
    // There is nothing we can do without baseUrl and paths specified.
    return sourceFile;
  }

  function isRelative(s: string) {
    return s[0] === ".";
  }

  function isUrl(s: string) {
    return parse(s).protocol !== null;
  }

  function fileExists(s: string) {
    // if has extensions, file must exist
    if (extname(s) !== "") return existsSync(s);
    // else check for implicit extensions .ts, .dts, etc...
    for (const ext of implicitExtensions) if (existsSync(s + ext)) return true;
    return false;
  }

  function bindModuleToFile(moduleName: string) {
    if (isRelative(moduleName)) {
      // if it's relative path do not transform
      return moduleName;
    }
    for (const { regexp, path } of binds) {
      const match = regexp.exec(moduleName);
      if (match) {
        const out = path.replace(/\*/g, match[1]);
        if (isUrl(out)) {
          return out;
        }
        const filepath = relative(baseUrl, out);
        if (!fileExists(`${filepath}/index`) && !fileExists(filepath)) continue;
        // use posix path for result
        const resolved = posix.relative(
          sourceDir,
          posix.relative(baseUrl, out)
        );
        return isRelative(resolved) ? resolved : `./${resolved}`;
      }
    }
    return undefined;
  }

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (
      !isDeclarationFile &&
      resolver &&
      ts.isExportDeclaration(node) &&
      !node.exportClause &&
      !compilerOptions.isolatedModules &&
      !resolver.moduleExportsSomeValue(node.moduleSpecifier)
    ) {
      return undefined;
    }
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "require" &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments.length === 1
    ) {
      const firstArg = node.arguments[0] as ts.StringLiteral;
      const file = bindModuleToFile(firstArg.text);
      if (!file) {
        return node;
      }
      const fileLiteral = ts.createLiteral(file);
      return ts.updateCall(node, node.expression, node.typeArguments, [
        fileLiteral
      ]);
    }
    if (ts.isExternalModuleReference(node)) {
      return unpathImportEqualsDeclaration(node);
    }
    if (ts.isImportDeclaration(node)) {
      return unpathImportDeclaration(node);
    }
    if (ts.isExportDeclaration(node)) {
      return unpathExportDeclaration(node);
    }

    return ts.visitEachChild(node, visit, context);
  }

  function unpathImportEqualsDeclaration(node: ts.ExternalModuleReference) {
    if (!ts.isStringLiteral(node.expression)) {
      return node;
    }
    const file = bindModuleToFile(node.expression.text);
    if (!file) {
      return node;
    }
    const fileLiteral = ts.createLiteral(file);

    return ts.updateExternalModuleReference(node, fileLiteral);
  }
  function unpathImportDeclaration(
    node: ts.ImportDeclaration
  ): ts.VisitResult<ts.Statement> {
    if (!ts.isStringLiteral(node.moduleSpecifier)) {
      return node;
    }
    const file = bindModuleToFile(node.moduleSpecifier.text);
    if (!file) {
      return node;
    }
    const fileLiteral = ts.createLiteral(file);

    const importClause = ts.visitNode(
      node.importClause,
      visitImportClause as any,
      ts.isImportClause
    );
    return node.importClause === importClause ||
      importClause ||
      isDeclarationFile
      ? ts.updateImportDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.importClause,
          fileLiteral
        )
      : undefined;
  }
  function visitImportClause(
    node: ts.ImportClause
  ): ts.VisitResult<ts.ImportClause> {
    const name = resolver.isReferencedAliasDeclaration(node)
      ? node.name
      : undefined;
    const namedBindings = ts.visitNode(
      node.namedBindings,
      visitNamedImportBindings as any,
      ts.isNamedImports
    );
    return name || namedBindings
      ? ts.updateImportClause(node, name, namedBindings)
      : undefined;
  }
  function visitNamedImportBindings(
    node: ts.NamedImportBindings
  ): ts.VisitResult<ts.NamedImportBindings> {
    if (node.kind === ts.SyntaxKind.NamespaceImport) {
      return resolver.isReferencedAliasDeclaration(node) ? node : undefined;
    } else {
      const elements = ts.visitNodes(
        node.elements,
        visitImportSpecifier as any,
        ts.isImportSpecifier
      );
      return elements.some(e => e)
        ? ts.updateNamedImports(node, elements)
        : undefined;
    }
  }
  function visitImportSpecifier(
    node: ts.ImportSpecifier
  ): ts.VisitResult<ts.ImportSpecifier> {
    return resolver.isReferencedAliasDeclaration(node) ? node : undefined;
  }

  function unpathExportDeclaration(
    node: ts.ExportDeclaration
  ): ts.VisitResult<ts.Statement> {
    if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) {
      return node;
    }

    const file = bindModuleToFile(node.moduleSpecifier.text);
    if (!file) {
      return node;
    }
    const fileLiteral = ts.createLiteral(file);

    if (
      (!node.exportClause &&
        !compilerOptions.isolatedModules &&
        !resolver.moduleExportsSomeValue(node.moduleSpecifier)) ||
      (node.exportClause && resolver.isValueAliasDeclaration(node))
    ) {
      return ts.updateExportDeclaration(
        node,
        node.decorators,
        node.modifiers,
        node.exportClause,
        fileLiteral
      );
    }

    const exportClause = ts.visitNode(
      node.exportClause,
      visitNamedExports as any,
      ts.isNamedExports
    );
    return node.exportClause === exportClause ||
      exportClause ||
      isDeclarationFile
      ? ts.updateExportDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.exportClause,
          fileLiteral
        )
      : undefined;
  }
  function visitNamedExports(
    node: ts.NamedExports
  ): ts.VisitResult<ts.NamedExports> {
    const elements = ts.visitNodes(
      node.elements,
      visitExportSpecifier as any,
      ts.isExportSpecifier
    );
    return elements.some(e => e)
      ? ts.updateNamedExports(node, elements)
      : undefined;
  }
  function visitExportSpecifier(
    node: ts.ExportSpecifier
  ): ts.VisitResult<ts.ExportSpecifier> {
    return resolver.isValueAliasDeclaration(node) ? node : undefined;
  }

  return ts.visitNode(sourceFile, visit);
};

export default transformer;
