# Test Framework

This library uses a bespoke testing framework built on top of jest called `Underscore Test`

## Overview

- TS projects used for tests are in `test/projects`
- UT source can be found in `test/src`
- Convention is to keep all UT tests for a project in a single, root-level file called `tests.ts`  
   (ie. `test/projects/my-project/tests.ts`)

## Debugging
### Environment Variables

The following env vars can be used to fine-tune / speed up testing during debugging.  

| VAR          | Type | Description                                                                   |
| ------------ | -----| ----------------------------------------------------------------------------- |
| TS_MODULES   | Comma separated name fields in `tsModules`* | TS Version to use for testing |
| BUILD_MODES  | Comma separated of `buildModes`* | Configure which builders to use (program, ts-node, etc) ¹  |
| TEST_GROUPS  | Comma separated string | Only run specific test groups |
| TEST_TARGET  | 'src' or 'dist' (default: 'src') | Test against compiled or uncompiled source  |

_\* see: `test/src/config.ts`_  
_¹ Only applies to general project suite — UT suites only test with `Program`_  

_Note: if `CI` env var is set, custom vars will be ignored_

### Example  
Only test latest TS, in uncompiled source, using program and ts-node:
 
- TS_MODULES = latest;
- BUILD_MODES = program,ts-node;
- TEST_TARGET = src;

## Writing Tests
### Test Projects

#### `_test()`

Defines a test

- Can conditionally apply test based on test run config via `if` config

#### `_expect()`

Attaches an expect to a test

- All expects are written in-line, preceding the statement they apply to.
- Multiple expects can be attached to single statement
  - In a multiple expect-scenario, expects can link to different tests
- Can conditionally apply expect based on: 
  - run config via `if` config
  - output file type via `for` config
- Specifiers are determined automatically, but they can also be manually set via `specifiers` config

_Note: For more detail see intellisense or JSDoc for signatures in `test/src/ut-global/globals.d.ts`_

#### Example

`tests.ts`
```ts
export const _test_elided = _test(`Elides properly`);
export const _test_transform = _test(`Transforms Path`);
export const _test_ts3_only = _test(`Something for TS3`, { if: (opt) => opt.tsModule[0][0] === '3' })
```

`my-file.ts`
```ts
import { _test_elided, _test_transform, _test_ts3_only } from './tests';

_expect(_test_elided, 'new-path', { for: 'js', specifiers: [ 'preserved' ] });
_expect(_test_transform, 'new-path')
import { elided, preserved } from '#transformable-path';

// Not a practical test - simply demonstrates test `if`
_expect(_test_ts3_only, 'path')
import path from 'path';

// Second expect linked to `_test_transform` test
_expect(_test_transform, 'new-path-2')
export { b } from '#transformable-path2'
```

### Test Suites

#### `ut.loadProject()`

Loads project and builds map of tests with expects

#### `expect().toResolve()`

Custom UT jest matcher to process expects

#### Example

```ts
import { ut } from "../../src";

/* ********************************************************************************* *
 * Config
 * ********************************************************************************* */

// Loads from 'test/projects/my-project'
// Returns an array of tsVersions + a method called loadTests() to load a test array
const tsTests = ut.loadProject({ projectName: 'my-project' }); 

/* ********************************************************************************* *
 * Tests
 * ********************************************************************************* */

describe(`[Project: 'my-project'] - Custom Project`, () => {
  // Group for each ts version  
  describe.each(tsTests)(`[TS: $tsVersion]`, ({ loadTests }) => {
    const tests = loadTests().loadTests();
    
    // Run each test loaded
    test.each(tests)(`%s`, (_, detail) => {
      detail.expects.forEach(exp => expect(exp).toResolve());
    })
  })
});

```
