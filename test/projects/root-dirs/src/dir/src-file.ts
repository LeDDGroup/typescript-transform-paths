import { _test_no_root_dirs, _test_root_dirs } from '../../tests';

_expect(_test_root_dirs, { path: './gen-file' });
_expect(_test_no_root_dirs, { path: '../../generated/dir/gen-file' });
import '#root/dir/gen-file';

export const a = 2;
