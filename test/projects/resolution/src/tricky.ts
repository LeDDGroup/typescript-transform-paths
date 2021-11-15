import { _test_tricky } from '../tests';

// Path match to package in node_modules:
// isExternalLibrary = true, package, submodule = index.d.ts
// _expect(_test_tricky)
// import '#ext-root-idx-pkg';

// Path match to node_modules, sub-file
// isExternalLibrary = true, package, submodule = other.d.ts
// _expect(_test_tricky, 'ss')
// import '#ext-root-idx-pkg/other';

// Path match to ESM package (does not use "index", uses "exports") in node_modules:
// Failed to resolve
// _expect(_test_tricky, 'ss')
// import '#ext-esm';

// Path match to ESM node_modules, sub-file
// isExternalLibrary = true, submodule dir/main.d.ts
// _expect(_test_tricky, 'ss')
// import '#ext-esm/dir/main';

// Path match to package (does not use "index", uses "main") in node_modules:
// isExternalLibrary = true, package, submodule = main.d.ts
// _expect(_test_tricky)
// import '#ext-root-named-idx-pkg';

// Internal ESM package
// Failed to resolve
// import '#internal/esm'

import 'pkg/external';
