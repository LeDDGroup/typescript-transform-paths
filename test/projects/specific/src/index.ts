import {
  _test_async_import_comments,
  _test_exclude,
  _test_explicit_extensions,
  _test_type_only_import,
} from '../tests';

/* ********************************************************* *
 * TypeOnly
 * ********************************************************* */

_expect(_test_type_only_import, { path: './general', for: 'dts' });
_expect(_test_type_only_import, { elided: true, for: 'js' });
import type { GeneralTypeA as ATypeOnly } from './general';
export { ATypeOnly };

/* ********************************************************* *
 * Async Import Comments
 * ********************************************************* */

_expect(_test_async_import_comments, { path: './general', extraCheck: (c) => /^import\(\/\* w/.test(c), for: 'js' });
import(/* webpackChunkName: "Comment" */ './general');

_expect(_test_async_import_comments, { path: './general', extraCheck: (c) => /^import\(\s*\/\/ c/.test(c), for: 'js' });
import(
  // comment 1
  /*
comment 2
*/
  './general'
);

/* ********************************************************* *
 * Exclusion
 * ********************************************************* */

_expect(_test_exclude);
export { bb } from '#exclusion/ex';

_expect(_test_exclude);
export { dd } from '#root/excluded-file';

/* ********************************************************* *
 * Explicit Extensions
 * ********************************************************* */

_expect(_test_explicit_extensions, { path: './data.json' });
export { JsonValue } from '#root/data.json';

_expect(_test_explicit_extensions, { path: './general.js' });
export { GeneralConstB } from '#root/general.js';
