/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

export const _test_tag_no_transform = _test({
  label: `(@no-transform-path) Doesn't transform path`,
  group: "Tags",
});

export const _test_tag_explicit_transform = _test({
  label: `(@transform-path) Transforms path with explicit value`,
  group: "Tags",
});

export const _test_exclude = _test({
  label: `(exclude) Doesn't transform for exclusion patterns`,
  group: "Options",
});

export const _test_type_only_import = _test({
  label: `Type-only import transforms`,
  if: (c) => c.tsMajorVersion > 3 || (c.tsMajorVersion == 3 && c.tsMinorVersion >= 8),
});

export const _test_module_augmentation = _test({
  label: `Resolves module augmentation`,
  for: "dts",
});

export const _test_type_elision = _test(`Type elision works properly`);

export const _test_async_import_comments = _test(`Copies comments in async import`);

export const _test_explicit_extensions = _test(`Preserves explicit extensions`);
