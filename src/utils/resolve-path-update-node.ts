import ts from "typescript";
import { VisitorContext } from "../types";
import { isURL, maybeAddRelativeLocalPrefix } from "./general-utils";
import { isModulePathsMatch } from "./ts-helpers";
import { resolveModuleName } from "./resolve-module-name";

/* ****************************************************************************************************************** */
// region: Node Updater Utility
/* ****************************************************************************************************************** */

/**
 * Gets proper path and calls updaterFn to get the new node if it should be updated
 */
export function resolvePathAndUpdateNode(
  context: VisitorContext,
  node: ts.Node,
  moduleName: string,
  updaterFn: (newPath: ts.StringLiteral) => ts.Node | undefined
): ts.Node | undefined {
  const { sourceFile, tsInstance, factory } = context;
  const { normalizePath } = tsInstance;

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

  /* Resolve Module */
  // Skip if no paths match found
  if (!isModulePathsMatch(context, moduleName)) return node;

  const res = resolveModuleName(context, moduleName);
  if (!res) return node;

  const { outputPath, resolvedPath } = res;

  /* Skip if matches exclusion */
  if (context.excludeMatchers)
    for (const matcher of context.excludeMatchers)
      if (matcher.match(outputPath) || (resolvedPath && matcher.match(resolvedPath))) return node;

  return updaterFn(factory.createStringLiteral(outputPath));

  /* ********************************************************* *
   * Helpers
   * ********************************************************* */

  function getStatementTags() {
    let targetNode = tsInstance.isStatement(node)
      ? node
      : tsInstance.findAncestor(node, tsInstance.isStatement) ?? node;
    targetNode = tsInstance.getOriginalNode(targetNode);

    let jsDocTags: readonly ts.JSDocTag[] | undefined;
    try {
      jsDocTags = tsInstance.getJSDocTags(targetNode);
    } catch {}

    const commentTags = new Map<string, string | undefined>();
    if (targetNode.pos >= 0) {
      try {
        const trivia = targetNode.getFullText(sourceFile).slice(0, targetNode.getLeadingTriviaWidth(sourceFile));
        const regex = /^\s*\/\/\/?\s*@(transform-path|no-transform-path)(?:[^\S\r\n](.+?))?$/gim;

        for (let match = regex.exec(trivia); match; match = regex.exec(trivia)) commentTags.set(match[1], match[2]);
      } catch {}
    }

    const overridePath = findTag("transform-path");
    const shouldSkip = findTag("no-transform-path");

    return {
      overridePath: typeof overridePath === "string" ? overridePath : void 0,
      shouldSkip: !!shouldSkip,
    };

    function findTag(expected: string): boolean | string | undefined {
      if (commentTags.has(expected)) return commentTags.get(expected) || true;
      if (!jsDocTags?.length) return void 0;

      for (const tag of jsDocTags) {
        const tagName = tag.tagName.text.toLowerCase();
        if (tagName === expected) return typeof tag.comment === "string" ? tag.comment : true;

        /* The following handles older TS which splits tags at first hyphens */
        if (typeof tag.comment !== "string" || tag.comment[0] !== "-") continue;

        const dashPos = expected.indexOf("-");
        if (dashPos < 0) return void 0;

        if (tagName === expected.slice(0, dashPos)) {
          const comment = tag.comment;
          const choppedCommentTagName = comment.slice(0, expected.length - dashPos);
          return choppedCommentTagName === expected.slice(dashPos)
            ? comment.slice(choppedCommentTagName.length + 1).trim() || true
            : void 0;
        }
      }
    }
  }
}

// endregion
