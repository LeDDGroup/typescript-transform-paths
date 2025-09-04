import { describe, test } from "node:test";
import { getMatchPortion } from "../../src/utils/get-relative-path";

describe(`getMatchPortion`, () => {
  test("works in a simple case", (t) => {
    t.assert.equal(getMatchPortion("/foo/bar", "/foo/quux"), "/foo/");
  });

  // We use the function getMatchPortion to generate a new path for “to”, so let’s preserve
  // the case where possible.
  // Otherwise we are introducing inconsistency for our users, who may have had import from Foo,
  // their file is named Foo, but we rewrite the path to foo.
  // Although the file is still accessible in the file system, other tools might reasonably
  // complain about the unexpected case mismatch.
  test('prioritizes the casing of the "to" parameter', (t) => {
    t.assert.equal(getMatchPortion("/foo/bar", "/foO/quux"), "/foO/");
    t.assert.equal(getMatchPortion("/foo/bar", "/foo/Bonk"), "/foo/B");
  });
});
