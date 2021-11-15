import { ExpectDetail } from '../types';
import chalk from 'chalk';
import path from 'path';
import { projectsPath } from '../../config';
import { matcherHint } from 'jest-matcher-utils';
import { diff } from 'jest-diff';

/* ****************************************************************************************************************** *
 * toResolve() (Jest Matcher)
 * ****************************************************************************************************************** */

export const toResolve: jest.CustomMatcher = function toResolve(detail: ExpectDetail) {
  const { expectedOutput, actualOutput, sourceFile, targetNode, config } = detail;

  let failType: 'equality' | 'extraCheck' = 'equality';
  let pass = detail.expectedOutput === detail.actualOutput;
  const pos = sourceFile.getLineAndCharacterOfPosition(targetNode.getStart(sourceFile));
  let detailStr =
    `File: ${chalk.white(path.relative(projectsPath, detail.sourceFile.fileName))}\n` +
    `Line: ${chalk.white(pos.line + 1)}\n` +
    `Output: ${chalk.white(detail.compiledSourceFile.isDeclarationFile ? 'declarations' : 'js')}\n\n`;

  if (config.extraCheck && !config.extraCheck(actualOutput)) {
    failType = 'extraCheck';
    pass = false;
  }

  let message: () => string;
  if (pass) {
    message = () => `${matcherHint(`.not.toResolve`)}\n` + detailStr;
  } else {
    message = () =>
      `${matcherHint(`.toResolve`)}\n` +
      detailStr +
      (failType === 'extraCheck'
        ? `Failed extraCheck: ${config.extraCheck!.toString()}`
        : diff(expectedOutput, actualOutput, { expand: this.expand }) + '\n');
  }

  return {
    actual: actualOutput,
    expected: expectedOutput,
    message: message,
    name: 'toResolve',
    pass,
  };
};
