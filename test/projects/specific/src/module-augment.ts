import { Expandable } from "#root/general";

// Gets transformed
declare module "#root/general" {
  interface Expandable {
    b: number;
  }
}

// Remains untransformed
declare module "./excluded-file" {
  type B = null;
}

declare const b: Expandable;
b.b && b.a;
