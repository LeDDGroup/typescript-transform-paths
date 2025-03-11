import { getMatchPortion } from "../../src/utils/get-relative-path";

describe(`getMatchPortion`, () => {
  it("works in a simple case", () => {
    expect(getMatchPortion("/foo/bar", "/foo/quux")).toBe("/foo/");
  });

  // We use the function getMatchPortion to generate a new path for “to”, so let’s preserve
  // the case where possible.
  // Otherwise we are introducing inconsistency for our users, who may have had import from Foo,
  // their file is named Foo, but we rewrite the path to foo.
  // Although the file is still accessible in the file system, other tools might reasonably
  // complain about the unexpected case mismatch.
  it("prioritizes the casing of the “to” parameter", () => {
    expect(getMatchPortion("/foo/bar", "/foO/quux")).toBe("/foO/");
    expect(getMatchPortion("/foo/bar", "/foo/Bonk")).toBe("/foo/B");
  });
});
