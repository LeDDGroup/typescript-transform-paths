import { ut } from '../../src';

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const testRuns = ut.loadProject({
  projectName: 'specific',
  pluginOptions: { exclude: ['**/excluded/**', 'excluded-file.*'] },
  useGroups: true
});

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`[Project: 'specific'] - Specific Test Cases`, () => {
  describe.each(testRuns)(`$runLabel`, ({ groups }) => {
    describe.each(groups)(`$groupLabel`, ({ tests }) => {
      test.each(tests)(`%s`, (_, { expects }) => {
        expects.forEach((exp) => expect(exp).toResolve());
      });
    })
  });
});
