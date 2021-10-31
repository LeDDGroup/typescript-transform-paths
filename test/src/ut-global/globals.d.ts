
/* ****************************************************************************************************************** */
// region: Project Functions
/* ****************************************************************************************************************** */

declare function _test(label: TestConfig['label']): UnderscoreTest;
declare function _test(cfg: TestConfig): UnderscoreTest;

declare function _expect(test: UnderscoreTest, path?: ExpectConfig['path']): void
declare function _expect(test: UnderscoreTest, cfg?: ExpectConfig): void

declare namespace _expect {
  /**
   * Get expected path with implicit index based on run config
   * @param path Expected path (without implicits index or extension)
   * @param implicitIndex Defaults to 'index' (do not add extension, as this is automatically determined)
   */
  export function index(path: string, implicitIndex?: string): string;

  /**
   * Get expected path with implicit extension based on run config
   * @param path
   * @param implicitExtension Defaults to '.js' for js or '.d.ts' for declarations
   */
  export function path(path: string, implicitExtension?: string): string;
}

// endregion


/* ****************************************************************************************************************** */
// region: Project Function Types
/* ****************************************************************************************************************** */

declare interface TestConfig {
  label: string | ((opt: TestRunConfig) => string)

  /**
   * This test will only process if predicate is true
   */
  if?: (c: TestRunConfig) => boolean

  /**
   * Assign a group name to the test
   */
  group?: string

  /**
   * Only run test for specific output type
   */
  for?: ForKind
}

declare interface ExpectConfig {
  /**
   * Only apply expect if predicate is true
   */
  if?: (c: TestRunConfig) => boolean

  /**
   * Only apply expect to a certain type of output file
   * @default 'all'
   */
  for?: ForKind

  /**
   * Specific Path
   * @default same as source
   */
  path?: string | undefined | ((c: TestRunConfig) => string)

  /**
   * Specific Path if outputMode = 'esm'
   * Note: Not all tests use esm mode
   */
  esmPath?: string | undefined | ((c: TestRunConfig) => string)

  /**
   * If true, the entire node is expected to be elided
   */
  elided?: boolean

  /**
   * Expected specifiers
   * @example
   * _expect(_my_test, 'path', { specifiers: [ 'shown' ] });
   * import { shown, elided } from 'path';
   */
  specifiers?: string []

  /**
   * Additional check predicate (test fails if predicate returns false)
   */
  extraCheck?: (compiledStatement: string | undefined) => boolean
}

// endregion

/* ****************************************************************************************************************** */
// region: Internal
/* ****************************************************************************************************************** */

declare type ForKind = 'dts' | 'js' | 'all';

declare const underscoreTestSym: unique symbol;
declare interface UnderscoreTest {
  [underscoreTestSym]: boolean
}

declare interface TestRunConfig {
  pluginOptions?: Record<string, any>
  mode: 'program' | 'ts-node' | 'manual'
  tsMajorVersion: number
  tsMinorVersion: number
}

// endregion
