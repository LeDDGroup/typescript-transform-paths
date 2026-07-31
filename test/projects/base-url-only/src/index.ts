import { localValue } from "local";
import { nestedValue } from "nested/value";
import type { CompilerOptions } from "typescript";

export const result = localValue + nestedValue;
export type { CompilerOptions };
