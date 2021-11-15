import { TestDetail, UnderscoreTestContext } from './types';

/* ****************************************************************************************************************** *
 * Locals
 * ****************************************************************************************************************** */

const defaultNonGroupedTag = 'General';

/* ****************************************************************************************************************** *
 * TestMap (class)
 * ****************************************************************************************************************** */

export class TestMap extends Map<string, TestDetail> {
  constructor(private testContext: UnderscoreTestContext, private nonGroupedTag: string = defaultNonGroupedTag) {
    super();
  }

  /* ********************************************************* *
   * Methods
   * ********************************************************* */

  getTests() {
    return this.getTestsWorker();
  }

  getTestsForGroup(groupName: string | undefined) {
    return this.getTestsWorker(groupName);
  }

  private getTestsWorker(groupName?: string) {
    const res = Array.from(this.values()).map(
      (detail) =>
        <const>[typeof detail.label === 'string' ? detail.label : detail.label(this.testContext.runConfig), detail]
    );

    return !groupName
      ? res
      : res.filter(([_, d]) => d.config.group === groupName || (!d.config.group && groupName === this.nonGroupedTag));
  }

  getGroups(): (string | undefined)[] {
    let res = Array.from(new Set([...this.values()].map((t) => t.config?.group || this.nonGroupedTag)));
    if (envOptions.testGroups) res = res.filter((g) => envOptions.testGroups!.includes(g.toLowerCase()));
    return res;
  }

  /* ********************************************************* *
   * Internal
   * ********************************************************* */

  /**
   * Validate tests and returns self
   */
  validate(): this {
    const tsLabel = this.testContext.tsModule[0];

    for (const [key, test] of this.entries()) {
      if (!test.enabled) this.delete(key);
      else if (test.expects.length < 1)
        throw new Error(`No expects found for '${test.testName}' in ${test.sourceFile.fileName} in TS: ${tsLabel}`);
    }

    if (!this.size)
      throw new Error(
        `No tests enabled for current configuration in TS: ${tsLabel}! \n` +
          JSON.stringify(this.testContext.projectConfig, null, 2)
      );

    return this;
  }
}
