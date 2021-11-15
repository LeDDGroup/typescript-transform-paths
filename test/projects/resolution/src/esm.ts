import { _test_esm_reject_unmapped } from '../tests';

/* ****************************************************************************************************************** *
 * Index
 * ****************************************************************************************************************** */
// TODO - Implicit indexes are more tricky with ESM and are not presently supported

// _expect(_test_esm_index, _expect.index('@external/esm', 'dir/main'));
// import '@external/esm';

/* ****************************************************************************************************************** *
 * Synthetic Paths
 * ****************************************************************************************************************** */
// Not supported pre 4.5 - maybe supported after?

// _expect(_test_esm_synthetic_path, _expect.path('../packages/esm/synthetic/path/mod'));
// import '@external/esm/synthetic/path/mod';
//
// _expect(_test_esm_synthetic_path, _expect.path('../packages/esm/synthetic/path/mod'));
// import '@external/esm/dir/';

/* ****************************************************************************************************************** *
 * Unmapped Paths
 * ****************************************************************************************************************** */
// The following path exists, but it is not mapped in exports

_expect(_test_esm_reject_unmapped);
import '@external/esm/dir/main.js';
