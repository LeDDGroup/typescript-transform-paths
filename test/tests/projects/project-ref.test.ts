import { joinPaths } from 'tstp/src/utils';
import { ut } from '../../src';
import { projectsPath } from '../../src/config';

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const testRuns = ut.loadProject({
  projectName: 'project-ref',
  programKind: 'solutionBuilder',
  builderTransformerPredicate: (program) =>
    program.getCompilerOptions().configFilePath === joinPaths(projectsPath, 'project-ref/b/tsconfig.json'),
});

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`[Project: 'project-ref'] - Project References`, () => {
  describe.each(testRuns)(`$runLabel`, ({ tests }) => {
    test.each(tests)(`%s`, (_, detail) => {
      detail.expects.forEach((exp) => expect(exp).toResolve());
    });
  });
});
