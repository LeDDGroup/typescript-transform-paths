/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

export const _test_internal_package_index = _test({
  label: `Internal packages resolve properly`,
  group: "Package"
});

export const _test_external_package_index = _test({
  label: `External packages resolve properly`,
  group: "Package"
});

export const _test_local_index = _test(`Local index resolves properly`);

// Not supported pre 4.5 - maybe supported after?

// export const _test_esm_synthetic_path = _test({
//   label: `Resolves synthetic paths`,
//   group: 'ESM'
// });

export const _test_esm_reject_unmapped = _test({
  label: `Does not transform unmapped paths`,
  group: 'ESM',
  if: () => false
});

// --- TODO ----

// export const _test_esm_index = _test({
//   label: `Resolves index`,
//   group: 'ESM'
// });

// export const _test_tricky = _test({
//   label: 'Tricky'
// });
