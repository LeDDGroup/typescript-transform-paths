export { b } from "#root/dir/gen-file";
export { a } from "#root/dir/src-file";

import type { A as ATypeOnly } from "#root/dir/src-file";
import type ATypeOnlyDefault from "#root/dir/src-file";
export { ATypeOnly, ATypeOnlyDefault };

import(/* webpackChunkName: "Comment" */ "#root/dir/src-file");
import(
  // comment 1
  /*
  comment 2
   */
  "#root/dir/src-file"
);

export { bb } from "#exclusion/ex";
export { dd } from "#root/excluded-file";

export { JsonValue } from "#root/data.json";
export { GeneralConstA } from "#root/general";
export { GeneralConstB } from "#root/general.js";

export const b1 = 3;

export { ConstB } from "#elision";
