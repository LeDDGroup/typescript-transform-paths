/* ****************************************************************************************************************** */
// region: Utility Types
/* ****************************************************************************************************************** */
// @formatter:off

// @prettier-ignore
export type DownSampleTsTypes<TypeMap extends [any, any][], Tuple extends [...unknown[]]> = {
  [i in keyof Tuple]: Tuple[i] extends any[]
    ? DownSampleTsTypes<TypeMap, Tuple[i]>
    : DownSampleTsType<TypeMap, Tuple[i]>;
} & {
  length: Tuple["length"];
};

// @prettier-ignore
type DownSampleTsType<TypeMap extends [any, any][], T> =
  T extends Exclude<TypeMap[number][0], undefined> ? Extract<TypeMap[number], [T, any]>[1] : T;

// @formatter:on
// endregion
