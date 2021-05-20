export { B } from "#root/dir/gen-file";
export { A } from "#root/dir/src-file";

import "ts-expose-internals";

import type { A as ATypeOnly } from "#root/dir/src-file";
export { ATypeOnly };

import(/* webpackChunkName: "Comment" */ "#root/dir/src-file");
import(
  // comment 1
  /*
  comment 2
   */
  "#root/dir/gen-file"
);

export { BB } from "#exclusion/ex";
export { DD } from "#root/excluded-file";

export { JsonValue } from "#root/data.json";
export { GeneralConstA, GeneralTypeA } from "#root/general";
export { GeneralConstB } from "#root/general.js";

export const b = 3;

export { ConstB } from '#elision'
