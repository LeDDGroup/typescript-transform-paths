import { TestDetail, UnderscoreTestContext } from "../types";
import type { Identifier, Node, Program, SourceFile, TransformationContext, TransformerFactory } from "typescript";
import type TS from "typescript";
import { expectCallName, testCallName } from "../../config";
import {
  getFirstOriginal, getString, getStringOrFunctionOrObjectLiteral, isAsyncImport, isRequire,
} from "../utils/node-helpers";
import { createHarmonyFactory, copyNodeComments } from "tstp/src/ts";
import { assert } from "console";


/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

export interface VisitorContext extends UnderscoreTestContext {
  checker: TS.TypeChecker
  factory: TS.NodeFactory
  sourceFile: SourceFile
  compiledSourceFile: SourceFile
  isDeclarations: boolean
}

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function getExpectTargetNode(ctx: VisitorContext, expectIndex: number) {
  const { ts, sourceFile, compiledSourceFile } = ctx;

  const expectNode = sourceFile.statements[expectIndex];
  const targetNode = findTarget(sourceFile, expectIndex);
  if (!targetNode) throw new Error(`No target found for _expect()! Please check your syntax — ` + expectNode.getText());

  const compiledTargetNode = findStatementByOriginal(targetNode, compiledSourceFile);

  return { targetNode, compiledTargetNode };

  function findTarget(s: SourceFile, idx: number) {
    for (let i = idx + 1; i < s.statements.length; i++) {
      const node = s.statements[i];
      if (
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression) &&
        node.expression.expression &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === expectCallName
      )
        continue;

      if (isValidTarget(node)) return node;

      throw new Error(
        `Unexpected target node type! _expect() must follow statement with valid transform target — ` +
        expectNode.getText()
      );
    }
  }

  function isValidTarget(t: Node) {
    return ts.isImportDeclaration(t) || ts.isExportDeclaration(t) || ts.isModuleDeclaration(t) || checkChildren(t);

    function checkChildren(n: Node): boolean {
      if (isRequire(ts, n) || isAsyncImport(ts, n) || ts.isImportTypeNode(n) || ts.isExternalModuleReference(n))
        return true;

      try {
        if (n.getChildCount(sourceFile))
          for (const child of n.getChildren(sourceFile)) if (checkChildren(child)) return true;
      } catch {}
      return false;
    }
  }
}

function getExpectedOutput(
  { ts, printer, compiledSourceFile, sourceFile }: VisitorContext,
  factory: TS.NodeFactory,
  node: Node,
  expectedPath: string | undefined,
  config: ExpectConfig | undefined
) {
  if (!factory) factory = ts as any;

  let moduleSpecifier: TS.StringLiteral | undefined = expectedPath ? factory.createStringLiteral(expectedPath) : void 0;

  if (ts.isImportDeclaration(node)) {
    let namedBindings = node.importClause?.namedBindings;
    if (namedBindings && ts.isNamedImports(namedBindings) && config?.specifiers)
      namedBindings = factory.createNamedImports(
        namedBindings.elements.filter((b) => config.specifiers!.includes(b.name.text))
      );

    return print(
      factory.createImportDeclaration(
        node.decorators,
        node.modifiers,
        node.importClause && factory.createImportClause(node.importClause.isTypeOnly, node.importClause.name, namedBindings),
        moduleSpecifier || node.moduleSpecifier
      )
    );
  } else if (ts.isExportDeclaration(node)) {
    let exportClause = node.exportClause;
    if (exportClause && ts.isNamedExports(exportClause) && config?.specifiers)
      exportClause = factory.createNamedExports(
        exportClause.elements.filter((e) => config.specifiers!.includes(e.name.text))
      );

    moduleSpecifier ||= node.moduleSpecifier as TS.StringLiteral;

    return print(
      factory.createExportDeclaration(node.decorators, node.modifiers, node.isTypeOnly, exportClause, moduleSpecifier)
    );
  } else if (ts.isExternalModuleReference(node)) {
    return print(moduleSpecifier ? factory.createExternalModuleReference(moduleSpecifier) : node);
  }
  else if (ts.isImportTypeNode(node)) {
    const argument = moduleSpecifier ? factory.createLiteralTypeNode(moduleSpecifier as TS.LiteralExpression) : node.argument;
    return print(factory.createImportTypeNode(argument, node.qualifier, node.typeArguments, node.isTypeOf));
  } else if (ts.isModuleDeclaration(node))
    return print(
      factory.createModuleDeclaration(node.decorators, node.modifiers, moduleSpecifier as TS.ModuleName || node.name, node.body, node.flags)
    );
  else {
    const res = print(node);
    return expectedPath
           ? res.replace(/((?:^|\s*)(?:require|import)\(['"])(.+?)(['"]\))/g, `$1${expectedPath}$3`)
           : res;
  }

  function print(n: Node) {
    if (n !== node) copyNodeComments(ts, sourceFile, node, n);
    return printer.printNode(ts.EmitHint?.Unspecified, n, compiledSourceFile);
  }
}

function getExpectMethodResult(
  ctx: VisitorContext,
  rootNode: TS.ExpressionStatement,
  node: TS.CallExpression
) {
  const { ts, transformerConfig: cfg, compiledSourceFile, sourceFile } = ctx;
  if (
    ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === expectCallName && ts.isIdentifier(node.expression.name)
  ) {
    const fnName = node.expression.name.text;
    if (fnName === 'index' || fnName === 'path') {
      const getExt = () => compiledSourceFile.isDeclarationFile ? '.d.ts' : '.js';
      const args = node.arguments.map(n => getString(ctx, n, sourceFile));

      let res: string = args[0];
      if (fnName === 'index' && cfg.outputIndexes === 'always')
        res += '/' + (args[1] ?? 'index') + (cfg.outputExtensions !== 'always' ? '' : getExt());
      else if (fnName === 'path' && cfg.outputExtensions === 'always') res += args[1] ?? getExt();

      return res;
    }
  }

  throw new Error(`Invalid call expression in expect config: ${rootNode.getText(sourceFile)}`);
}

function checkForKind(forKind: ForKind | undefined, sourceFile: SourceFile) {
  switch (forKind) {
    case 'all':
    case undefined:
      return true;
    case 'dts':
      return sourceFile.isDeclarationFile
    case 'js':
      return !sourceFile.isDeclarationFile
  }
}

function findStatementByOriginal(originalNode: Node, sourceFile: SourceFile) {
  for (const s of sourceFile.statements)
    for (let n: Node | undefined = s; n; n = n.original)
      if (n === originalNode) return s;
}

// endregion

/* ****************************************************************************************************************** */
// region: Checkers
/* ****************************************************************************************************************** */

/**
 * Handle _expect() — ie. _expect(...)
 */
function checkExpect(context: VisitorContext, node: Node, statementIndex: number): void {
  const { ts, checker, factory, runConfig, printer, tests, sourceFile, compiledSourceFile } = context;

  if (
    ts.isExpressionStatement(node) &&
    ts.isCallExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === expectCallName
  ) {
    const [testNameNode, pathOrConfigOrCallNode] = node.expression.arguments as unknown as [Node, Node?];
    assert(ts.isIdentifier(testNameNode));

    /* Get Test */
    const testName = (testNameNode as Identifier).text;
    let test = tests.get(testName);
    if (!test) {
      let sym = checker.getSymbolAtLocation(testNameNode)!;
      let aliasedSym: TS.Symbol | undefined;
      try {
        aliasedSym = checker.getAliasedSymbol(sym);
      } catch {}

      const testNode = ts.getRootDeclaration((aliasedSym ?? sym).valueDeclaration!).parent.parent;
      test = checkTest(context, testNode, true)!;
    }

    if (!test.enabled) return;

    /* Get Config */
    const pathOrConfig =
      !pathOrConfigOrCallNode ? void 0 :
      ts.isCallExpression(pathOrConfigOrCallNode) ? getExpectMethodResult(context, node, pathOrConfigOrCallNode) :
      getStringOrFunctionOrObjectLiteral<ExpectConfig["path"] | ExpectConfig>(context, pathOrConfigOrCallNode, sourceFile)!;

    const config: ExpectConfig =
      !pathOrConfigOrCallNode ? { path: undefined } :
      (typeof pathOrConfig === 'string' || typeof pathOrConfigOrCallNode === 'function')
      ? { path: pathOrConfig } as ExpectConfig
      : pathOrConfig as ExpectConfig;

    const expectedPath = typeof config.path === 'string' ? config.path :
                         typeof config.path === 'function' ? config.path(runConfig) :
                         void 0;

    /* Check against expect config if & for */
    if (config.if && !config.if(runConfig)) return;
    if (!checkForKind(config.for, compiledSourceFile)) return;

    /* Find target nodes */
    const { targetNode, compiledTargetNode } = getExpectTargetNode(context, statementIndex);
    if (!config.elided && !compiledTargetNode)
      throw new Error(
        `No target found for _expect() in compiled code! Did you mean to set elided: true? — ` +
        targetNode.getText()
      );

    /* Create output comparisons */
    let expectedOutput = config.elided ? void 0 : getExpectedOutput(context, factory, targetNode, expectedPath, config);
    let actualOutput = compiledTargetNode ? printer.printNode(ts.EmitHint.Unspecified, compiledTargetNode, compiledSourceFile) : void 0;

    if (expectedOutput) expectedOutput = standardizeQuotes(expectedOutput);
    if (actualOutput) actualOutput = standardizeQuotes(actualOutput);

    test.expects.push({
      config,
      sourceFile,
      compiledSourceFile,
      testName,
      targetNode,
      compiledTargetNode,
      expectedOutput,
      actualOutput,
    });
  }

  function standardizeQuotes(s: string) {
    return s.replace(/['"]/g, '"');
  }
}

/**
 * Handle _test() — ie. const test_name = _test(...)
 */
function checkTest(
  context: VisitorContext,
  node: Node,
  expectValidTest: boolean = false
): TestDetail | undefined {
  const { ts, tests, runConfig, sourceFile, compiledSourceFile } = context;

  if (ts.isVariableStatement(node) && node.declarationList.declarations.length === 1) {
    const declarationNode = node.declarationList.declarations[0];
    if (declarationNode.initializer && ts.isIdentifier(declarationNode.name)) {
      const init = declarationNode.initializer;
      if (ts.isCallExpression(init) && ts.isIdentifier(init.expression) && init.expression.text === testCallName) {
        const arg0 = getStringOrFunctionOrObjectLiteral<TestDetail["label"] | TestConfig>(context, init.arguments[0], sourceFile);
        const config = (typeof arg0 === 'string' || typeof arg0 === 'function') ? { label: arg0 } as TestConfig : arg0;
        const label = typeof config.label === 'string' ? config.label : config.label(runConfig);
        const testName = declarationNode.name.text;

        let detail: TestDetail;
        if (!tests.has(testName)) {
          const enabled = (!config.if || config.if(context.runConfig)) && checkForKind(config.for, compiledSourceFile);
          detail = { sourceFile, expects: [], config, label, testName, enabled };
          tests.set(testName, detail);
        } else detail = tests.get(testName)!;

        return detail;
      }
    }
  }

  if (expectValidTest) throw new Error(`Expected valid _test node, but got: ${node.getText(sourceFile)}`);
}

// endregion

/* ****************************************************************************************************************** */
// region: Walker Factory
/* ****************************************************************************************************************** */

export function getProjectWalker(context: UnderscoreTestContext, program: Program) {
  const { ts } = context;
  const checker = program.getTypeChecker();

  const transformer: TransformerFactory<SourceFile> = (tCtx: TransformationContext) => (compiledSourceFile: SourceFile) => {
    const factory = createHarmonyFactory(ts, tCtx.factory);
    const sourceFile = getFirstOriginal(compiledSourceFile);
    const visitorContext: VisitorContext = {
      ...context,
      checker,
      factory,
      sourceFile,
      compiledSourceFile,
      isDeclarations: compiledSourceFile.isDeclarationFile
    };

    context.walkLog.declarations ||= compiledSourceFile.isDeclarationFile;
    context.walkLog.js ||= !compiledSourceFile.isDeclarationFile;

    sourceFile.statements.forEach((s, idx) => {
      checkTest(visitorContext, s);
      checkExpect(visitorContext, s, idx);
    });

    return compiledSourceFile;
  };

  return transformer;
}

// endregion
