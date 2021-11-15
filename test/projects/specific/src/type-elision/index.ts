import { _test_type_elision } from '../../tests';

_expect(_test_type_elision, { specifiers: ['ConstB'], for: 'js' });
_expect(_test_type_elision, { specifiers: ['ConstB', 'TypeA'], for: 'dts' });
import { ConstB, TypeA } from './a';

_expect(_test_type_elision, { elided: true, for: 'js' });
_expect(_test_type_elision, { specifiers: ['TypeA2'], for: 'dts' });
import { TypeA as TypeA2 } from './a';

_expect(_test_type_elision, { specifiers: ['ConstB'], for: 'js' });
_expect(_test_type_elision, { specifiers: ['ConstB', 'TypeA'], for: 'dts' });
export { ConstB, TypeA };

_expect(_test_type_elision, { elided: true, for: 'js' });
_expect(_test_type_elision, { specifiers: ['TypeA2'], for: 'dts' });
export { TypeA2 };
