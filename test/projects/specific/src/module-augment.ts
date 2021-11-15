import { Expandable } from '#root/general';
import { _test_module_augmentation } from '../tests';

_expect(_test_module_augmentation, { path: './general' });
declare module '#root/general' {
  interface Expandable {
    b: number;
  }
}

_expect(_test_module_augmentation);
declare module './excluded-file' {
  type B = null;
}

// Leave this - provides typechecking
declare const b: Expandable;
b.b && b.a;
