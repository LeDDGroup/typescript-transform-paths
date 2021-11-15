import { _test_no_root_dirs, _test_root_dirs } from '../tests';

_expect(_test_root_dirs, { path: './dir/gen-file' });
_expect(_test_no_root_dirs, { path: '../generated/dir/gen-file' });
export { b } from '#root/dir/gen-file';

_expect(_test_root_dirs, { path: './dir/src-file' });
_expect(_test_no_root_dirs, { path: './dir/src-file' });
export { a } from '#root/dir/src-file';
