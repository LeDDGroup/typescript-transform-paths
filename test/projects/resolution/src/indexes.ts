import { _test_internal_package_index, _test_external_package_index, _test_local_index } from '../tests';

/* ****************************************************************************************************************** *
 * Local
 * ****************************************************************************************************************** */

_expect(_test_local_index, _expect.index('./local'));
import '#root/local';

_expect(_test_local_index, _expect.index('./local'));
import './local';

/* ****************************************************************************************************************** *
 * Internal
 * ****************************************************************************************************************** */

_expect(_test_internal_package_index, _expect.index('../packages/internal/root-idx'));
import '../packages/internal/root-idx';

_expect(_test_internal_package_index, _expect.index('../packages/internal/root-idx'));
import '#internal/root-idx';

_expect(_test_internal_package_index, _expect.index('../packages/internal/root-idx/sub-pkg', 'main'));
import '#internal/root-idx/sub-pkg';

_expect(_test_internal_package_index, _expect.index('../packages/internal/root-named-idx', 'main'));
import '#internal/root-named-idx';

_expect(_test_internal_package_index, _expect.index('../packages/internal/subdir-idx', 'subdir/main'));
import '#internal/subdir-idx';

// TS Does not resolve
_expect(_test_internal_package_index);
import '#internal/esm';

/* ****************************************************************************************************************** *
 * External
 * ****************************************************************************************************************** */

_expect(_test_external_package_index, _expect.index('@external/root-idx'));
import '@external/root-idx';

_expect(_test_external_package_index, _expect.index('@external/root-idx/sub-pkg', 'main'));
import '@external/root-idx/sub-pkg';

_expect(_test_external_package_index, _expect.index('@external/root-named-idx', 'main'));
import '@external/root-named-idx';

_expect(_test_external_package_index, _expect.index('@external/subdir-idx', 'subdir/main'));
import '@external/subdir-idx';
