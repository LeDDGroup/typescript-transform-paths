import { _test_no_root_dirs, _test_root_dirs } from '../../tests';

_expect(_test_root_dirs, { path: './src-file' });
_expect(_test_no_root_dirs, { path: '../../src/dir/src-file' });
import '#root/dir/src-file';

export const b = 1;
