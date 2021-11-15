/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

export const _test_root_dirs = _test({
  label: `Re-maps for rootDirs`,
  if: ({ pluginOptions }) => pluginOptions.useRootDirs,
});

export const _test_no_root_dirs = _test({
  label: `Ignores rootDirs`,
  if: ({ pluginOptions }) => !pluginOptions.useRootDirs,
});
