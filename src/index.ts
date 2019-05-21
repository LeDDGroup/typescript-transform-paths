import * as ts from "typescript";
import * as fs from "fs";
import { dirname, relative, join } from "path";
import * as slash from "slash";

interface PluginConfig {
  extensions?: (string | [string, string])[];
}

const transformer = (
  _: ts.Program, config?: PluginConfig
) => (
  context: ts.TransformationContext
) => (
  sourceFile: ts.SourceFile
) => {
  const resolver = (context as any).getEmitResolver();
  const compilerOptions = context.getCompilerOptions();
  const sourceDir = dirname(sourceFile.fileName);

  const { baseUrl = "", paths = { } } = compilerOptions;
  const { extensions = [
    [".ts", ".js"], [".tsx", ".jsx"], ".js", ".jsx"
  ] } = config || { };

  const binds = Object.keys(paths).map(key => ({
    regexp: new RegExp(`^${key.replace(/\*$/, "(.*)")}$`),
    paths: paths[key],
  }));

  if (!baseUrl || binds.length === 0) {
    // There is nothing we can do without baseUrl and paths specified.
    return sourceFile;
  }

  function findModuleFile(moduleName: string) {
    for (const { regexp, paths } of binds) {
      const match = regexp.exec(moduleName);
      if (match) {
        for (const path of paths) {
          const dir = join(baseUrl, path.replace(/\*$/, match[1]));
          if (fs.existsSync(dir)) {
            return dir;
          }
          for (let ext of extensions) {
            let src = ext;
            if (Array.isArray(ext)) {
              src = ext[0];
              ext = ext[1];
            }
            if (fs.existsSync(`${dir}${src}`)) {
              return `${dir}${ext}`;
            }
          }
        }
      }
    }
    return undefined;
  }
  function bindModuleToFile(moduleName: string) {
    let file = findModuleFile(moduleName);
    if (!file) {
      return undefined;
    }

    file = slash(relative(sourceDir, file));
    return file[0] === "." ? file : "./" + file;
  }

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
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
    return node.importClause === importClause || importClause ? (
      ts.updateImportDeclaration(
        node,
        node.decorators,
        node.modifiers,
        node.importClause,
        fileLiteral
      )
    ) : undefined;
  }
  function visitImportClause(
    node: ts.ImportClause
  ): ts.VisitResult<ts.ImportClause> {
    const name = resolver.isReferencedAliasDeclaration(node)
      ? node.name : undefined;
    const namedBindings = ts.visitNode(
      node.namedBindings,
      visitNamedImportBindings as any,
      ts.isNamedImports
    );
    return (name || namedBindings)
      ? ts.updateImportClause(node, name, namedBindings)
      : undefined;
  }
  function visitNamedImportBindings(
    node: ts.NamedImportBindings
  ): ts.VisitResult<ts.NamedImportBindings> {
    if (node.kind === ts.SyntaxKind.NamespaceImport) {
      return resolver.isReferencedAliasDeclaration(node)
        ? node : undefined;
    }
    else {
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
    return resolver.isReferencedAliasDeclaration(node)
      ? node : undefined;
  }

  function unpathExportDeclaration(
    node: ts.ExportDeclaration
  ): ts.VisitResult<ts.Statement> {
    if (
      !node.exportClause &&
      !compilerOptions.isolatedModules &&
      !resolver.moduleExportsSomeValue(node.moduleSpecifier)
    ) {
      return undefined;
    }
    if (node.exportClause && resolver.isValueAliasDeclaration(node)) {
      return undefined;
    }
    if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) {
      return node;
    }

    const file = bindModuleToFile(node.moduleSpecifier.text);
    if (!file) {
      return node;
    }
    const fileLiteral = ts.createLiteral(file);

    const exportClause = ts.visitNode(
      node.exportClause,
      visitNamedExports as any,
      ts.isNamedExports
    );
    return node.exportClause === exportClause || exportClause ? (
      ts.updateExportDeclaration(
        node,
        node.decorators,
        node.modifiers,
        node.exportClause,
        fileLiteral
      )
    ) : undefined;
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
    return resolver.isValueAliasDeclaration(node)
      ? node : undefined;
  }

  return ts.visitNode(sourceFile, visit);
};

export default transformer;
