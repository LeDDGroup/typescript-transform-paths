import type TS from 'typescript';
import { VisitorContext } from '../types';
import { isURL, maybeAddRelativeLocalPrefix, normalizePath } from '../utils';
import { resolveModuleName } from './resolve-module-name';
import { getTsPathsMatch } from '../ts';

/* ****************************************************************************************************************** *
 * Node Updater Util
 * ****************************************************************************************************************** */

/**
 * Gets proper path and calls updaterFn to get the new node if it should be updated
 */
export function resolvePathAndUpdateNode(
  context: VisitorContext,
  node: TS.Node,
  moduleName: string,
  updaterFn: (newPath: TS.StringLiteral) => TS.Node | undefined
): TS.Node | undefined {
  const {
    sourceFile,
    tsInstance,
    factory,
    config: { outputExtensions, outputIndexes, usePaths },
  } = context;

  /* Handle JSDoc statement tags */
  const tags = getStatementTags();

  // Skip if @no-transform-path specified
  if (tags.shouldSkip) return node;

  // Accommodate direct override via @transform-path tag
  if (tags.overridePath) {
    const transformedPath = !isURL(tags.overridePath)
      ? maybeAddRelativeLocalPrefix(normalizePath(tags.overridePath))
      : tags.overridePath;

    return updaterFn(factory.createStringLiteral(transformedPath));
  }

  // Check for tsconfig paths match
  const pathsMatch = usePaths ? getTsPathsMatch(context, moduleName) : undefined;

  // Skip if possible
  const canSkip = !pathsMatch && !context.resolver && outputIndexes !== 'always' && outputExtensions !== 'always';
  if (canSkip) return node;

  // Resolve
  const res = resolveModuleName(context, node, moduleName, pathsMatch);
  if (!res) return node;

  const { outputPath, fullResolvedPath } = res;

  /* Skip if matches exclusion */
  if (fullResolvedPath && context.excludeMatchers)
    for (const matcher of context.excludeMatchers)
      if (matcher.match(outputPath) || (fullResolvedPath && matcher.match(fullResolvedPath))) return node;

  return updaterFn(factory.createStringLiteral(outputPath));

  /* ********************************************************* *
   * Helpers
   * ********************************************************* */

  function getStatementTags() {
    let targetNode = tsInstance.isStatement(node)
      ? node
      : tsInstance.findAncestor(node, tsInstance.isStatement) ?? node;
    targetNode = tsInstance.getOriginalNode(targetNode);

    let jsDocTags: readonly TS.JSDocTag[] | undefined;
    try {
      jsDocTags = tsInstance.getJSDocTags(targetNode);
    } catch {}

    const commentTags = new Map<string, string | undefined>();
    try {
      const trivia = targetNode.getFullText(sourceFile).slice(0, targetNode.getLeadingTriviaWidth(sourceFile));
      const regex = /^\s*\/\/\/?\s*@(transform-path|no-transform-path)(?:[^\S\r\n](.+?))?$/gim;

      for (let match = regex.exec(trivia); match; match = regex.exec(trivia)) commentTags.set(match[1], match[2]);
    } catch {}

    const overridePath = findTag('transform-path');
    const shouldSkip = findTag('no-transform-path');

    return {
      overridePath: typeof overridePath === 'string' ? overridePath : void 0,
      shouldSkip: !!shouldSkip,
    };

    function findTag(expected: string): boolean | string | undefined {
      if (commentTags.has(expected)) return commentTags.get(expected) || true;
      if (!jsDocTags?.length) return void 0;

      for (const tag of jsDocTags) {
        const tagName = tag.tagName.text.toLowerCase();
        if (tagName === expected) return typeof tag.comment === 'string' ? tag.comment : true;
      }
    }
  }
}
