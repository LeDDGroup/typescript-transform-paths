import { ConstB, TypeA } from "#elision/a";
import { TypeA as TypeA2 } from "#elision/a";
export { ConstB, TypeA };
export { TypeA2 };

/* Import type */
import { type TypeAndConst, ConstB as __ } from "#elision/a";
export { TypeAndConst, __ };

/* Export type */
import { TypeAndConst as TypeAndConst2, ConstB as ___ } from "#elision/a";
export { type TypeAndConst2, ___ };

const b = TypeAndConst2;

/* Unreferenced import type */
import { ConstB as ____, type TypeAndConst as TypeAndConst3 } from "#elision/a";
