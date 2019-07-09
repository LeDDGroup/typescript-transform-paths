import { dirname, relative, resolve } from "path";
import ts from "typescript";
import slash from "slash";

const transformer = (_: ts.Program) => (context: ts.TransformationContext) => (
  sourceFile: ts.SourceFile
) => {
  const resolver =
    typeof (context as any).getEmitResolver === "function"
      ? (context as any).getEmitResolver()
      : undefined;
  const compilerOptions = context.getCompilerOptions();
  const sourceDir = dirname(sourceFile.fileName);

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

  function bindModuleToFile(moduleName: string) {
    for (const { regexp, path } of binds) {
      const match = regexp.exec(moduleName);
      if (match) {
        const out = path.replace(/\*/g, match[1]);
        const file = slash(relative(sourceDir, resolve(baseUrl, out)));
        return file[0] === "." ? file : `./${file}`;
      }
    }
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
    if (ts.isImportDeclaration(node)) {
      return unpathImportDeclaration(node);
    }
    if (ts.isExportDeclaration(node)) {
      return unpathExportDeclaration(node);
    }

    return ts.visitEachChild(node, visit, context);
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
