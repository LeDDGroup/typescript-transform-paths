import { ut } from '../../src';

/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const testRuns = ut.loadProject({
  projectName: 'resolution',
  useGroups: true,
  configs: ut.createConfigSpread({
    outputIndexes: [ 'auto', 'never', 'always' ],
    outputExtensions: [ 'auto', 'never', 'always' ]
  }),
});

/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`[Project: 'resolution'] - Resolution-related`, () => {
  describe.each(testRuns)(`$runLabel`, ({ groups }) => {
    describe.each(groups)(`$groupLabel`, ({ tests }) => {
      test.each(tests)(`%s`, (_, { expects }) => {
        expects.forEach((exp) => expect(exp).toResolve());
      });
    });
  });
});
