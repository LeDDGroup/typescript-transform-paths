import { modes, tsModules } from "./config";
import chalk from "chalk";
import { toResolve } from "./ut/matchers/to-resolve";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

declare global {
  namespace jest {
    interface Matchers<R> {
      toResolve(): void;
    }
  }
  const envOptions: {
    tsModules: typeof tsModules[number][]
    buildModes: typeof modes[number][]
    testTarget: 'src' | 'dist'
    testGroups: string | undefined
  }
}

// endregion

/* ****************************************************************************************************************** */
// region: Setup
/* ****************************************************************************************************************** */

(function setup() {
  let { TS_MODULES, BUILD_MODES, TEST_GROUPS, CI, TEST_TARGET, UT_DEBUG } = process.env;

  /* Get env config */
  const splitStr = (v: string | undefined) => v?.split(',').map(m => m.trim().toLowerCase());
  const opt = {
    tsModules: splitStr(TS_MODULES),
    buildModes: splitStr(BUILD_MODES),
    testGroups: splitStr(TEST_GROUPS),
    testTarget: TEST_TARGET === 'dist' ? 'dist' : 'src'
  };

  (<any>global).envOptions = <typeof envOptions>{
    tsModules: !opt.tsModules || CI ? tsModules : tsModules.filter((m) => opt.tsModules!.includes(m[0].toLowerCase())),
    buildModes: !opt.buildModes || CI ? modes : modes.filter((m) => opt.buildModes!.includes(m.toLowerCase())),
    testGroups: CI ? void 0 : opt.testGroups,
    testTarget: CI ? 'dist' : opt.testTarget
  }

  /* Add Matchers */
  expect.extend({ toResolve });

  /* Debug Message */
  if (UT_DEBUG)
    process.stdout.write(
      '\n' +
      chalk.yellow(`Started UnderscoreTest Framework ${CI ? chalk.red(`(CI MODE)`) : ''}`) + '\n' +
      chalk.grey(`Options: `) +
      chalk.grey(JSON.stringify(envOptions, null, 2)) + '\n'
    );
})();

// endregion
