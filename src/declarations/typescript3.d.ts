/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

declare namespace ts {
  const versionMajorMinor = "3.7";
  /** The version of the TypeScript compiler release */
  const version: string;
}
declare namespace ts {
  /**
   * Type of objects whose values are all of the same type.
   * The `in` and `for-in` operators can *not* be safely used,
   * since `Object.prototype` may be modified by outside code.
   */
  interface MapLike<T> {
    [index: string]: T;
  }
  interface SortedReadonlyArray<T> extends ReadonlyArray<T> {
    " __sortedArrayBrand": any;
  }
  interface SortedArray<T> extends Array<T> {
    " __sortedArrayBrand": any;
  }
  /** ES6 Map interface, only read methods included. */
  interface ReadonlyMap<T> {
    get(key: string): T | undefined;
    has(key: string): boolean;
    forEach(action: (value: T, key: string) => void): void;
    readonly size: number;
    keys(): Iterator<string>;
    values(): Iterator<T>;
    entries(): Iterator<[string, T]>;
  }
  /** ES6 Map interface. */
  interface Map<T> extends ReadonlyMap<T> {
    set(key: string, value: T): this;
    delete(key: string): boolean;
    clear(): void;
  }
  /** ES6 Iterator type. */
  interface Iterator<T> {
    next(): {
      value: T;
      done?: false;
    } | {
      value: never;
      done: true;
    };
  }
  /** Array that is only intended to be pushed to, never read. */
  interface Push<T> {
    push(...values: T[]): void;
  }
  type EqualityComparer<T> = (a: T, b: T) => boolean;
  type Comparer<T> = (a: T, b: T) => Comparison;
  enum Comparison {
    LessThan = -1,
    EqualTo = 0,
    GreaterThan = 1
  }
}
declare namespace ts {
  const emptyArray: never[];
  /** Create a new map. If a template object is provided, the map will copy entries from it. */
  function createMap<T>(): Map<T>;
  function createMapFromEntries<T>(entries: [string, T][]): Map<T>;
  function createMapFromTemplate<T>(template: MapLike<T>): Map<T>;
  const MapCtr: new <T>() => Map<T>;
  function shimMap(): new <T>() => Map<T>;
  function length(array: ReadonlyArray<any> | undefined): number;
  /**
   * Iterates through 'array' by index and performs the callback on each element of array until the callback
   * returns a truthy value, then returns that value.
   * If no such value is found, the callback is applied to each element of array and undefined is returned.
   */
  function forEach<T, U>(array: ReadonlyArray<T> | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
  /** Like `forEach`, but suitable for use with numbers and strings (which may be falsy). */
  function firstDefined<T, U>(array: ReadonlyArray<T> | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
  function firstDefinedIterator<T, U>(iter: Iterator<T>, callback: (element: T) => U | undefined): U | undefined;
  function zipWith<T, U, V>(arrayA: ReadonlyArray<T>, arrayB: ReadonlyArray<U>, callback: (a: T, b: U, index: number) => V): V[];
  function zipToIterator<T, U>(arrayA: ReadonlyArray<T>, arrayB: ReadonlyArray<U>): Iterator<[T, U]>;
  function zipToMap<T>(keys: ReadonlyArray<string>, values: ReadonlyArray<T>): Map<T>;
  /**
   * Iterates through `array` by index and performs the callback on each element of array until the callback
   * returns a falsey value, then returns false.
   * If no such value is found, the callback is applied to each element of array and `true` is returned.
   */
  function every<T>(array: ReadonlyArray<T>, callback: (element: T, index: number) => boolean): boolean;
  /** Works like Array.prototype.find, returning `undefined` if no element satisfying the predicate is found. */
  function find<T, U extends T>(array: ReadonlyArray<T>, predicate: (element: T, index: number) => element is U): U | undefined;
  function find<T>(array: ReadonlyArray<T>, predicate: (element: T, index: number) => boolean): T | undefined;
  function findLast<T, U extends T>(array: ReadonlyArray<T>, predicate: (element: T, index: number) => element is U): U | undefined;
  function findLast<T>(array: ReadonlyArray<T>, predicate: (element: T, index: number) => boolean): T | undefined;
  /** Works like Array.prototype.findIndex, returning `-1` if no element satisfying the predicate is found. */
  function findIndex<T>(array: ReadonlyArray<T>, predicate: (element: T, index: number) => boolean, startIndex?: number): number;
  function findLastIndex<T>(array: ReadonlyArray<T>, predicate: (element: T, index: number) => boolean, startIndex?: number): number;
  /**
   * Returns the first truthy result of `callback`, or else fails.
   * This is like `forEach`, but never returns undefined.
   */
  function findMap<T, U>(array: ReadonlyArray<T>, callback: (element: T, index: number) => U | undefined): U;
  function contains<T>(array: ReadonlyArray<T> | undefined, value: T, equalityComparer?: EqualityComparer<T>): boolean;
  function arraysEqual<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>, equalityComparer?: EqualityComparer<T>): boolean;
  function indexOfAnyCharCode(text: string, charCodes: ReadonlyArray<number>, start?: number): number;
  function countWhere<T>(array: ReadonlyArray<T>, predicate: (x: T, i: number) => boolean): number;
  /**
   * Filters an array by a predicate function. Returns the same array instance if the predicate is
   * true for all elements, otherwise returns a new array instance containing the filtered subset.
   */
  function filter<T, U extends T>(array: T[], f: (x: T) => x is U): U[];
  function filter<T>(array: T[], f: (x: T) => boolean): T[];
  function filter<T, U extends T>(array: ReadonlyArray<T>, f: (x: T) => x is U): ReadonlyArray<U>;
  function filter<T, U extends T>(array: ReadonlyArray<T>, f: (x: T) => boolean): ReadonlyArray<T>;
  function filter<T, U extends T>(array: T[] | undefined, f: (x: T) => x is U): U[] | undefined;
  function filter<T>(array: T[] | undefined, f: (x: T) => boolean): T[] | undefined;
  function filter<T, U extends T>(array: ReadonlyArray<T> | undefined, f: (x: T) => x is U): ReadonlyArray<U> | undefined;
  function filter<T, U extends T>(array: ReadonlyArray<T> | undefined, f: (x: T) => boolean): ReadonlyArray<T> | undefined;
  function filterMutate<T>(array: T[], f: (x: T, i: number, array: T[]) => boolean): void;
  function clear(array: {}[]): void;
  function map<T, U>(array: ReadonlyArray<T>, f: (x: T, i: number) => U): U[];
  function map<T, U>(array: ReadonlyArray<T> | undefined, f: (x: T, i: number) => U): U[] | undefined;
  function mapIterator<T, U>(iter: Iterator<T>, mapFn: (x: T) => U): Iterator<U>;
  function sameMap<T>(array: T[], f: (x: T, i: number) => T): T[];
  function sameMap<T>(array: ReadonlyArray<T>, f: (x: T, i: number) => T): ReadonlyArray<T>;
  function sameMap<T>(array: T[] | undefined, f: (x: T, i: number) => T): T[] | undefined;
  function sameMap<T>(array: ReadonlyArray<T> | undefined, f: (x: T, i: number) => T): ReadonlyArray<T> | undefined;
  /**
   * Flattens an array containing a mix of array or non-array elements.
   *
   * @param array The array to flatten.
   */
  function flatten<T>(array: T[][] | ReadonlyArray<T | ReadonlyArray<T> | undefined>): T[];
  /**
   * Maps an array. If the mapped value is an array, it is spread into the result.
   *
   * @param array The array to map.
   * @param mapfn The callback used to map the result into one or more values.
   */
  function flatMap<T, U>(array: ReadonlyArray<T> | undefined, mapfn: (x: T, i: number) => U | ReadonlyArray<U> | undefined): ReadonlyArray<U>;
  function flatMapToMutable<T, U>(array: ReadonlyArray<T> | undefined, mapfn: (x: T, i: number) => U | ReadonlyArray<U> | undefined): U[];
  function flatMapIterator<T, U>(iter: Iterator<T>, mapfn: (x: T) => ReadonlyArray<U> | Iterator<U> | undefined): Iterator<U>;
  /**
   * Maps an array. If the mapped value is an array, it is spread into the result.
   * Avoids allocation if all elements map to themselves.
   *
   * @param array The array to map.
   * @param mapfn The callback used to map the result into one or more values.
   */
  function sameFlatMap<T>(array: T[], mapfn: (x: T, i: number) => T | ReadonlyArray<T>): T[];
  function sameFlatMap<T>(array: ReadonlyArray<T>, mapfn: (x: T, i: number) => T | ReadonlyArray<T>): ReadonlyArray<T>;
  function mapAllOrFail<T, U>(array: ReadonlyArray<T>, mapFn: (x: T, i: number) => U | undefined): U[] | undefined;
  function mapDefined<T, U>(array: ReadonlyArray<T> | undefined, mapFn: (x: T, i: number) => U | undefined): U[];
  function mapDefinedIterator<T, U>(iter: Iterator<T>, mapFn: (x: T) => U | undefined): Iterator<U>;
  const emptyIterator: Iterator<never>;
  function singleIterator<T>(value: T): Iterator<T>;
  /**
   * Maps contiguous spans of values with the same key.
   *
   * @param array The array to map.
   * @param keyfn A callback used to select the key for an element.
   * @param mapfn A callback used to map a contiguous chunk of values to a single value.
   */
  function spanMap<T, K, U>(array: ReadonlyArray<T>, keyfn: (x: T, i: number) => K, mapfn: (chunk: T[], key: K, start: number, end: number) => U): U[];
  function spanMap<T, K, U>(array: ReadonlyArray<T> | undefined, keyfn: (x: T, i: number) => K, mapfn: (chunk: T[], key: K, start: number, end: number) => U): U[] | undefined;
  function mapEntries<T, U>(map: ReadonlyMap<T>, f: (key: string, value: T) => [string, U]): Map<U>;
  function mapEntries<T, U>(map: ReadonlyMap<T> | undefined, f: (key: string, value: T) => [string, U]): Map<U> | undefined;
  function some<T>(array: ReadonlyArray<T> | undefined): array is ReadonlyArray<T>;
  function some<T>(array: ReadonlyArray<T> | undefined, predicate: (value: T) => boolean): boolean;
  /** Calls the callback with (start, afterEnd) index pairs for each range where 'pred' is true. */
  function getRangesWhere<T>(arr: ReadonlyArray<T>, pred: (t: T) => boolean, cb: (start: number, afterEnd: number) => void): void;
  function concatenate<T>(array1: T[], array2: T[]): T[];
  function concatenate<T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>): ReadonlyArray<T>;
  function concatenate<T>(array1: T[] | undefined, array2: T[] | undefined): T[];
  function concatenate<T>(array1: ReadonlyArray<T> | undefined, array2: ReadonlyArray<T> | undefined): ReadonlyArray<T>;
  /**
   * Deduplicates an unsorted array.
   * @param equalityComparer An `EqualityComparer` used to determine if two values are duplicates.
   * @param comparer An optional `Comparer` used to sort entries before comparison, though the
   * result will remain in the original order in `array`.
   */
  function deduplicate<T>(array: ReadonlyArray<T>, equalityComparer: EqualityComparer<T>, comparer?: Comparer<T>): T[];
  function insertSorted<T>(array: SortedArray<T>, insert: T, compare: Comparer<T>): void;
  function sortAndDeduplicate<T>(array: ReadonlyArray<string>): SortedReadonlyArray<string>;
  function sortAndDeduplicate<T>(array: ReadonlyArray<T>, comparer: Comparer<T>, equalityComparer?: EqualityComparer<T>): SortedReadonlyArray<T>;
  function arrayIsEqualTo<T>(array1: ReadonlyArray<T> | undefined, array2: ReadonlyArray<T> | undefined, equalityComparer?: (a: T, b: T, index: number) => boolean): boolean;
  /**
   * Compacts an array, removing any falsey elements.
   */
  function compact<T>(array: (T | undefined | null | false | 0 | "")[]): T[];
  function compact<T>(array: ReadonlyArray<T | undefined | null | false | 0 | "">): ReadonlyArray<T>;
  function compact<T>(array: T[]): T[];
  function compact<T>(array: ReadonlyArray<T>): ReadonlyArray<T>;
  /**
   * Gets the relative complement of `arrayA` with respect to `arrayB`, returning the elements that
   * are not present in `arrayA` but are present in `arrayB`. Assumes both arrays are sorted
   * based on the provided comparer.
   */
  function relativeComplement<T>(arrayA: T[] | undefined, arrayB: T[] | undefined, comparer: Comparer<T>): T[] | undefined;
  function sum<T extends Record<K, number>, K extends string>(array: ReadonlyArray<T>, prop: K): number;
  /**
   * Appends a value to an array, returning the array.
   *
   * @param to The array to which `value` is to be appended. If `to` is `undefined`, a new array
   * is created if `value` was appended.
   * @param value The value to append to the array. If `value` is `undefined`, nothing is
   * appended.
   */
  function append<TArray extends any[] | undefined, TValue extends NonNullable<TArray>[number] | undefined>(to: TArray, value: TValue): [undefined, undefined] extends [TArray, TValue] ? TArray : NonNullable<TArray>[number][];
  function append<T>(to: T[], value: T | undefined): T[];
  function append<T>(to: T[] | undefined, value: T): T[];
  function append<T>(to: T[] | undefined, value: T | undefined): T[] | undefined;
  function append<T>(to: Push<T>, value: T | undefined): void;
  /**
   * Appends a range of value to an array, returning the array.
   *
   * @param to The array to which `value` is to be appended. If `to` is `undefined`, a new array
   * is created if `value` was appended.
   * @param from The values to append to the array. If `from` is `undefined`, nothing is
   * appended. If an element of `from` is `undefined`, that element is not appended.
   * @param start The offset in `from` at which to start copying values.
   * @param end The offset in `from` at which to stop copying values (non-inclusive).
   */
  function addRange<T>(to: T[], from: ReadonlyArray<T> | undefined, start?: number, end?: number): T[];
  function addRange<T>(to: T[] | undefined, from: ReadonlyArray<T> | undefined, start?: number, end?: number): T[] | undefined;
  /**
   * @return Whether the value was added.
   */
  function pushIfUnique<T>(array: T[], toAdd: T, equalityComparer?: EqualityComparer<T>): boolean;
  /**
   * Unlike `pushIfUnique`, this can take `undefined` as an input, and returns a new array.
   */
  function appendIfUnique<T>(array: T[] | undefined, toAdd: T, equalityComparer?: EqualityComparer<T>): T[];
  /**
   * Returns a new sorted array.
   */
  function sort<T>(array: ReadonlyArray<T>, comparer?: Comparer<T>): SortedReadonlyArray<T>;
  function arrayIterator<T>(array: ReadonlyArray<T>): Iterator<T>;
  function arrayReverseIterator<T>(array: ReadonlyArray<T>): Iterator<T>;
  /**
   * Stable sort of an array. Elements equal to each other maintain their relative position in the array.
   */
  function stableSort<T>(array: ReadonlyArray<T>, comparer: Comparer<T>): SortedReadonlyArray<T>;
  function rangeEquals<T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>, pos: number, end: number): boolean;
  /**
   * Returns the element at a specific offset in an array if non-empty, `undefined` otherwise.
   * A negative offset indicates the element should be retrieved from the end of the array.
   */
  function elementAt<T>(array: ReadonlyArray<T> | undefined, offset: number): T | undefined;
  /**
   * Returns the first element of an array if non-empty, `undefined` otherwise.
   */
  function firstOrUndefined<T>(array: ReadonlyArray<T>): T | undefined;
  function first<T>(array: ReadonlyArray<T>): T;
  /**
   * Returns the last element of an array if non-empty, `undefined` otherwise.
   */
  function lastOrUndefined<T>(array: ReadonlyArray<T>): T | undefined;
  function last<T>(array: ReadonlyArray<T>): T;
  /**
   * Returns the only element of an array if it contains only one element, `undefined` otherwise.
   */
  function singleOrUndefined<T>(array: ReadonlyArray<T> | undefined): T | undefined;
  /**
   * Returns the only element of an array if it contains only one element; otherwise, returns the
   * array.
   */
  function singleOrMany<T>(array: T[]): T | T[];
  function singleOrMany<T>(array: ReadonlyArray<T>): T | ReadonlyArray<T>;
  function singleOrMany<T>(array: T[] | undefined): T | T[] | undefined;
  function singleOrMany<T>(array: ReadonlyArray<T> | undefined): T | ReadonlyArray<T> | undefined;
  function replaceElement<T>(array: ReadonlyArray<T>, index: number, value: T): T[];
  /**
   * Performs a binary search, finding the index at which `value` occurs in `array`.
   * If no such index is found, returns the 2's-complement of first index at which
   * `array[index]` exceeds `value`.
   * @param array A sorted array whose first element must be no larger than number
   * @param value The value to be searched for in the array.
   * @param keySelector A callback used to select the search key from `value` and each element of
   * `array`.
   * @param keyComparer A callback used to compare two keys in a sorted array.
   * @param offset An offset into `array` at which to start the search.
   */
  function binarySearch<T, U>(array: ReadonlyArray<T>, value: T, keySelector: (v: T) => U, keyComparer: Comparer<U>, offset?: number): number;
  /**
   * Performs a binary search, finding the index at which an object with `key` occurs in `array`.
   * If no such index is found, returns the 2's-complement of first index at which
   * `array[index]` exceeds `key`.
   * @param array A sorted array whose first element must be no larger than number
   * @param key The key to be searched for in the array.
   * @param keySelector A callback used to select the search key from each element of `array`.
   * @param keyComparer A callback used to compare two keys in a sorted array.
   * @param offset An offset into `array` at which to start the search.
   */
  function binarySearchKey<T, U>(array: ReadonlyArray<T>, key: U, keySelector: (v: T) => U, keyComparer: Comparer<U>, offset?: number): number;
  function reduceLeft<T, U>(array: ReadonlyArray<T> | undefined, f: (memo: U, value: T, i: number) => U, initial: U, start?: number, count?: number): U;
  function reduceLeft<T>(array: ReadonlyArray<T>, f: (memo: T, value: T, i: number) => T): T | undefined;
  /**
   * Indicates whether a map-like contains an own property with the specified key.
   *
   * @param map A map-like.
   * @param key A property key.
   */
  function hasProperty(map: MapLike<any>, key: string): boolean;
  /**
   * Gets the value of an owned property in a map-like.
   *
   * @param map A map-like.
   * @param key A property key.
   */
  function getProperty<T>(map: MapLike<T>, key: string): T | undefined;
  /**
   * Gets the owned, enumerable property keys of a map-like.
   */
  function getOwnKeys<T>(map: MapLike<T>): string[];
  function getAllKeys(obj: object): string[];
  function getOwnValues<T>(sparseArray: T[]): T[];
  /** Shims `Array.from`. */
  function arrayFrom<T, U>(iterator: Iterator<T> | IterableIterator<T>, map: (t: T) => U): U[];
  function arrayFrom<T>(iterator: Iterator<T> | IterableIterator<T>): T[];
  function assign<T extends object>(t: T, ...args: (T | undefined)[]): T;
  /**
   * Performs a shallow equality comparison of the contents of two map-likes.
   *
   * @param left A map-like whose properties should be compared.
   * @param right A map-like whose properties should be compared.
   */
  function equalOwnProperties<T>(left: MapLike<T> | undefined, right: MapLike<T> | undefined, equalityComparer?: EqualityComparer<T>): boolean;
  /**
   * Creates a map from the elements of an array.
   *
   * @param array the array of input elements.
   * @param makeKey a function that produces a key for a given element.
   *
   * This function makes no effort to avoid collisions; if any two elements produce
   * the same key with the given 'makeKey' function, then the element with the higher
   * index in the array will be the one associated with the produced key.
   */
  function arrayToMap<T>(array: ReadonlyArray<T>, makeKey: (value: T) => string | undefined): Map<T>;
  function arrayToMap<T, U>(array: ReadonlyArray<T>, makeKey: (value: T) => string | undefined, makeValue: (value: T) => U): Map<U>;
  function arrayToNumericMap<T>(array: ReadonlyArray<T>, makeKey: (value: T) => number): T[];
  function arrayToNumericMap<T, U>(array: ReadonlyArray<T>, makeKey: (value: T) => number, makeValue: (value: T) => U): U[];
  function arrayToMultiMap<T>(values: ReadonlyArray<T>, makeKey: (value: T) => string): MultiMap<T>;
  function arrayToMultiMap<T, U>(values: ReadonlyArray<T>, makeKey: (value: T) => string, makeValue: (value: T) => U): MultiMap<U>;
  function group<T>(values: ReadonlyArray<T>, getGroupId: (value: T) => string): ReadonlyArray<ReadonlyArray<T>>;
  function clone<T>(object: T): T;
  function extend<T1, T2>(first: T1, second: T2): T1 & T2;
  function copyProperties<T1 extends T2, T2>(first: T1, second: T2): void;
  function maybeBind<T, A extends any[], R>(obj: T, fn: ((this: T, ...args: A) => R) | undefined): ((...args: A) => R) | undefined;
  interface MultiMap<T> extends Map<T[]> {
    /**
     * Adds the value to an array of values associated with the key, and returns the array.
     * Creates the array if it does not already exist.
     */
    add(key: string, value: T): T[];
    /**
     * Removes a value from an array of values associated with the key.
     * Does not preserve the order of those values.
     * Does nothing if `key` is not in `map`, or `value` is not in `map[key]`.
     */
    remove(key: string, value: T): void;
  }
  function createMultiMap<T>(): MultiMap<T>;
  /**
   * Tests whether a value is an array.
   */
  function isArray(value: any): value is ReadonlyArray<{}>;
  function toArray<T>(value: T | T[]): T[];
  function toArray<T>(value: T | ReadonlyArray<T>): ReadonlyArray<T>;
  /**
   * Tests whether a value is string
   */
  function isString(text: unknown): text is string;
  function isNumber(x: unknown): x is number;
  function tryCast<TOut extends TIn, TIn = any>(value: TIn | undefined, test: (value: TIn) => value is TOut): TOut | undefined;
  function tryCast<T>(value: T, test: (value: T) => boolean): T | undefined;
  function cast<TOut extends TIn, TIn = any>(value: TIn | undefined, test: (value: TIn) => value is TOut): TOut;
  /** Does nothing. */
  function noop(_?: {} | null | undefined): void;
  /** Do nothing and return false */
  function returnFalse(): false;
  /** Do nothing and return true */
  function returnTrue(): true;
  /** Do nothing and return undefined */
  function returnUndefined(): undefined;
  /** Returns its argument. */
  function identity<T>(x: T): T;
  /** Returns lower case string */
  function toLowerCase(x: string): string;
  /** Throws an error because a function is not implemented. */
  function notImplemented(): never;
  function memoize<T>(callback: () => T): () => T;
  /**
   * High-order function, composes functions. Note that functions are composed inside-out;
   * for example, `compose(a, b)` is the equivalent of `x => b(a(x))`.
   *
   * @param args The functions to compose.
   */
  function compose<T>(...args: ((t: T) => T)[]): (t: T) => T;
  enum AssertionLevel {
    None = 0,
    Normal = 1,
    Aggressive = 2,
    VeryAggressive = 3
  }
  /**
   * Safer version of `Function` which should not be called.
   * Every function should be assignable to this, but this should not be assignable to every function.
   */
  type AnyFunction = (...args: never[]) => void;
  type AnyConstructor = new (...args: unknown[]) => unknown;
  function equateValues<T>(a: T, b: T): boolean;
  /**
   * Compare the equality of two strings using a case-sensitive ordinal comparison.
   *
   * Case-sensitive comparisons compare both strings one code-point at a time using the integer
   * value of each code-point after applying `toUpperCase` to each string. We always map both
   * strings to their upper-case form as some unicode characters do not properly round-trip to
   * lowercase (such as `ẞ` (German sharp capital s)).
   */
  function equateStringsCaseInsensitive(a: string, b: string): boolean;
  /**
   * Compare the equality of two strings using a case-sensitive ordinal comparison.
   *
   * Case-sensitive comparisons compare both strings one code-point at a time using the
   * integer value of each code-point.
   */
  function equateStringsCaseSensitive(a: string, b: string): boolean;
  /**
   * Compare two numeric values for their order relative to each other.
   * To compare strings, use any of the `compareStrings` functions.
   */
  function compareValues(a: number | undefined, b: number | undefined): Comparison;
  function min<T>(a: T, b: T, compare: Comparer<T>): T;
  /**
   * Compare two strings using a case-insensitive ordinal comparison.
   *
   * Ordinal comparisons are based on the difference between the unicode code points of both
   * strings. Characters with multiple unicode representations are considered unequal. Ordinal
   * comparisons provide predictable ordering, but place "a" after "B".
   *
   * Case-insensitive comparisons compare both strings one code-point at a time using the integer
   * value of each code-point after applying `toUpperCase` to each string. We always map both
   * strings to their upper-case form as some unicode characters do not properly round-trip to
   * lowercase (such as `áºž` (German sharp capital s)).
   */
  function compareStringsCaseInsensitive(a: string, b: string): Comparison;
  /**
   * Compare two strings using a case-sensitive ordinal comparison.
   *
   * Ordinal comparisons are based on the difference between the unicode code points of both
   * strings. Characters with multiple unicode representations are considered unequal. Ordinal
   * comparisons provide predictable ordering, but place "a" after "B".
   *
   * Case-sensitive comparisons compare both strings one code-point at a time using the integer
   * value of each code-point.
   */
  function compareStringsCaseSensitive(a: string | undefined, b: string | undefined): Comparison;
  function getStringComparer(ignoreCase?: boolean): typeof compareStringsCaseSensitive;
  function getUILocale(): string | undefined;
  function setUILocale(value: string | undefined): void;
  /**
   * Compare two strings in a using the case-sensitive sort behavior of the UI locale.
   *
   * Ordering is not predictable between different host locales, but is best for displaying
   * ordered data for UI presentation. Characters with multiple unicode representations may
   * be considered equal.
   *
   * Case-sensitive comparisons compare strings that differ in base characters, or
   * accents/diacritic marks, or case as unequal.
   */
  function compareStringsCaseSensitiveUI(a: string, b: string): Comparison;
  function compareProperties<T, K extends keyof T>(a: T | undefined, b: T | undefined, key: K, comparer: Comparer<T[K]>): Comparison;
  /** True is greater than false. */
  function compareBooleans(a: boolean, b: boolean): Comparison;
  /**
   * Given a name and a list of names that are *not* equal to the name, return a spelling suggestion if there is one that is close enough.
   * Names less than length 3 only check for case-insensitive equality, not Levenshtein distance.
   *
   * If there is a candidate that's the same except for case, return that.
   * If there is a candidate that's within one edit of the name, return that.
   * Otherwise, return the candidate with the smallest Levenshtein distance,
   *    except for candidates:
   *      * With no name
   *      * Whose length differs from the target name by more than 0.34 of the length of the name.
   *      * Whose levenshtein distance is more than 0.4 of the length of the name
   *        (0.4 allows 1 substitution/transposition for every 5 characters,
   *         and 1 insertion/deletion at 3 characters)
   */
  function getSpellingSuggestion<T>(name: string, candidates: T[], getName: (candidate: T) => string | undefined): T | undefined;
  function endsWith(str: string, suffix: string): boolean;
  function removeSuffix(str: string, suffix: string): string;
  function tryRemoveSuffix(str: string, suffix: string): string | undefined;
  function stringContains(str: string, substring: string): boolean;
  function fileExtensionIs(path: string, extension: string): boolean;
  function fileExtensionIsOneOf(path: string, extensions: ReadonlyArray<string>): boolean;
  /**
   * Takes a string like "jquery-min.4.2.3" and returns "jquery"
   */
  function removeMinAndVersionNumbers(fileName: string): string;
  /** Remove an item from an array, moving everything to its right one space left. */
  function orderedRemoveItem<T>(array: T[], item: T): boolean;
  /** Remove an item by index from an array, moving everything to its right one space left. */
  function orderedRemoveItemAt<T>(array: T[], index: number): void;
  function unorderedRemoveItemAt<T>(array: T[], index: number): void;
  /** Remove the *first* occurrence of `item` from the array. */
  function unorderedRemoveItem<T>(array: T[], item: T): boolean;
  type GetCanonicalFileName = (fileName: string) => string;
  function createGetCanonicalFileName(useCaseSensitiveFileNames: boolean): GetCanonicalFileName;
  /** Represents a "prefix*suffix" pattern. */
  interface Pattern {
    prefix: string;
    suffix: string;
  }
  function patternText({ prefix, suffix }: Pattern): string;
  /**
   * Given that candidate matches pattern, returns the text matching the '*'.
   * E.g.: matchedText(tryParsePattern("foo*baz"), "foobarbaz") === "bar"
   */
  function matchedText(pattern: Pattern, candidate: string): string;
  /** Return the object corresponding to the best pattern to match `candidate`. */
  function findBestPatternMatch<T>(values: ReadonlyArray<T>, getPattern: (value: T) => Pattern, candidate: string): T | undefined;
  function startsWith(str: string, prefix: string): boolean;
  function removePrefix(str: string, prefix: string): string;
  function tryRemovePrefix(str: string, prefix: string, getCanonicalFileName?: GetCanonicalFileName): string | undefined;
  function and<T>(f: (arg: T) => boolean, g: (arg: T) => boolean): (arg: T) => boolean;
  function or<T>(f: (arg: T) => boolean, g: (arg: T) => boolean): (arg: T) => boolean;
  function assertType<T>(_: T): void;
  function singleElementArray<T>(t: T | undefined): T[] | undefined;
  function enumerateInsertsAndDeletes<T, U>(newItems: ReadonlyArray<T>, oldItems: ReadonlyArray<U>, comparer: (a: T, b: U) => Comparison, inserted: (newItem: T) => void, deleted: (oldItem: U) => void, unchanged?: (oldItem: U, newItem: T) => void): void;
  function fill<T>(length: number, cb: (index: number) => T): T[];
  function cartesianProduct<T>(arrays: readonly T[][]): T[][];
}
declare namespace ts {
  namespace Debug {
    let currentAssertionLevel: AssertionLevel;
    let isDebugging: boolean;
    function shouldAssert(level: AssertionLevel): boolean;
    function assert(expression: boolean, message?: string, verboseDebugInfo?: string | (() => string), stackCrawlMark?: AnyFunction): void;
    function assertEqual<T>(a: T, b: T, msg?: string, msg2?: string): void;
    function assertLessThan(a: number, b: number, msg?: string): void;
    function assertLessThanOrEqual(a: number, b: number): void;
    function assertGreaterThanOrEqual(a: number, b: number): void;
    function fail(message?: string, stackCrawlMark?: AnyFunction): never;
    function assertDefined<T>(value: T | null | undefined, message?: string): T;
    function assertEachDefined<T, A extends ReadonlyArray<T>>(value: A, message?: string): A;
    function assertNever(member: never, message?: string, stackCrawlMark?: AnyFunction): never;
    function getFunctionName(func: AnyFunction): any;
    function formatSymbol(symbol: Symbol): string;
    /**
     * Formats an enum value as a string for debugging and debug assertions.
     */
    function formatEnum(value: number | undefined, enumObject: any, isFlags?: boolean): string;
    function formatSyntaxKind(kind: SyntaxKind | undefined): string;
    function formatNodeFlags(flags: NodeFlags | undefined): string;
    function formatModifierFlags(flags: ModifierFlags | undefined): string;
    function formatTransformFlags(flags: TransformFlags | undefined): string;
    function formatEmitFlags(flags: EmitFlags | undefined): string;
    function formatSymbolFlags(flags: SymbolFlags | undefined): string;
    function formatTypeFlags(flags: TypeFlags | undefined): string;
    function formatObjectFlags(flags: ObjectFlags | undefined): string;
    function failBadSyntaxKind(node: Node, message?: string): never;
    const assertEachNode: (nodes: Node[], test: (node: Node) => boolean, message?: string | undefined) => void;
    const assertNode: (node: Node | undefined, test: ((node: Node | undefined) => boolean) | undefined, message?: string | undefined) => void;
    const assertOptionalNode: (node: Node, test: (node: Node) => boolean, message?: string | undefined) => void;
    const assertOptionalToken: (node: Node, kind: SyntaxKind, message?: string | undefined) => void;
    const assertMissingNode: typeof noop;
    /**
     * Injects debug information into frequently used types.
     */
    function enableDebugInfo(): void;
  }
}
declare namespace ts {
  /** Gets a timestamp with (at least) ms resolution */
  const timestamp: () => number;
}
/** Performance measurements for the compiler. */
declare namespace ts.performance {
  interface Timer {
    enter(): void;
    exit(): void;
  }
  function createTimerIf(condition: boolean, measureName: string, startMarkName: string, endMarkName: string): Timer;
  function createTimer(measureName: string, startMarkName: string, endMarkName: string): Timer;
  const nullTimer: Timer;
  /**
   * Marks a performance event.
   *
   * @param markName The name of the mark.
   */
  function mark(markName: string): void;
  /**
   * Adds a performance measurement with the specified name.
   *
   * @param measureName The name of the performance measurement.
   * @param startMarkName The name of the starting mark. If not supplied, the point at which the
   *      profiler was enabled is used.
   * @param endMarkName The name of the ending mark. If not supplied, the current timestamp is
   *      used.
   */
  function measure(measureName: string, startMarkName?: string, endMarkName?: string): void;
  /**
   * Gets the number of times a marker was encountered.
   *
   * @param markName The name of the mark.
   */
  function getCount(markName: string): number;
  /**
   * Gets the total duration of all measurements with the supplied name.
   *
   * @param measureName The name of the measure whose durations should be accumulated.
   */
  function getDuration(measureName: string): number;
  /**
   * Iterate over each measure, performing some action
   *
   * @param cb The action to perform for each measure
   */
  function forEachMeasure(cb: (measureName: string, duration: number) => void): void;
  /** Enables (and resets) performance measurements for the compiler. */
  function enable(): void;
  /** Disables performance measurements for the compiler. */
  function disable(): void;
}
declare namespace ts {
  export {};
}
declare namespace ts {
  /**
   * Describes a precise semantic version number, https://semver.org
   */
  class Version {
    static readonly zero: Version;
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease: ReadonlyArray<string>;
    readonly build: ReadonlyArray<string>;
    constructor(text: string);
    constructor(major: number, minor?: number, patch?: number, prerelease?: string, build?: string);
    static tryParse(text: string): Version | undefined;
    compareTo(other: Version | undefined): Comparison.LessThan | Comparison.LessThan | Comparison | Comparison.GreaterThan;
    increment(field: "major" | "minor" | "patch"): Version;
    toString(): string;
  }
  /**
   * Describes a semantic version range, per https://github.com/npm/node-semver#ranges
   */
  class VersionRange {
    private _alternatives;
    constructor(spec: string);
    static tryParse(text: string): VersionRange | undefined;
    test(version: Version | string): boolean;
    toString(): string;
  }
}
declare namespace ts {
  export type Path = string & {
    __pathBrand: any;
  };
  export interface TextRange {
    pos: number;
    end: number;
  }
  export type JSDocSyntaxKind = SyntaxKind.EndOfFileToken | SyntaxKind.WhitespaceTrivia | SyntaxKind.AtToken | SyntaxKind.NewLineTrivia | SyntaxKind.AsteriskToken | SyntaxKind.OpenBraceToken | SyntaxKind.CloseBraceToken | SyntaxKind.LessThanToken | SyntaxKind.GreaterThanToken | SyntaxKind.OpenBracketToken | SyntaxKind.CloseBracketToken | SyntaxKind.EqualsToken | SyntaxKind.CommaToken | SyntaxKind.DotToken | SyntaxKind.Identifier | SyntaxKind.BacktickToken | SyntaxKind.Unknown | KeywordSyntaxKind;
  export type KeywordSyntaxKind = SyntaxKind.AbstractKeyword | SyntaxKind.AnyKeyword | SyntaxKind.AsKeyword | SyntaxKind.BigIntKeyword | SyntaxKind.BooleanKeyword | SyntaxKind.BreakKeyword | SyntaxKind.CaseKeyword | SyntaxKind.CatchKeyword | SyntaxKind.ClassKeyword | SyntaxKind.ContinueKeyword | SyntaxKind.ConstKeyword | SyntaxKind.ConstructorKeyword | SyntaxKind.DebuggerKeyword | SyntaxKind.DeclareKeyword | SyntaxKind.DefaultKeyword | SyntaxKind.DeleteKeyword | SyntaxKind.DoKeyword | SyntaxKind.ElseKeyword | SyntaxKind.EnumKeyword | SyntaxKind.ExportKeyword | SyntaxKind.ExtendsKeyword | SyntaxKind.FalseKeyword | SyntaxKind.FinallyKeyword | SyntaxKind.ForKeyword | SyntaxKind.FromKeyword | SyntaxKind.FunctionKeyword | SyntaxKind.GetKeyword | SyntaxKind.IfKeyword | SyntaxKind.ImplementsKeyword | SyntaxKind.ImportKeyword | SyntaxKind.InKeyword | SyntaxKind.InferKeyword | SyntaxKind.InstanceOfKeyword | SyntaxKind.InterfaceKeyword | SyntaxKind.IsKeyword | SyntaxKind.KeyOfKeyword | SyntaxKind.LetKeyword | SyntaxKind.ModuleKeyword | SyntaxKind.NamespaceKeyword | SyntaxKind.NeverKeyword | SyntaxKind.NewKeyword | SyntaxKind.NullKeyword | SyntaxKind.NumberKeyword | SyntaxKind.ObjectKeyword | SyntaxKind.PackageKeyword | SyntaxKind.PrivateKeyword | SyntaxKind.ProtectedKeyword | SyntaxKind.PublicKeyword | SyntaxKind.ReadonlyKeyword | SyntaxKind.RequireKeyword | SyntaxKind.GlobalKeyword | SyntaxKind.ReturnKeyword | SyntaxKind.SetKeyword | SyntaxKind.StaticKeyword | SyntaxKind.StringKeyword | SyntaxKind.SuperKeyword | SyntaxKind.SwitchKeyword | SyntaxKind.SymbolKeyword | SyntaxKind.ThisKeyword | SyntaxKind.ThrowKeyword | SyntaxKind.TrueKeyword | SyntaxKind.TryKeyword | SyntaxKind.TypeKeyword | SyntaxKind.TypeOfKeyword | SyntaxKind.UndefinedKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.UnknownKeyword | SyntaxKind.VarKeyword | SyntaxKind.VoidKeyword | SyntaxKind.WhileKeyword | SyntaxKind.WithKeyword | SyntaxKind.YieldKeyword | SyntaxKind.AsyncKeyword | SyntaxKind.AwaitKeyword | SyntaxKind.OfKeyword;
  export type JsxTokenSyntaxKind = SyntaxKind.LessThanSlashToken | SyntaxKind.EndOfFileToken | SyntaxKind.ConflictMarkerTrivia | SyntaxKind.JsxText | SyntaxKind.JsxTextAllWhiteSpaces | SyntaxKind.OpenBraceToken | SyntaxKind.LessThanToken;
  export enum SyntaxKind {
    Unknown = 0,
    EndOfFileToken = 1,
    SingleLineCommentTrivia = 2,
    MultiLineCommentTrivia = 3,
    NewLineTrivia = 4,
    WhitespaceTrivia = 5,
    ShebangTrivia = 6,
    ConflictMarkerTrivia = 7,
    NumericLiteral = 8,
    BigIntLiteral = 9,
    StringLiteral = 10,
    JsxText = 11,
    JsxTextAllWhiteSpaces = 12,
    RegularExpressionLiteral = 13,
    NoSubstitutionTemplateLiteral = 14,
    TemplateHead = 15,
    TemplateMiddle = 16,
    TemplateTail = 17,
    OpenBraceToken = 18,
    CloseBraceToken = 19,
    OpenParenToken = 20,
    CloseParenToken = 21,
    OpenBracketToken = 22,
    CloseBracketToken = 23,
    DotToken = 24,
    DotDotDotToken = 25,
    SemicolonToken = 26,
    CommaToken = 27,
    LessThanToken = 28,
    LessThanSlashToken = 29,
    GreaterThanToken = 30,
    LessThanEqualsToken = 31,
    GreaterThanEqualsToken = 32,
    EqualsEqualsToken = 33,
    ExclamationEqualsToken = 34,
    EqualsEqualsEqualsToken = 35,
    ExclamationEqualsEqualsToken = 36,
    EqualsGreaterThanToken = 37,
    PlusToken = 38,
    MinusToken = 39,
    AsteriskToken = 40,
    AsteriskAsteriskToken = 41,
    SlashToken = 42,
    PercentToken = 43,
    PlusPlusToken = 44,
    MinusMinusToken = 45,
    LessThanLessThanToken = 46,
    GreaterThanGreaterThanToken = 47,
    GreaterThanGreaterThanGreaterThanToken = 48,
    AmpersandToken = 49,
    BarToken = 50,
    CaretToken = 51,
    ExclamationToken = 52,
    TildeToken = 53,
    AmpersandAmpersandToken = 54,
    BarBarToken = 55,
    QuestionToken = 56,
    ColonToken = 57,
    AtToken = 58,
    /** Only the JSDoc scanner produces BacktickToken. The normal scanner produces NoSubstitutionTemplateLiteral and related kinds. */
    BacktickToken = 59,
    EqualsToken = 60,
    PlusEqualsToken = 61,
    MinusEqualsToken = 62,
    AsteriskEqualsToken = 63,
    AsteriskAsteriskEqualsToken = 64,
    SlashEqualsToken = 65,
    PercentEqualsToken = 66,
    LessThanLessThanEqualsToken = 67,
    GreaterThanGreaterThanEqualsToken = 68,
    GreaterThanGreaterThanGreaterThanEqualsToken = 69,
    AmpersandEqualsToken = 70,
    BarEqualsToken = 71,
    CaretEqualsToken = 72,
    Identifier = 73,
    BreakKeyword = 74,
    CaseKeyword = 75,
    CatchKeyword = 76,
    ClassKeyword = 77,
    ConstKeyword = 78,
    ContinueKeyword = 79,
    DebuggerKeyword = 80,
    DefaultKeyword = 81,
    DeleteKeyword = 82,
    DoKeyword = 83,
    ElseKeyword = 84,
    EnumKeyword = 85,
    ExportKeyword = 86,
    ExtendsKeyword = 87,
    FalseKeyword = 88,
    FinallyKeyword = 89,
    ForKeyword = 90,
    FunctionKeyword = 91,
    IfKeyword = 92,
    ImportKeyword = 93,
    InKeyword = 94,
    InstanceOfKeyword = 95,
    NewKeyword = 96,
    NullKeyword = 97,
    ReturnKeyword = 98,
    SuperKeyword = 99,
    SwitchKeyword = 100,
    ThisKeyword = 101,
    ThrowKeyword = 102,
    TrueKeyword = 103,
    TryKeyword = 104,
    TypeOfKeyword = 105,
    VarKeyword = 106,
    VoidKeyword = 107,
    WhileKeyword = 108,
    WithKeyword = 109,
    ImplementsKeyword = 110,
    InterfaceKeyword = 111,
    LetKeyword = 112,
    PackageKeyword = 113,
    PrivateKeyword = 114,
    ProtectedKeyword = 115,
    PublicKeyword = 116,
    StaticKeyword = 117,
    YieldKeyword = 118,
    AbstractKeyword = 119,
    AsKeyword = 120,
    AnyKeyword = 121,
    AsyncKeyword = 122,
    AwaitKeyword = 123,
    BooleanKeyword = 124,
    ConstructorKeyword = 125,
    DeclareKeyword = 126,
    GetKeyword = 127,
    InferKeyword = 128,
    IsKeyword = 129,
    KeyOfKeyword = 130,
    ModuleKeyword = 131,
    NamespaceKeyword = 132,
    NeverKeyword = 133,
    ReadonlyKeyword = 134,
    RequireKeyword = 135,
    NumberKeyword = 136,
    ObjectKeyword = 137,
    SetKeyword = 138,
    StringKeyword = 139,
    SymbolKeyword = 140,
    TypeKeyword = 141,
    UndefinedKeyword = 142,
    UniqueKeyword = 143,
    UnknownKeyword = 144,
    FromKeyword = 145,
    GlobalKeyword = 146,
    BigIntKeyword = 147,
    OfKeyword = 148,
    QualifiedName = 149,
    ComputedPropertyName = 150,
    TypeParameter = 151,
    Parameter = 152,
    Decorator = 153,
    PropertySignature = 154,
    PropertyDeclaration = 155,
    MethodSignature = 156,
    MethodDeclaration = 157,
    Constructor = 158,
    GetAccessor = 159,
    SetAccessor = 160,
    CallSignature = 161,
    ConstructSignature = 162,
    IndexSignature = 163,
    TypePredicate = 164,
    TypeReference = 165,
    FunctionType = 166,
    ConstructorType = 167,
    TypeQuery = 168,
    TypeLiteral = 169,
    ArrayType = 170,
    TupleType = 171,
    OptionalType = 172,
    RestType = 173,
    UnionType = 174,
    IntersectionType = 175,
    ConditionalType = 176,
    InferType = 177,
    ParenthesizedType = 178,
    ThisType = 179,
    TypeOperator = 180,
    IndexedAccessType = 181,
    MappedType = 182,
    LiteralType = 183,
    ImportType = 184,
    ObjectBindingPattern = 185,
    ArrayBindingPattern = 186,
    BindingElement = 187,
    ArrayLiteralExpression = 188,
    ObjectLiteralExpression = 189,
    PropertyAccessExpression = 190,
    ElementAccessExpression = 191,
    CallExpression = 192,
    NewExpression = 193,
    TaggedTemplateExpression = 194,
    TypeAssertionExpression = 195,
    ParenthesizedExpression = 196,
    FunctionExpression = 197,
    ArrowFunction = 198,
    DeleteExpression = 199,
    TypeOfExpression = 200,
    VoidExpression = 201,
    AwaitExpression = 202,
    PrefixUnaryExpression = 203,
    PostfixUnaryExpression = 204,
    BinaryExpression = 205,
    ConditionalExpression = 206,
    TemplateExpression = 207,
    YieldExpression = 208,
    SpreadElement = 209,
    ClassExpression = 210,
    OmittedExpression = 211,
    ExpressionWithTypeArguments = 212,
    AsExpression = 213,
    NonNullExpression = 214,
    MetaProperty = 215,
    SyntheticExpression = 216,
    TemplateSpan = 217,
    SemicolonClassElement = 218,
    Block = 219,
    VariableStatement = 220,
    EmptyStatement = 221,
    ExpressionStatement = 222,
    IfStatement = 223,
    DoStatement = 224,
    WhileStatement = 225,
    ForStatement = 226,
    ForInStatement = 227,
    ForOfStatement = 228,
    ContinueStatement = 229,
    BreakStatement = 230,
    ReturnStatement = 231,
    WithStatement = 232,
    SwitchStatement = 233,
    LabeledStatement = 234,
    ThrowStatement = 235,
    TryStatement = 236,
    DebuggerStatement = 237,
    VariableDeclaration = 238,
    VariableDeclarationList = 239,
    FunctionDeclaration = 240,
    ClassDeclaration = 241,
    InterfaceDeclaration = 242,
    TypeAliasDeclaration = 243,
    EnumDeclaration = 244,
    ModuleDeclaration = 245,
    ModuleBlock = 246,
    CaseBlock = 247,
    NamespaceExportDeclaration = 248,
    ImportEqualsDeclaration = 249,
    ImportDeclaration = 250,
    ImportClause = 251,
    NamespaceImport = 252,
    NamedImports = 253,
    ImportSpecifier = 254,
    ExportAssignment = 255,
    ExportDeclaration = 256,
    NamedExports = 257,
    ExportSpecifier = 258,
    MissingDeclaration = 259,
    ExternalModuleReference = 260,
    JsxElement = 261,
    JsxSelfClosingElement = 262,
    JsxOpeningElement = 263,
    JsxClosingElement = 264,
    JsxFragment = 265,
    JsxOpeningFragment = 266,
    JsxClosingFragment = 267,
    JsxAttribute = 268,
    JsxAttributes = 269,
    JsxSpreadAttribute = 270,
    JsxExpression = 271,
    CaseClause = 272,
    DefaultClause = 273,
    HeritageClause = 274,
    CatchClause = 275,
    PropertyAssignment = 276,
    ShorthandPropertyAssignment = 277,
    SpreadAssignment = 278,
    EnumMember = 279,
    UnparsedPrologue = 280,
    UnparsedPrepend = 281,
    UnparsedText = 282,
    UnparsedInternalText = 283,
    UnparsedSyntheticReference = 284,
    SourceFile = 285,
    Bundle = 286,
    UnparsedSource = 287,
    InputFiles = 288,
    JSDocTypeExpression = 289,
    JSDocAllType = 290,
    JSDocUnknownType = 291,
    JSDocNullableType = 292,
    JSDocNonNullableType = 293,
    JSDocOptionalType = 294,
    JSDocFunctionType = 295,
    JSDocVariadicType = 296,
    JSDocNamepathType = 297,
    JSDocComment = 298,
    JSDocTypeLiteral = 299,
    JSDocSignature = 300,
    JSDocTag = 301,
    JSDocAugmentsTag = 302,
    JSDocAuthorTag = 303,
    JSDocClassTag = 304,
    JSDocCallbackTag = 305,
    JSDocEnumTag = 306,
    JSDocParameterTag = 307,
    JSDocReturnTag = 308,
    JSDocThisTag = 309,
    JSDocTypeTag = 310,
    JSDocTemplateTag = 311,
    JSDocTypedefTag = 312,
    JSDocPropertyTag = 313,
    SyntaxList = 314,
    NotEmittedStatement = 315,
    PartiallyEmittedExpression = 316,
    CommaListExpression = 317,
    MergeDeclarationMarker = 318,
    EndOfDeclarationMarker = 319,
    Count = 320,
    FirstAssignment = 60,
    LastAssignment = 72,
    FirstCompoundAssignment = 61,
    LastCompoundAssignment = 72,
    FirstReservedWord = 74,
    LastReservedWord = 109,
    FirstKeyword = 74,
    LastKeyword = 148,
    FirstFutureReservedWord = 110,
    LastFutureReservedWord = 118,
    FirstTypeNode = 164,
    LastTypeNode = 184,
    FirstPunctuation = 18,
    LastPunctuation = 72,
    FirstToken = 0,
    LastToken = 148,
    FirstTriviaToken = 2,
    LastTriviaToken = 7,
    FirstLiteralToken = 8,
    LastLiteralToken = 14,
    FirstTemplateToken = 14,
    LastTemplateToken = 17,
    FirstBinaryOperator = 28,
    LastBinaryOperator = 72,
    FirstNode = 149,
    FirstJSDocNode = 289,
    LastJSDocNode = 313,
    FirstJSDocTagNode = 301,
    LastJSDocTagNode = 313,
    FirstContextualKeyword = 119,
    LastContextualKeyword = 148
  }
  export enum NodeFlags {
    None = 0,
    Let = 1,
    Const = 2,
    NestedNamespace = 4,
    Synthesized = 8,
    Namespace = 16,
    ExportContext = 32,
    ContainsThis = 64,
    HasImplicitReturn = 128,
    HasExplicitReturn = 256,
    GlobalAugmentation = 512,
    HasAsyncFunctions = 1024,
    DisallowInContext = 2048,
    YieldContext = 4096,
    DecoratorContext = 8192,
    AwaitContext = 16384,
    ThisNodeHasError = 32768,
    JavaScriptFile = 65536,
    ThisNodeOrAnySubNodesHasError = 131072,
    HasAggregatedChildData = 262144,
    PossiblyContainsDynamicImport = 524288,
    PossiblyContainsImportMeta = 1048576,
    JSDoc = 2097152,
    Ambient = 4194304,
    InWithStatement = 8388608,
    JsonFile = 16777216,
    BlockScoped = 3,
    ReachabilityCheckFlags = 384,
    ReachabilityAndEmitFlags = 1408,
    ContextFlags = 12679168,
    TypeExcludesFlags = 20480,
    PermanentlySetIncrementalFlags = 1572864
  }
  export enum ModifierFlags {
    None = 0,
    Export = 1,
    Ambient = 2,
    Public = 4,
    Private = 8,
    Protected = 16,
    Static = 32,
    Readonly = 64,
    Abstract = 128,
    Async = 256,
    Default = 512,
    Const = 2048,
    HasComputedFlags = 536870912,
    AccessibilityModifier = 28,
    ParameterPropertyModifier = 92,
    NonPublicAccessibilityModifier = 24,
    TypeScriptModifier = 2270,
    ExportDefault = 513,
    All = 3071
  }
  export enum JsxFlags {
    None = 0,
    /** An element from a named property of the JSX.IntrinsicElements interface */
    IntrinsicNamedElement = 1,
    /** An element inferred from the string index signature of the JSX.IntrinsicElements interface */
    IntrinsicIndexedElement = 2,
    IntrinsicElement = 3
  }
  export enum RelationComparisonResult {
    Succeeded = 1,
    Failed = 2,
    FailedAndReported = 3
  }
  export interface Node extends TextRange {
    kind: SyntaxKind;
    flags: NodeFlags;
    modifierFlagsCache: ModifierFlags;
    transformFlags: TransformFlags;
    decorators?: NodeArray<Decorator>;
    modifiers?: ModifiersArray;
    id?: number;
    parent: Node;
    original?: Node;
    symbol: Symbol;
    locals?: SymbolTable;
    nextContainer?: Node;
    localSymbol?: Symbol;
    flowNode?: FlowNode;
    emitNode?: EmitNode;
    contextualType?: Type;
    inferenceContext?: InferenceContext;
  }
  export interface JSDocContainer {
    jsDoc?: JSDoc[];
    jsDocCache?: ReadonlyArray<JSDocTag>;
  }
  export type HasJSDoc = ParameterDeclaration | CallSignatureDeclaration | ConstructSignatureDeclaration | MethodSignature | PropertySignature | ArrowFunction | ParenthesizedExpression | SpreadAssignment | ShorthandPropertyAssignment | PropertyAssignment | FunctionExpression | LabeledStatement | ExpressionStatement | VariableStatement | FunctionDeclaration | ConstructorDeclaration | MethodDeclaration | PropertyDeclaration | AccessorDeclaration | ClassLikeDeclaration | InterfaceDeclaration | TypeAliasDeclaration | EnumMember | EnumDeclaration | ModuleDeclaration | ImportEqualsDeclaration | IndexSignatureDeclaration | FunctionTypeNode | ConstructorTypeNode | JSDocFunctionType | ExportDeclaration | EndOfFileToken;
  export type HasType = SignatureDeclaration | VariableDeclaration | ParameterDeclaration | PropertySignature | PropertyDeclaration | TypePredicateNode | ParenthesizedTypeNode | TypeOperatorNode | MappedTypeNode | AssertionExpression | TypeAliasDeclaration | JSDocTypeExpression | JSDocNonNullableType | JSDocNullableType | JSDocOptionalType | JSDocVariadicType;
  export type HasInitializer = HasExpressionInitializer | ForStatement | ForInStatement | ForOfStatement | JsxAttribute;
  export type HasExpressionInitializer = VariableDeclaration | ParameterDeclaration | BindingElement | PropertySignature | PropertyDeclaration | PropertyAssignment | EnumMember;
  export type MutableNodeArray<T extends Node> = NodeArray<T> & T[];
  export interface NodeArray<T extends Node> extends ReadonlyArray<T>, TextRange {
    hasTrailingComma?: boolean;
    transformFlags: TransformFlags;
  }
  export interface Token<TKind extends SyntaxKind> extends Node {
    kind: TKind;
  }
  export type DotDotDotToken = Token<SyntaxKind.DotDotDotToken>;
  export type QuestionToken = Token<SyntaxKind.QuestionToken>;
  export type ExclamationToken = Token<SyntaxKind.ExclamationToken>;
  export type ColonToken = Token<SyntaxKind.ColonToken>;
  export type EqualsToken = Token<SyntaxKind.EqualsToken>;
  export type AsteriskToken = Token<SyntaxKind.AsteriskToken>;
  export type EqualsGreaterThanToken = Token<SyntaxKind.EqualsGreaterThanToken>;
  export type EndOfFileToken = Token<SyntaxKind.EndOfFileToken> & JSDocContainer;
  export type ReadonlyToken = Token<SyntaxKind.ReadonlyKeyword>;
  export type AwaitKeywordToken = Token<SyntaxKind.AwaitKeyword>;
  export type PlusToken = Token<SyntaxKind.PlusToken>;
  export type MinusToken = Token<SyntaxKind.MinusToken>;
  export type Modifier = Token<SyntaxKind.AbstractKeyword> | Token<SyntaxKind.AsyncKeyword> | Token<SyntaxKind.ConstKeyword> | Token<SyntaxKind.DeclareKeyword> | Token<SyntaxKind.DefaultKeyword> | Token<SyntaxKind.ExportKeyword> | Token<SyntaxKind.PublicKeyword> | Token<SyntaxKind.PrivateKeyword> | Token<SyntaxKind.ProtectedKeyword> | Token<SyntaxKind.ReadonlyKeyword> | Token<SyntaxKind.StaticKeyword>;
  export type ModifiersArray = NodeArray<Modifier>;
  export enum GeneratedIdentifierFlags {
    None = 0,
    Auto = 1,
    Loop = 2,
    Unique = 3,
    Node = 4,
    KindMask = 7,
    ReservedInNestedScopes = 8,
    Optimistic = 16,
    FileLevel = 32
  }
  export interface Identifier extends PrimaryExpression, Declaration {
    kind: SyntaxKind.Identifier;
    /**
     * Prefer to use `id.unescapedText`. (Note: This is available only in services, not internally to the TypeScript compiler.)
     * Text of identifier, but if the identifier begins with two underscores, this will begin with three.
     */
    escapedText: __String;
    originalKeywordKind?: SyntaxKind;
    autoGenerateFlags?: GeneratedIdentifierFlags;
    autoGenerateId?: number;
    isInJSDocNamespace?: boolean;
    typeArguments?: NodeArray<TypeNode | TypeParameterDeclaration>;
    jsdocDotPos?: number;
  }
  export interface TransientIdentifier extends Identifier {
    resolvedSymbol: Symbol;
  }
  export interface GeneratedIdentifier extends Identifier {
    autoGenerateFlags: GeneratedIdentifierFlags;
  }
  export interface QualifiedName extends Node {
    kind: SyntaxKind.QualifiedName;
    left: EntityName;
    right: Identifier;
    jsdocDotPos?: number;
  }
  export type EntityName = Identifier | QualifiedName;
  export type PropertyName = Identifier | StringLiteral | NumericLiteral | ComputedPropertyName;
  export type DeclarationName = Identifier | StringLiteralLike | NumericLiteral | ComputedPropertyName | BindingPattern;
  export interface Declaration extends Node {
    _declarationBrand: any;
  }
  export interface NamedDeclaration extends Declaration {
    name?: DeclarationName;
  }
  export interface DynamicNamedDeclaration extends NamedDeclaration {
    name: ComputedPropertyName;
  }
  export interface LateBoundDeclaration extends DynamicNamedDeclaration {
    name: LateBoundName;
  }
  export interface DeclarationStatement extends NamedDeclaration, Statement {
    name?: Identifier | StringLiteral | NumericLiteral;
  }
  export interface ComputedPropertyName extends Node {
    parent: Declaration;
    kind: SyntaxKind.ComputedPropertyName;
    expression: Expression;
  }
  export interface LateBoundName extends ComputedPropertyName {
    expression: EntityNameExpression;
  }
  export interface Decorator extends Node {
    kind: SyntaxKind.Decorator;
    parent: NamedDeclaration;
    expression: LeftHandSideExpression;
  }
  export interface TypeParameterDeclaration extends NamedDeclaration {
    kind: SyntaxKind.TypeParameter;
    parent: DeclarationWithTypeParameterChildren | InferTypeNode;
    name: Identifier;
    /** Note: Consider calling `getEffectiveConstraintOfTypeParameter` */
    constraint?: TypeNode;
    default?: TypeNode;
    expression?: Expression;
  }
  export interface SignatureDeclarationBase extends NamedDeclaration, JSDocContainer {
    kind: SignatureDeclaration["kind"];
    name?: PropertyName;
    typeParameters?: NodeArray<TypeParameterDeclaration>;
    parameters: NodeArray<ParameterDeclaration>;
    type?: TypeNode;
    typeArguments?: NodeArray<TypeNode>;
  }
  export type SignatureDeclaration = CallSignatureDeclaration | ConstructSignatureDeclaration | MethodSignature | IndexSignatureDeclaration | FunctionTypeNode | ConstructorTypeNode | JSDocFunctionType | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | AccessorDeclaration | FunctionExpression | ArrowFunction;
  export interface CallSignatureDeclaration extends SignatureDeclarationBase, TypeElement {
    kind: SyntaxKind.CallSignature;
  }
  export interface ConstructSignatureDeclaration extends SignatureDeclarationBase, TypeElement {
    kind: SyntaxKind.ConstructSignature;
  }
  export type BindingName = Identifier | BindingPattern;
  export interface VariableDeclaration extends NamedDeclaration {
    kind: SyntaxKind.VariableDeclaration;
    parent: VariableDeclarationList | CatchClause;
    name: BindingName;
    exclamationToken?: ExclamationToken;
    type?: TypeNode;
    initializer?: Expression;
  }
  export interface VariableDeclarationList extends Node {
    kind: SyntaxKind.VariableDeclarationList;
    parent: VariableStatement | ForStatement | ForOfStatement | ForInStatement;
    declarations: NodeArray<VariableDeclaration>;
  }
  export interface ParameterDeclaration extends NamedDeclaration, JSDocContainer {
    kind: SyntaxKind.Parameter;
    parent: SignatureDeclaration;
    dotDotDotToken?: DotDotDotToken;
    name: BindingName;
    questionToken?: QuestionToken;
    type?: TypeNode;
    initializer?: Expression;
  }
  export interface BindingElement extends NamedDeclaration {
    kind: SyntaxKind.BindingElement;
    parent: BindingPattern;
    propertyName?: PropertyName;
    dotDotDotToken?: DotDotDotToken;
    name: BindingName;
    initializer?: Expression;
  }
  export type BindingElementGrandparent = BindingElement["parent"]["parent"];
  export interface PropertySignature extends TypeElement, JSDocContainer {
    kind: SyntaxKind.PropertySignature;
    name: PropertyName;
    questionToken?: QuestionToken;
    type?: TypeNode;
    initializer?: Expression;
  }
  export interface PropertyDeclaration extends ClassElement, JSDocContainer {
    kind: SyntaxKind.PropertyDeclaration;
    parent: ClassLikeDeclaration;
    name: PropertyName;
    questionToken?: QuestionToken;
    exclamationToken?: ExclamationToken;
    type?: TypeNode;
    initializer?: Expression;
  }
  export interface ObjectLiteralElement extends NamedDeclaration {
    _objectLiteralBrand: any;
    name?: PropertyName;
  }
  /** Unlike ObjectLiteralElement, excludes JSXAttribute and JSXSpreadAttribute. */
  export type ObjectLiteralElementLike = PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment | MethodDeclaration | AccessorDeclaration;
  export interface PropertyAssignment extends ObjectLiteralElement, JSDocContainer {
    parent: ObjectLiteralExpression;
    kind: SyntaxKind.PropertyAssignment;
    name: PropertyName;
    questionToken?: QuestionToken;
    initializer: Expression;
  }
  export interface ShorthandPropertyAssignment extends ObjectLiteralElement, JSDocContainer {
    parent: ObjectLiteralExpression;
    kind: SyntaxKind.ShorthandPropertyAssignment;
    name: Identifier;
    questionToken?: QuestionToken;
    exclamationToken?: ExclamationToken;
    equalsToken?: Token<SyntaxKind.EqualsToken>;
    objectAssignmentInitializer?: Expression;
  }
  export interface SpreadAssignment extends ObjectLiteralElement, JSDocContainer {
    parent: ObjectLiteralExpression;
    kind: SyntaxKind.SpreadAssignment;
    expression: Expression;
  }
  export type VariableLikeDeclaration = VariableDeclaration | ParameterDeclaration | BindingElement | PropertyDeclaration | PropertyAssignment | PropertySignature | JsxAttribute | ShorthandPropertyAssignment | EnumMember | JSDocPropertyTag | JSDocParameterTag;
  export interface PropertyLikeDeclaration extends NamedDeclaration {
    name: PropertyName;
  }
  export interface ObjectBindingPattern extends Node {
    kind: SyntaxKind.ObjectBindingPattern;
    parent: VariableDeclaration | ParameterDeclaration | BindingElement;
    elements: NodeArray<BindingElement>;
  }
  export interface ArrayBindingPattern extends Node {
    kind: SyntaxKind.ArrayBindingPattern;
    parent: VariableDeclaration | ParameterDeclaration | BindingElement;
    elements: NodeArray<ArrayBindingElement>;
  }
  export type BindingPattern = ObjectBindingPattern | ArrayBindingPattern;
  export type ArrayBindingElement = BindingElement | OmittedExpression;
  /**
   * Several node kinds share function-like features such as a signature,
   * a name, and a body. These nodes should extend FunctionLikeDeclarationBase.
   * Examples:
   * - FunctionDeclaration
   * - MethodDeclaration
   * - AccessorDeclaration
   */
  export interface FunctionLikeDeclarationBase extends SignatureDeclarationBase {
    _functionLikeDeclarationBrand: any;
    asteriskToken?: AsteriskToken;
    questionToken?: QuestionToken;
    exclamationToken?: ExclamationToken;
    body?: Block | Expression;
  }
  export type FunctionLikeDeclaration = FunctionDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ConstructorDeclaration | FunctionExpression | ArrowFunction;
  /** @deprecated Use SignatureDeclaration */
  export type FunctionLike = SignatureDeclaration;
  export interface FunctionDeclaration extends FunctionLikeDeclarationBase, DeclarationStatement {
    kind: SyntaxKind.FunctionDeclaration;
    name?: Identifier;
    body?: FunctionBody;
  }
  export interface MethodSignature extends SignatureDeclarationBase, TypeElement {
    kind: SyntaxKind.MethodSignature;
    parent: ObjectTypeDeclaration;
    name: PropertyName;
  }
  export interface MethodDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
    kind: SyntaxKind.MethodDeclaration;
    parent: ClassLikeDeclaration | ObjectLiteralExpression;
    name: PropertyName;
    body?: FunctionBody;
  }
  export interface ConstructorDeclaration extends FunctionLikeDeclarationBase, ClassElement, JSDocContainer {
    kind: SyntaxKind.Constructor;
    parent: ClassLikeDeclaration;
    body?: FunctionBody;
    returnFlowNode?: FlowNode;
  }
  /** For when we encounter a semicolon in a class declaration. ES6 allows these as class elements. */
  export interface SemicolonClassElement extends ClassElement {
    kind: SyntaxKind.SemicolonClassElement;
    parent: ClassLikeDeclaration;
  }
  export interface GetAccessorDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
    kind: SyntaxKind.GetAccessor;
    parent: ClassLikeDeclaration | ObjectLiteralExpression;
    name: PropertyName;
    body?: FunctionBody;
  }
  export interface SetAccessorDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
    kind: SyntaxKind.SetAccessor;
    parent: ClassLikeDeclaration | ObjectLiteralExpression;
    name: PropertyName;
    body?: FunctionBody;
  }
  export type AccessorDeclaration = GetAccessorDeclaration | SetAccessorDeclaration;
  export interface IndexSignatureDeclaration extends SignatureDeclarationBase, ClassElement, TypeElement {
    kind: SyntaxKind.IndexSignature;
    parent: ObjectTypeDeclaration;
  }
  export interface TypeNode extends Node {
    _typeNodeBrand: any;
  }
  export interface KeywordTypeNode extends TypeNode {
    kind: SyntaxKind.AnyKeyword | SyntaxKind.UnknownKeyword | SyntaxKind.NumberKeyword | SyntaxKind.BigIntKeyword | SyntaxKind.ObjectKeyword | SyntaxKind.BooleanKeyword | SyntaxKind.StringKeyword | SyntaxKind.SymbolKeyword | SyntaxKind.ThisKeyword | SyntaxKind.VoidKeyword | SyntaxKind.UndefinedKeyword | SyntaxKind.NullKeyword | SyntaxKind.NeverKeyword;
  }
  export interface ImportTypeNode extends NodeWithTypeArguments {
    kind: SyntaxKind.ImportType;
    isTypeOf?: boolean;
    argument: TypeNode;
    qualifier?: EntityName;
  }
  export type LiteralImportTypeNode = ImportTypeNode & {
    argument: LiteralTypeNode & {
      literal: StringLiteral;
    };
  };
  export interface ThisTypeNode extends TypeNode {
    kind: SyntaxKind.ThisType;
  }
  export type FunctionOrConstructorTypeNode = FunctionTypeNode | ConstructorTypeNode;
  export interface FunctionOrConstructorTypeNodeBase extends TypeNode, SignatureDeclarationBase {
    kind: SyntaxKind.FunctionType | SyntaxKind.ConstructorType;
    type: TypeNode;
  }
  export interface FunctionTypeNode extends FunctionOrConstructorTypeNodeBase {
    kind: SyntaxKind.FunctionType;
  }
  export interface ConstructorTypeNode extends FunctionOrConstructorTypeNodeBase {
    kind: SyntaxKind.ConstructorType;
  }
  export interface NodeWithTypeArguments extends TypeNode {
    typeArguments?: NodeArray<TypeNode>;
  }
  export type TypeReferenceType = TypeReferenceNode | ExpressionWithTypeArguments;
  export interface TypeReferenceNode extends NodeWithTypeArguments {
    kind: SyntaxKind.TypeReference;
    typeName: EntityName;
  }
  export interface TypePredicateNode extends TypeNode {
    kind: SyntaxKind.TypePredicate;
    parent: SignatureDeclaration | JSDocTypeExpression;
    parameterName: Identifier | ThisTypeNode;
    type: TypeNode;
  }
  export interface TypeQueryNode extends TypeNode {
    kind: SyntaxKind.TypeQuery;
    exprName: EntityName;
  }
  export interface TypeLiteralNode extends TypeNode, Declaration {
    kind: SyntaxKind.TypeLiteral;
    members: NodeArray<TypeElement>;
  }
  export interface ArrayTypeNode extends TypeNode {
    kind: SyntaxKind.ArrayType;
    elementType: TypeNode;
  }
  export interface TupleTypeNode extends TypeNode {
    kind: SyntaxKind.TupleType;
    elementTypes: NodeArray<TypeNode>;
  }
  export interface OptionalTypeNode extends TypeNode {
    kind: SyntaxKind.OptionalType;
    type: TypeNode;
  }
  export interface RestTypeNode extends TypeNode {
    kind: SyntaxKind.RestType;
    type: TypeNode;
  }
  export type UnionOrIntersectionTypeNode = UnionTypeNode | IntersectionTypeNode;
  export interface UnionTypeNode extends TypeNode {
    kind: SyntaxKind.UnionType;
    types: NodeArray<TypeNode>;
  }
  export interface IntersectionTypeNode extends TypeNode {
    kind: SyntaxKind.IntersectionType;
    types: NodeArray<TypeNode>;
  }
  export interface ConditionalTypeNode extends TypeNode {
    kind: SyntaxKind.ConditionalType;
    checkType: TypeNode;
    extendsType: TypeNode;
    trueType: TypeNode;
    falseType: TypeNode;
  }
  export interface InferTypeNode extends TypeNode {
    kind: SyntaxKind.InferType;
    typeParameter: TypeParameterDeclaration;
  }
  export interface ParenthesizedTypeNode extends TypeNode {
    kind: SyntaxKind.ParenthesizedType;
    type: TypeNode;
  }
  export interface TypeOperatorNode extends TypeNode {
    kind: SyntaxKind.TypeOperator;
    operator: SyntaxKind.KeyOfKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.ReadonlyKeyword;
    type: TypeNode;
  }
  export interface UniqueTypeOperatorNode extends TypeOperatorNode {
    operator: SyntaxKind.UniqueKeyword;
  }
  export interface IndexedAccessTypeNode extends TypeNode {
    kind: SyntaxKind.IndexedAccessType;
    objectType: TypeNode;
    indexType: TypeNode;
  }
  export interface MappedTypeNode extends TypeNode, Declaration {
    kind: SyntaxKind.MappedType;
    readonlyToken?: ReadonlyToken | PlusToken | MinusToken;
    typeParameter: TypeParameterDeclaration;
    questionToken?: QuestionToken | PlusToken | MinusToken;
    type?: TypeNode;
  }
  export interface LiteralTypeNode extends TypeNode {
    kind: SyntaxKind.LiteralType;
    literal: BooleanLiteral | LiteralExpression | PrefixUnaryExpression;
  }
  export interface StringLiteral extends LiteralExpression {
    kind: SyntaxKind.StringLiteral;
    textSourceNode?: Identifier | StringLiteralLike | NumericLiteral;
    /** Note: this is only set when synthesizing a node, not during parsing. */
    singleQuote?: boolean;
  }
  export type StringLiteralLike = StringLiteral | NoSubstitutionTemplateLiteral;
  export interface Expression extends Node {
    _expressionBrand: any;
  }
  export interface OmittedExpression extends Expression {
    kind: SyntaxKind.OmittedExpression;
  }
  export interface PartiallyEmittedExpression extends LeftHandSideExpression {
    kind: SyntaxKind.PartiallyEmittedExpression;
    expression: Expression;
  }
  export interface UnaryExpression extends Expression {
    _unaryExpressionBrand: any;
  }
  /** Deprecated, please use UpdateExpression */
  export type IncrementExpression = UpdateExpression;
  export interface UpdateExpression extends UnaryExpression {
    _updateExpressionBrand: any;
  }
  export type PrefixUnaryOperator = SyntaxKind.PlusPlusToken | SyntaxKind.MinusMinusToken | SyntaxKind.PlusToken | SyntaxKind.MinusToken | SyntaxKind.TildeToken | SyntaxKind.ExclamationToken;
  export interface PrefixUnaryExpression extends UpdateExpression {
    kind: SyntaxKind.PrefixUnaryExpression;
    operator: PrefixUnaryOperator;
    operand: UnaryExpression;
  }
  export type PostfixUnaryOperator = SyntaxKind.PlusPlusToken | SyntaxKind.MinusMinusToken;
  export interface PostfixUnaryExpression extends UpdateExpression {
    kind: SyntaxKind.PostfixUnaryExpression;
    operand: LeftHandSideExpression;
    operator: PostfixUnaryOperator;
  }
  export interface LeftHandSideExpression extends UpdateExpression {
    _leftHandSideExpressionBrand: any;
  }
  export interface MemberExpression extends LeftHandSideExpression {
    _memberExpressionBrand: any;
  }
  export interface PrimaryExpression extends MemberExpression {
    _primaryExpressionBrand: any;
  }
  export interface NullLiteral extends PrimaryExpression, TypeNode {
    kind: SyntaxKind.NullKeyword;
  }
  export interface BooleanLiteral extends PrimaryExpression, TypeNode {
    kind: SyntaxKind.TrueKeyword | SyntaxKind.FalseKeyword;
  }
  export interface ThisExpression extends PrimaryExpression, KeywordTypeNode {
    kind: SyntaxKind.ThisKeyword;
  }
  export interface SuperExpression extends PrimaryExpression {
    kind: SyntaxKind.SuperKeyword;
  }
  export interface ImportExpression extends PrimaryExpression {
    kind: SyntaxKind.ImportKeyword;
  }
  export interface DeleteExpression extends UnaryExpression {
    kind: SyntaxKind.DeleteExpression;
    expression: UnaryExpression;
  }
  export interface TypeOfExpression extends UnaryExpression {
    kind: SyntaxKind.TypeOfExpression;
    expression: UnaryExpression;
  }
  export interface VoidExpression extends UnaryExpression {
    kind: SyntaxKind.VoidExpression;
    expression: UnaryExpression;
  }
  export interface AwaitExpression extends UnaryExpression {
    kind: SyntaxKind.AwaitExpression;
    expression: UnaryExpression;
  }
  export interface YieldExpression extends Expression {
    kind: SyntaxKind.YieldExpression;
    asteriskToken?: AsteriskToken;
    expression?: Expression;
  }
  export interface SyntheticExpression extends Expression {
    kind: SyntaxKind.SyntheticExpression;
    isSpread: boolean;
    type: Type;
  }
  export type ExponentiationOperator = SyntaxKind.AsteriskAsteriskToken;
  export type MultiplicativeOperator = SyntaxKind.AsteriskToken | SyntaxKind.SlashToken | SyntaxKind.PercentToken;
  export type MultiplicativeOperatorOrHigher = ExponentiationOperator | MultiplicativeOperator;
  export type AdditiveOperator = SyntaxKind.PlusToken | SyntaxKind.MinusToken;
  export type AdditiveOperatorOrHigher = MultiplicativeOperatorOrHigher | AdditiveOperator;
  export type ShiftOperator = SyntaxKind.LessThanLessThanToken | SyntaxKind.GreaterThanGreaterThanToken | SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
  export type ShiftOperatorOrHigher = AdditiveOperatorOrHigher | ShiftOperator;
  export type RelationalOperator = SyntaxKind.LessThanToken | SyntaxKind.LessThanEqualsToken | SyntaxKind.GreaterThanToken | SyntaxKind.GreaterThanEqualsToken | SyntaxKind.InstanceOfKeyword | SyntaxKind.InKeyword;
  export type RelationalOperatorOrHigher = ShiftOperatorOrHigher | RelationalOperator;
  export type EqualityOperator = SyntaxKind.EqualsEqualsToken | SyntaxKind.EqualsEqualsEqualsToken | SyntaxKind.ExclamationEqualsEqualsToken | SyntaxKind.ExclamationEqualsToken;
  export type EqualityOperatorOrHigher = RelationalOperatorOrHigher | EqualityOperator;
  export type BitwiseOperator = SyntaxKind.AmpersandToken | SyntaxKind.BarToken | SyntaxKind.CaretToken;
  export type BitwiseOperatorOrHigher = EqualityOperatorOrHigher | BitwiseOperator;
  export type LogicalOperator = SyntaxKind.AmpersandAmpersandToken | SyntaxKind.BarBarToken;
  export type LogicalOperatorOrHigher = BitwiseOperatorOrHigher | LogicalOperator;
  export type CompoundAssignmentOperator = SyntaxKind.PlusEqualsToken | SyntaxKind.MinusEqualsToken | SyntaxKind.AsteriskAsteriskEqualsToken | SyntaxKind.AsteriskEqualsToken | SyntaxKind.SlashEqualsToken | SyntaxKind.PercentEqualsToken | SyntaxKind.AmpersandEqualsToken | SyntaxKind.BarEqualsToken | SyntaxKind.CaretEqualsToken | SyntaxKind.LessThanLessThanEqualsToken | SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken | SyntaxKind.GreaterThanGreaterThanEqualsToken;
  export type AssignmentOperator = SyntaxKind.EqualsToken | CompoundAssignmentOperator;
  export type AssignmentOperatorOrHigher = LogicalOperatorOrHigher | AssignmentOperator;
  export type BinaryOperator = AssignmentOperatorOrHigher | SyntaxKind.CommaToken;
  export type BinaryOperatorToken = Token<BinaryOperator>;
  export interface BinaryExpression extends Expression, Declaration {
    kind: SyntaxKind.BinaryExpression;
    left: Expression;
    operatorToken: BinaryOperatorToken;
    right: Expression;
  }
  export type AssignmentOperatorToken = Token<AssignmentOperator>;
  export interface AssignmentExpression<TOperator extends AssignmentOperatorToken> extends BinaryExpression {
    left: LeftHandSideExpression;
    operatorToken: TOperator;
  }
  export interface ObjectDestructuringAssignment extends AssignmentExpression<EqualsToken> {
    left: ObjectLiteralExpression;
  }
  export interface ArrayDestructuringAssignment extends AssignmentExpression<EqualsToken> {
    left: ArrayLiteralExpression;
  }
  export type DestructuringAssignment = ObjectDestructuringAssignment | ArrayDestructuringAssignment;
  export type BindingOrAssignmentElement = VariableDeclaration | ParameterDeclaration | BindingElement | PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment | OmittedExpression | SpreadElement | ArrayLiteralExpression | ObjectLiteralExpression | AssignmentExpression<EqualsToken> | Identifier | PropertyAccessExpression | ElementAccessExpression;
  export type BindingOrAssignmentElementRestIndicator = DotDotDotToken | SpreadElement | SpreadAssignment;
  export type BindingOrAssignmentElementTarget = BindingOrAssignmentPattern | Identifier | PropertyAccessExpression | ElementAccessExpression | OmittedExpression;
  export type ObjectBindingOrAssignmentPattern = ObjectBindingPattern | ObjectLiteralExpression;
  export type ArrayBindingOrAssignmentPattern = ArrayBindingPattern | ArrayLiteralExpression;
  export type AssignmentPattern = ObjectLiteralExpression | ArrayLiteralExpression;
  export type BindingOrAssignmentPattern = ObjectBindingOrAssignmentPattern | ArrayBindingOrAssignmentPattern;
  export interface ConditionalExpression extends Expression {
    kind: SyntaxKind.ConditionalExpression;
    condition: Expression;
    questionToken: QuestionToken;
    whenTrue: Expression;
    colonToken: ColonToken;
    whenFalse: Expression;
  }
  export type FunctionBody = Block;
  export type ConciseBody = FunctionBody | Expression;
  export interface FunctionExpression extends PrimaryExpression, FunctionLikeDeclarationBase, JSDocContainer {
    kind: SyntaxKind.FunctionExpression;
    name?: Identifier;
    body: FunctionBody;
  }
  export interface ArrowFunction extends Expression, FunctionLikeDeclarationBase, JSDocContainer {
    kind: SyntaxKind.ArrowFunction;
    equalsGreaterThanToken: EqualsGreaterThanToken;
    body: ConciseBody;
    name: never;
  }
  export interface LiteralLikeNode extends Node {
    text: string;
    isUnterminated?: boolean;
    hasExtendedUnicodeEscape?: boolean;
  }
  export interface TemplateLiteralLikeNode extends LiteralLikeNode {
    rawText?: string;
  }
  export interface LiteralExpression extends LiteralLikeNode, PrimaryExpression {
    _literalExpressionBrand: any;
  }
  export interface RegularExpressionLiteral extends LiteralExpression {
    kind: SyntaxKind.RegularExpressionLiteral;
  }
  export interface NoSubstitutionTemplateLiteral extends LiteralExpression, TemplateLiteralLikeNode {
    kind: SyntaxKind.NoSubstitutionTemplateLiteral;
  }
  export enum TokenFlags {
    None = 0,
    PrecedingLineBreak = 1,
    PrecedingJSDocComment = 2,
    Unterminated = 4,
    ExtendedUnicodeEscape = 8,
    Scientific = 16,
    Octal = 32,
    HexSpecifier = 64,
    BinarySpecifier = 128,
    OctalSpecifier = 256,
    ContainsSeparator = 512,
    UnicodeEscape = 1024,
    BinaryOrOctalSpecifier = 384,
    NumericLiteralFlags = 1008
  }
  export interface NumericLiteral extends LiteralExpression {
    kind: SyntaxKind.NumericLiteral;
    numericLiteralFlags: TokenFlags;
  }
  export interface BigIntLiteral extends LiteralExpression {
    kind: SyntaxKind.BigIntLiteral;
  }
  export interface TemplateHead extends TemplateLiteralLikeNode {
    kind: SyntaxKind.TemplateHead;
    parent: TemplateExpression;
  }
  export interface TemplateMiddle extends TemplateLiteralLikeNode {
    kind: SyntaxKind.TemplateMiddle;
    parent: TemplateSpan;
  }
  export interface TemplateTail extends TemplateLiteralLikeNode {
    kind: SyntaxKind.TemplateTail;
    parent: TemplateSpan;
  }
  export type TemplateLiteral = TemplateExpression | NoSubstitutionTemplateLiteral;
  export interface TemplateExpression extends PrimaryExpression {
    kind: SyntaxKind.TemplateExpression;
    head: TemplateHead;
    templateSpans: NodeArray<TemplateSpan>;
  }
  export interface TemplateSpan extends Node {
    kind: SyntaxKind.TemplateSpan;
    parent: TemplateExpression;
    expression: Expression;
    literal: TemplateMiddle | TemplateTail;
  }
  export interface ParenthesizedExpression extends PrimaryExpression, JSDocContainer {
    kind: SyntaxKind.ParenthesizedExpression;
    expression: Expression;
  }
  export interface ArrayLiteralExpression extends PrimaryExpression {
    kind: SyntaxKind.ArrayLiteralExpression;
    elements: NodeArray<Expression>;
    multiLine?: boolean;
  }
  export interface SpreadElement extends Expression {
    kind: SyntaxKind.SpreadElement;
    parent: ArrayLiteralExpression | CallExpression | NewExpression;
    expression: Expression;
  }
  /**
   * This interface is a base interface for ObjectLiteralExpression and JSXAttributes to extend from. JSXAttributes is similar to
   * ObjectLiteralExpression in that it contains array of properties; however, JSXAttributes' properties can only be
   * JSXAttribute or JSXSpreadAttribute. ObjectLiteralExpression, on the other hand, can only have properties of type
   * ObjectLiteralElement (e.g. PropertyAssignment, ShorthandPropertyAssignment etc.)
   */
  export interface ObjectLiteralExpressionBase<T extends ObjectLiteralElement> extends PrimaryExpression, Declaration {
    properties: NodeArray<T>;
  }
  export interface ObjectLiteralExpression extends ObjectLiteralExpressionBase<ObjectLiteralElementLike> {
    kind: SyntaxKind.ObjectLiteralExpression;
    multiLine?: boolean;
  }
  export type EntityNameExpression = Identifier | PropertyAccessEntityNameExpression;
  export type EntityNameOrEntityNameExpression = EntityName | EntityNameExpression;
  export type AccessExpression = PropertyAccessExpression | ElementAccessExpression;
  export interface PropertyAccessExpression extends MemberExpression, NamedDeclaration {
    kind: SyntaxKind.PropertyAccessExpression;
    expression: LeftHandSideExpression;
    name: Identifier;
  }
  export interface SuperPropertyAccessExpression extends PropertyAccessExpression {
    expression: SuperExpression;
  }
  /** Brand for a PropertyAccessExpression which, like a QualifiedName, consists of a sequence of identifiers separated by dots. */
  export interface PropertyAccessEntityNameExpression extends PropertyAccessExpression {
    _propertyAccessExpressionLikeQualifiedNameBrand?: any;
    expression: EntityNameExpression;
  }
  export interface ElementAccessExpression extends MemberExpression {
    kind: SyntaxKind.ElementAccessExpression;
    expression: LeftHandSideExpression;
    argumentExpression: Expression;
  }
  export interface SuperElementAccessExpression extends ElementAccessExpression {
    expression: SuperExpression;
  }
  export type SuperProperty = SuperPropertyAccessExpression | SuperElementAccessExpression;
  export interface CallExpression extends LeftHandSideExpression, Declaration {
    kind: SyntaxKind.CallExpression;
    expression: LeftHandSideExpression;
    typeArguments?: NodeArray<TypeNode>;
    arguments: NodeArray<Expression>;
  }
  /** @internal */
  export type BindableObjectDefinePropertyCall = CallExpression & {
    arguments: {
      0: EntityNameExpression;
      1: StringLiteralLike | NumericLiteral;
      2: ObjectLiteralExpression;
    };
  };
  export interface SuperCall extends CallExpression {
    expression: SuperExpression;
  }
  export interface ImportCall extends CallExpression {
    expression: ImportExpression;
  }
  export interface ExpressionWithTypeArguments extends NodeWithTypeArguments {
    kind: SyntaxKind.ExpressionWithTypeArguments;
    parent: HeritageClause | JSDocAugmentsTag;
    expression: LeftHandSideExpression;
  }
  export interface NewExpression extends PrimaryExpression, Declaration {
    kind: SyntaxKind.NewExpression;
    expression: LeftHandSideExpression;
    typeArguments?: NodeArray<TypeNode>;
    arguments?: NodeArray<Expression>;
  }
  export interface TaggedTemplateExpression extends MemberExpression {
    kind: SyntaxKind.TaggedTemplateExpression;
    tag: LeftHandSideExpression;
    typeArguments?: NodeArray<TypeNode>;
    template: TemplateLiteral;
  }
  export type CallLikeExpression = CallExpression | NewExpression | TaggedTemplateExpression | Decorator | JsxOpeningLikeElement;
  export interface AsExpression extends Expression {
    kind: SyntaxKind.AsExpression;
    expression: Expression;
    type: TypeNode;
  }
  export interface TypeAssertion extends UnaryExpression {
    kind: SyntaxKind.TypeAssertionExpression;
    type: TypeNode;
    expression: UnaryExpression;
  }
  export type AssertionExpression = TypeAssertion | AsExpression;
  export interface NonNullExpression extends LeftHandSideExpression {
    kind: SyntaxKind.NonNullExpression;
    expression: Expression;
  }
  export interface MetaProperty extends PrimaryExpression {
    kind: SyntaxKind.MetaProperty;
    keywordToken: SyntaxKind.NewKeyword | SyntaxKind.ImportKeyword;
    name: Identifier;
  }
  export interface ImportMetaProperty extends MetaProperty {
    keywordToken: SyntaxKind.ImportKeyword;
    name: Identifier & {
      escapedText: __String & "meta";
    };
  }
  export interface JsxElement extends PrimaryExpression {
    kind: SyntaxKind.JsxElement;
    openingElement: JsxOpeningElement;
    children: NodeArray<JsxChild>;
    closingElement: JsxClosingElement;
  }
  export type JsxOpeningLikeElement = JsxSelfClosingElement | JsxOpeningElement;
  export type JsxAttributeLike = JsxAttribute | JsxSpreadAttribute;
  export type JsxTagNameExpression = Identifier | ThisExpression | JsxTagNamePropertyAccess;
  export interface JsxTagNamePropertyAccess extends PropertyAccessExpression {
    expression: JsxTagNameExpression;
  }
  export interface JsxAttributes extends ObjectLiteralExpressionBase<JsxAttributeLike> {
    kind: SyntaxKind.JsxAttributes;
    parent: JsxOpeningLikeElement;
  }
  export interface JsxOpeningElement extends Expression {
    kind: SyntaxKind.JsxOpeningElement;
    parent: JsxElement;
    tagName: JsxTagNameExpression;
    typeArguments?: NodeArray<TypeNode>;
    attributes: JsxAttributes;
  }
  export interface JsxSelfClosingElement extends PrimaryExpression {
    kind: SyntaxKind.JsxSelfClosingElement;
    tagName: JsxTagNameExpression;
    typeArguments?: NodeArray<TypeNode>;
    attributes: JsxAttributes;
  }
  export interface JsxFragment extends PrimaryExpression {
    kind: SyntaxKind.JsxFragment;
    openingFragment: JsxOpeningFragment;
    children: NodeArray<JsxChild>;
    closingFragment: JsxClosingFragment;
  }
  export interface JsxOpeningFragment extends Expression {
    kind: SyntaxKind.JsxOpeningFragment;
    parent: JsxFragment;
  }
  export interface JsxClosingFragment extends Expression {
    kind: SyntaxKind.JsxClosingFragment;
    parent: JsxFragment;
  }
  export interface JsxAttribute extends ObjectLiteralElement {
    kind: SyntaxKind.JsxAttribute;
    parent: JsxAttributes;
    name: Identifier;
    initializer?: StringLiteral | JsxExpression;
  }
  export interface JsxSpreadAttribute extends ObjectLiteralElement {
    kind: SyntaxKind.JsxSpreadAttribute;
    parent: JsxAttributes;
    expression: Expression;
  }
  export interface JsxClosingElement extends Node {
    kind: SyntaxKind.JsxClosingElement;
    parent: JsxElement;
    tagName: JsxTagNameExpression;
  }
  export interface JsxExpression extends Expression {
    kind: SyntaxKind.JsxExpression;
    parent: JsxElement | JsxAttributeLike;
    dotDotDotToken?: Token<SyntaxKind.DotDotDotToken>;
    expression?: Expression;
  }
  export interface JsxText extends LiteralLikeNode {
    kind: SyntaxKind.JsxText;
    containsOnlyTriviaWhiteSpaces: boolean;
    parent: JsxElement;
  }
  export type JsxChild = JsxText | JsxExpression | JsxElement | JsxSelfClosingElement | JsxFragment;
  export interface Statement extends Node {
    _statementBrand: any;
  }
  export interface NotEmittedStatement extends Statement {
    kind: SyntaxKind.NotEmittedStatement;
  }
  /**
   * Marks the end of transformed declaration to properly emit exports.
   */
  export interface EndOfDeclarationMarker extends Statement {
    kind: SyntaxKind.EndOfDeclarationMarker;
  }
  /**
   * A list of comma-separated expressions. This node is only created by transformations.
   */
  export interface CommaListExpression extends Expression {
    kind: SyntaxKind.CommaListExpression;
    elements: NodeArray<Expression>;
  }
  /**
   * Marks the beginning of a merged transformed declaration.
   */
  export interface MergeDeclarationMarker extends Statement {
    kind: SyntaxKind.MergeDeclarationMarker;
  }
  export interface EmptyStatement extends Statement {
    kind: SyntaxKind.EmptyStatement;
  }
  export interface DebuggerStatement extends Statement {
    kind: SyntaxKind.DebuggerStatement;
  }
  export interface MissingDeclaration extends DeclarationStatement {
    kind: SyntaxKind.MissingDeclaration;
    name?: Identifier;
  }
  export type BlockLike = SourceFile | Block | ModuleBlock | CaseOrDefaultClause;
  export interface Block extends Statement {
    kind: SyntaxKind.Block;
    statements: NodeArray<Statement>;
    multiLine?: boolean;
  }
  export interface VariableStatement extends Statement, JSDocContainer {
    kind: SyntaxKind.VariableStatement;
    declarationList: VariableDeclarationList;
  }
  export interface ExpressionStatement extends Statement, JSDocContainer {
    kind: SyntaxKind.ExpressionStatement;
    expression: Expression;
  }
  export interface PrologueDirective extends ExpressionStatement {
    expression: StringLiteral;
  }
  export interface IfStatement extends Statement {
    kind: SyntaxKind.IfStatement;
    expression: Expression;
    thenStatement: Statement;
    elseStatement?: Statement;
  }
  export interface IterationStatement extends Statement {
    statement: Statement;
  }
  export interface DoStatement extends IterationStatement {
    kind: SyntaxKind.DoStatement;
    expression: Expression;
  }
  export interface WhileStatement extends IterationStatement {
    kind: SyntaxKind.WhileStatement;
    expression: Expression;
  }
  export type ForInitializer = VariableDeclarationList | Expression;
  export interface ForStatement extends IterationStatement {
    kind: SyntaxKind.ForStatement;
    initializer?: ForInitializer;
    condition?: Expression;
    incrementor?: Expression;
  }
  export type ForInOrOfStatement = ForInStatement | ForOfStatement;
  export interface ForInStatement extends IterationStatement {
    kind: SyntaxKind.ForInStatement;
    initializer: ForInitializer;
    expression: Expression;
  }
  export interface ForOfStatement extends IterationStatement {
    kind: SyntaxKind.ForOfStatement;
    awaitModifier?: AwaitKeywordToken;
    initializer: ForInitializer;
    expression: Expression;
  }
  export interface BreakStatement extends Statement {
    kind: SyntaxKind.BreakStatement;
    label?: Identifier;
  }
  export interface ContinueStatement extends Statement {
    kind: SyntaxKind.ContinueStatement;
    label?: Identifier;
  }
  export type BreakOrContinueStatement = BreakStatement | ContinueStatement;
  export interface ReturnStatement extends Statement {
    kind: SyntaxKind.ReturnStatement;
    expression?: Expression;
  }
  export interface WithStatement extends Statement {
    kind: SyntaxKind.WithStatement;
    expression: Expression;
    statement: Statement;
  }
  export interface SwitchStatement extends Statement {
    kind: SyntaxKind.SwitchStatement;
    expression: Expression;
    caseBlock: CaseBlock;
    possiblyExhaustive?: boolean;
  }
  export interface CaseBlock extends Node {
    kind: SyntaxKind.CaseBlock;
    parent: SwitchStatement;
    clauses: NodeArray<CaseOrDefaultClause>;
  }
  export interface CaseClause extends Node {
    kind: SyntaxKind.CaseClause;
    parent: CaseBlock;
    expression: Expression;
    statements: NodeArray<Statement>;
  }
  export interface DefaultClause extends Node {
    kind: SyntaxKind.DefaultClause;
    parent: CaseBlock;
    statements: NodeArray<Statement>;
  }
  export type CaseOrDefaultClause = CaseClause | DefaultClause;
  export interface LabeledStatement extends Statement, JSDocContainer {
    kind: SyntaxKind.LabeledStatement;
    label: Identifier;
    statement: Statement;
  }
  export interface ThrowStatement extends Statement {
    kind: SyntaxKind.ThrowStatement;
    expression?: Expression;
  }
  export interface TryStatement extends Statement {
    kind: SyntaxKind.TryStatement;
    tryBlock: Block;
    catchClause?: CatchClause;
    finallyBlock?: Block;
  }
  export interface CatchClause extends Node {
    kind: SyntaxKind.CatchClause;
    parent: TryStatement;
    variableDeclaration?: VariableDeclaration;
    block: Block;
  }
  export type ObjectTypeDeclaration = ClassLikeDeclaration | InterfaceDeclaration | TypeLiteralNode;
  export type DeclarationWithTypeParameters = DeclarationWithTypeParameterChildren | JSDocTypedefTag | JSDocCallbackTag | JSDocSignature;
  export type DeclarationWithTypeParameterChildren = SignatureDeclaration | ClassLikeDeclaration | InterfaceDeclaration | TypeAliasDeclaration | JSDocTemplateTag;
  export interface ClassLikeDeclarationBase extends NamedDeclaration, JSDocContainer {
    kind: SyntaxKind.ClassDeclaration | SyntaxKind.ClassExpression;
    name?: Identifier;
    typeParameters?: NodeArray<TypeParameterDeclaration>;
    heritageClauses?: NodeArray<HeritageClause>;
    members: NodeArray<ClassElement>;
  }
  export interface ClassDeclaration extends ClassLikeDeclarationBase, DeclarationStatement {
    kind: SyntaxKind.ClassDeclaration;
    /** May be undefined in `export default class { ... }`. */
    name?: Identifier;
  }
  export interface ClassExpression extends ClassLikeDeclarationBase, PrimaryExpression {
    kind: SyntaxKind.ClassExpression;
  }
  export type ClassLikeDeclaration = ClassDeclaration | ClassExpression;
  export interface ClassElement extends NamedDeclaration {
    _classElementBrand: any;
    name?: PropertyName;
  }
  export interface TypeElement extends NamedDeclaration {
    _typeElementBrand: any;
    name?: PropertyName;
    questionToken?: QuestionToken;
  }
  export interface InterfaceDeclaration extends DeclarationStatement, JSDocContainer {
    kind: SyntaxKind.InterfaceDeclaration;
    name: Identifier;
    typeParameters?: NodeArray<TypeParameterDeclaration>;
    heritageClauses?: NodeArray<HeritageClause>;
    members: NodeArray<TypeElement>;
  }
  export interface HeritageClause extends Node {
    kind: SyntaxKind.HeritageClause;
    parent: InterfaceDeclaration | ClassLikeDeclaration;
    token: SyntaxKind.ExtendsKeyword | SyntaxKind.ImplementsKeyword;
    types: NodeArray<ExpressionWithTypeArguments>;
  }
  export interface TypeAliasDeclaration extends DeclarationStatement, JSDocContainer {
    kind: SyntaxKind.TypeAliasDeclaration;
    name: Identifier;
    typeParameters?: NodeArray<TypeParameterDeclaration>;
    type: TypeNode;
  }
  export interface EnumMember extends NamedDeclaration, JSDocContainer {
    kind: SyntaxKind.EnumMember;
    parent: EnumDeclaration;
    name: PropertyName;
    initializer?: Expression;
  }
  export interface EnumDeclaration extends DeclarationStatement, JSDocContainer {
    kind: SyntaxKind.EnumDeclaration;
    name: Identifier;
    members: NodeArray<EnumMember>;
  }
  export type ModuleName = Identifier | StringLiteral;
  export type ModuleBody = NamespaceBody | JSDocNamespaceBody;
  export interface AmbientModuleDeclaration extends ModuleDeclaration {
    body?: ModuleBlock;
  }
  export interface ModuleDeclaration extends DeclarationStatement, JSDocContainer {
    kind: SyntaxKind.ModuleDeclaration;
    parent: ModuleBody | SourceFile;
    name: ModuleName;
    body?: ModuleBody | JSDocNamespaceDeclaration;
  }
  export type NamespaceBody = ModuleBlock | NamespaceDeclaration;
  export interface NamespaceDeclaration extends ModuleDeclaration {
    name: Identifier;
    body: NamespaceBody;
  }
  export type JSDocNamespaceBody = Identifier | JSDocNamespaceDeclaration;
  export interface JSDocNamespaceDeclaration extends ModuleDeclaration {
    name: Identifier;
    body?: JSDocNamespaceBody;
  }
  export interface ModuleBlock extends Node, Statement {
    kind: SyntaxKind.ModuleBlock;
    parent: ModuleDeclaration;
    statements: NodeArray<Statement>;
  }
  export type ModuleReference = EntityName | ExternalModuleReference;
  /**
   * One of:
   * - import x = require("mod");
   * - import x = M.x;
   */
  export interface ImportEqualsDeclaration extends DeclarationStatement, JSDocContainer {
    kind: SyntaxKind.ImportEqualsDeclaration;
    parent: SourceFile | ModuleBlock;
    name: Identifier;
    moduleReference: ModuleReference;
  }
  export interface ExternalModuleReference extends Node {
    kind: SyntaxKind.ExternalModuleReference;
    parent: ImportEqualsDeclaration;
    expression: Expression;
  }
  export interface ImportDeclaration extends Statement {
    kind: SyntaxKind.ImportDeclaration;
    parent: SourceFile | ModuleBlock;
    importClause?: ImportClause;
    /** If this is not a StringLiteral it will be a grammar error. */
    moduleSpecifier: Expression;
  }
  export type NamedImportBindings = NamespaceImport | NamedImports;
  export interface ImportClause extends NamedDeclaration {
    kind: SyntaxKind.ImportClause;
    parent: ImportDeclaration;
    name?: Identifier;
    namedBindings?: NamedImportBindings;
  }
  export interface NamespaceImport extends NamedDeclaration {
    kind: SyntaxKind.NamespaceImport;
    parent: ImportClause;
    name: Identifier;
  }
  export interface NamespaceExportDeclaration extends DeclarationStatement {
    kind: SyntaxKind.NamespaceExportDeclaration;
    name: Identifier;
  }
  export interface ExportDeclaration extends DeclarationStatement, JSDocContainer {
    kind: SyntaxKind.ExportDeclaration;
    parent: SourceFile | ModuleBlock;
    /** Will not be assigned in the case of `export * from "foo";` */
    exportClause?: NamedExports;
    /** If this is not a StringLiteral it will be a grammar error. */
    moduleSpecifier?: Expression;
  }
  export interface NamedImports extends Node {
    kind: SyntaxKind.NamedImports;
    parent: ImportClause;
    elements: NodeArray<ImportSpecifier>;
  }
  export interface NamedExports extends Node {
    kind: SyntaxKind.NamedExports;
    parent: ExportDeclaration;
    elements: NodeArray<ExportSpecifier>;
  }
  export type NamedImportsOrExports = NamedImports | NamedExports;
  export interface ImportSpecifier extends NamedDeclaration {
    kind: SyntaxKind.ImportSpecifier;
    parent: NamedImports;
    propertyName?: Identifier;
    name: Identifier;
  }
  export interface ExportSpecifier extends NamedDeclaration {
    kind: SyntaxKind.ExportSpecifier;
    parent: NamedExports;
    propertyName?: Identifier;
    name: Identifier;
  }
  export type ImportOrExportSpecifier = ImportSpecifier | ExportSpecifier;
  /**
   * This is either an `export =` or an `export default` declaration.
   * Unless `isExportEquals` is set, this node was parsed as an `export default`.
   */
  export interface ExportAssignment extends DeclarationStatement {
    kind: SyntaxKind.ExportAssignment;
    parent: SourceFile;
    isExportEquals?: boolean;
    expression: Expression;
  }
  export interface FileReference extends TextRange {
    fileName: string;
  }
  export interface CheckJsDirective extends TextRange {
    enabled: boolean;
  }
  export type CommentKind = SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia;
  export interface CommentRange extends TextRange {
    hasTrailingNewLine?: boolean;
    kind: CommentKind;
  }
  export interface SynthesizedComment extends CommentRange {
    text: string;
    pos: -1;
    end: -1;
  }
  export interface JSDocTypeExpression extends TypeNode {
    kind: SyntaxKind.JSDocTypeExpression;
    type: TypeNode;
  }
  export interface JSDocType extends TypeNode {
    _jsDocTypeBrand: any;
  }
  export interface JSDocAllType extends JSDocType {
    kind: SyntaxKind.JSDocAllType;
  }
  export interface JSDocUnknownType extends JSDocType {
    kind: SyntaxKind.JSDocUnknownType;
  }
  export interface JSDocNonNullableType extends JSDocType {
    kind: SyntaxKind.JSDocNonNullableType;
    type: TypeNode;
  }
  export interface JSDocNullableType extends JSDocType {
    kind: SyntaxKind.JSDocNullableType;
    type: TypeNode;
  }
  export interface JSDocOptionalType extends JSDocType {
    kind: SyntaxKind.JSDocOptionalType;
    type: TypeNode;
  }
  export interface JSDocFunctionType extends JSDocType, SignatureDeclarationBase {
    kind: SyntaxKind.JSDocFunctionType;
  }
  export interface JSDocVariadicType extends JSDocType {
    kind: SyntaxKind.JSDocVariadicType;
    type: TypeNode;
  }
  export interface JSDocNamepathType extends JSDocType {
    kind: SyntaxKind.JSDocNamepathType;
    type: TypeNode;
  }
  export type JSDocTypeReferencingNode = JSDocVariadicType | JSDocOptionalType | JSDocNullableType | JSDocNonNullableType;
  export interface JSDoc extends Node {
    kind: SyntaxKind.JSDocComment;
    parent: HasJSDoc;
    tags?: NodeArray<JSDocTag>;
    comment?: string;
  }
  export interface JSDocTag extends Node {
    parent: JSDoc | JSDocTypeLiteral;
    tagName: Identifier;
    comment?: string;
  }
  export interface JSDocUnknownTag extends JSDocTag {
    kind: SyntaxKind.JSDocTag;
  }
  /**
   * Note that `@extends` is a synonym of `@augments`.
   * Both tags are represented by this interface.
   */
  export interface JSDocAugmentsTag extends JSDocTag {
    kind: SyntaxKind.JSDocAugmentsTag;
    class: ExpressionWithTypeArguments & {
      expression: Identifier | PropertyAccessEntityNameExpression;
    };
  }
  export interface JSDocAuthorTag extends JSDocTag {
    kind: SyntaxKind.JSDocAuthorTag;
  }
  export interface JSDocClassTag extends JSDocTag {
    kind: SyntaxKind.JSDocClassTag;
  }
  export interface JSDocEnumTag extends JSDocTag, Declaration {
    parent: JSDoc;
    kind: SyntaxKind.JSDocEnumTag;
    typeExpression?: JSDocTypeExpression;
  }
  export interface JSDocThisTag extends JSDocTag {
    kind: SyntaxKind.JSDocThisTag;
    typeExpression?: JSDocTypeExpression;
  }
  export interface JSDocTemplateTag extends JSDocTag {
    kind: SyntaxKind.JSDocTemplateTag;
    constraint: JSDocTypeExpression | undefined;
    typeParameters: NodeArray<TypeParameterDeclaration>;
  }
  export interface JSDocReturnTag extends JSDocTag {
    kind: SyntaxKind.JSDocReturnTag;
    typeExpression?: JSDocTypeExpression;
  }
  export interface JSDocTypeTag extends JSDocTag {
    kind: SyntaxKind.JSDocTypeTag;
    typeExpression: JSDocTypeExpression;
  }
  export interface JSDocTypedefTag extends JSDocTag, NamedDeclaration {
    parent: JSDoc;
    kind: SyntaxKind.JSDocTypedefTag;
    fullName?: JSDocNamespaceDeclaration | Identifier;
    name?: Identifier;
    typeExpression?: JSDocTypeExpression | JSDocTypeLiteral;
  }
  export interface JSDocCallbackTag extends JSDocTag, NamedDeclaration {
    parent: JSDoc;
    kind: SyntaxKind.JSDocCallbackTag;
    fullName?: JSDocNamespaceDeclaration | Identifier;
    name?: Identifier;
    typeExpression: JSDocSignature;
  }
  export interface JSDocSignature extends JSDocType, Declaration {
    kind: SyntaxKind.JSDocSignature;
    typeParameters?: ReadonlyArray<JSDocTemplateTag>;
    parameters: ReadonlyArray<JSDocParameterTag>;
    type: JSDocReturnTag | undefined;
  }
  export interface JSDocPropertyLikeTag extends JSDocTag, Declaration {
    parent: JSDoc;
    name: EntityName;
    typeExpression?: JSDocTypeExpression;
    /** Whether the property name came before the type -- non-standard for JSDoc, but Typescript-like */
    isNameFirst: boolean;
    isBracketed: boolean;
  }
  export interface JSDocPropertyTag extends JSDocPropertyLikeTag {
    kind: SyntaxKind.JSDocPropertyTag;
  }
  export interface JSDocParameterTag extends JSDocPropertyLikeTag {
    kind: SyntaxKind.JSDocParameterTag;
  }
  export interface JSDocTypeLiteral extends JSDocType {
    kind: SyntaxKind.JSDocTypeLiteral;
    jsDocPropertyTags?: ReadonlyArray<JSDocPropertyLikeTag>;
    /** If true, then this type literal represents an *array* of its type. */
    isArrayType?: boolean;
  }
  export enum FlowFlags {
    Unreachable = 1,
    Start = 2,
    BranchLabel = 4,
    LoopLabel = 8,
    Assignment = 16,
    TrueCondition = 32,
    FalseCondition = 64,
    SwitchClause = 128,
    ArrayMutation = 256,
    Referenced = 512,
    Shared = 1024,
    PreFinally = 2048,
    AfterFinally = 4096,
    /** @internal */
    Cached = 8192,
    Label = 12,
    Condition = 96
  }
  export interface FlowLock {
    locked?: boolean;
  }
  export interface AfterFinallyFlow extends FlowNodeBase, FlowLock {
    antecedent: FlowNode;
  }
  export interface PreFinallyFlow extends FlowNodeBase {
    antecedent: FlowNode;
    lock: FlowLock;
  }
  export type FlowNode = AfterFinallyFlow | PreFinallyFlow | FlowStart | FlowLabel | FlowAssignment | FlowCondition | FlowSwitchClause | FlowArrayMutation;
  export interface FlowNodeBase {
    flags: FlowFlags;
    id?: number;
  }
  export interface FlowStart extends FlowNodeBase {
    container?: FunctionExpression | ArrowFunction | MethodDeclaration;
  }
  export interface FlowLabel extends FlowNodeBase {
    antecedents: FlowNode[] | undefined;
  }
  export interface FlowAssignment extends FlowNodeBase {
    node: Expression | VariableDeclaration | BindingElement;
    antecedent: FlowNode;
  }
  export interface FlowCondition extends FlowNodeBase {
    expression: Expression;
    antecedent: FlowNode;
  }
  export interface FlowSwitchClause extends FlowNodeBase {
    switchStatement: SwitchStatement;
    clauseStart: number;
    clauseEnd: number;
    antecedent: FlowNode;
  }
  export interface FlowArrayMutation extends FlowNodeBase {
    node: CallExpression | BinaryExpression;
    antecedent: FlowNode;
  }
  export type FlowType = Type | IncompleteType;
  export interface IncompleteType {
    flags: TypeFlags;
    type: Type;
  }
  export interface AmdDependency {
    path: string;
    name?: string;
  }
  /**
   * Subset of properties from SourceFile that are used in multiple utility functions
   */
  export interface SourceFileLike {
    readonly text: string;
    lineMap?: ReadonlyArray<number>;
    getPositionOfLineAndCharacter?(line: number, character: number, allowEdits?: true): number;
  }
  export interface RedirectInfo {
    /** Source file this redirects to. */
    readonly redirectTarget: SourceFile;
    /**
     * Source file for the duplicate package. This will not be used by the Program,
     * but we need to keep this around so we can watch for changes in underlying.
     */
    readonly unredirected: SourceFile;
  }
  export interface SourceFile extends Declaration {
    kind: SyntaxKind.SourceFile;
    statements: NodeArray<Statement>;
    endOfFileToken: Token<SyntaxKind.EndOfFileToken>;
    fileName: string;
    path: Path;
    text: string;
    /** Resolved path can be different from path property,
     * when file is included through project reference is mapped to its output instead of source
     * in that case resolvedPath = path to output file
     * path = input file's path
     */
    resolvedPath: Path;
    /** Original file name that can be different from fileName,
     * when file is included through project reference is mapped to its output instead of source
     * in that case originalFileName = name of input file
     * fileName = output file's name
     */
    originalFileName: string;
    /**
     * If two source files are for the same version of the same package, one will redirect to the other.
     * (See `createRedirectSourceFile` in program.ts.)
     * The redirect will have this set. The redirected-to source file will be in `redirectTargetsMap`.
     */
    redirectInfo?: RedirectInfo;
    amdDependencies: ReadonlyArray<AmdDependency>;
    moduleName?: string;
    referencedFiles: ReadonlyArray<FileReference>;
    typeReferenceDirectives: ReadonlyArray<FileReference>;
    libReferenceDirectives: ReadonlyArray<FileReference>;
    languageVariant: LanguageVariant;
    isDeclarationFile: boolean;
    renamedDependencies?: ReadonlyMap<string>;
    /**
     * lib.d.ts should have a reference comment like
     *
     *  /// <reference no-default-lib="true"/>
     *
     * If any other file has this comment, it signals not to include lib.d.ts
     * because this containing file is intended to act as a default library.
     */
    hasNoDefaultLib: boolean;
    languageVersion: ScriptTarget;
    scriptKind: ScriptKind;
    /**
     * The first "most obvious" node that makes a file an external module.
     * This is intended to be the first top-level import/export,
     * but could be arbitrarily nested (e.g. `import.meta`).
     */
    externalModuleIndicator?: Node;
    commonJsModuleIndicator?: Node;
    jsGlobalAugmentations?: SymbolTable;
    identifiers: Map<string>;
    nodeCount: number;
    identifierCount: number;
    symbolCount: number;
    parseDiagnostics: DiagnosticWithLocation[];
    bindDiagnostics: DiagnosticWithLocation[];
    bindSuggestionDiagnostics?: DiagnosticWithLocation[];
    jsDocDiagnostics?: DiagnosticWithLocation[];
    additionalSyntacticDiagnostics?: ReadonlyArray<DiagnosticWithLocation>;
    lineMap: ReadonlyArray<number>;
    classifiableNames?: ReadonlyUnderscoreEscapedMap<true>;
    resolvedModules?: Map<ResolvedModuleFull | undefined>;
    resolvedTypeReferenceDirectiveNames: Map<ResolvedTypeReferenceDirective | undefined>;
    imports: ReadonlyArray<StringLiteralLike>;
    moduleAugmentations: ReadonlyArray<StringLiteral | Identifier>;
    patternAmbientModules?: PatternAmbientModule[];
    ambientModuleNames: ReadonlyArray<string>;
    checkJsDirective?: CheckJsDirective;
    version: string;
    pragmas: ReadonlyPragmaMap;
    localJsxNamespace?: __String;
    localJsxFactory?: EntityName;
    exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
  }
  export type ExportedModulesFromDeclarationEmit = ReadonlyArray<Symbol>;
  export interface Bundle extends Node {
    kind: SyntaxKind.Bundle;
    prepends: ReadonlyArray<InputFiles | UnparsedSource>;
    sourceFiles: ReadonlyArray<SourceFile>;
    syntheticFileReferences?: ReadonlyArray<FileReference>;
    syntheticTypeReferences?: ReadonlyArray<FileReference>;
    syntheticLibReferences?: ReadonlyArray<FileReference>;
    hasNoDefaultLib?: boolean;
  }
  export interface InputFiles extends Node {
    kind: SyntaxKind.InputFiles;
    javascriptPath?: string;
    javascriptText: string;
    javascriptMapPath?: string;
    javascriptMapText?: string;
    declarationPath?: string;
    declarationText: string;
    declarationMapPath?: string;
    declarationMapText?: string;
    buildInfoPath?: string;
    buildInfo?: BuildInfo;
    oldFileOfCurrentEmit?: boolean;
  }
  export interface UnparsedSource extends Node {
    kind: SyntaxKind.UnparsedSource;
    fileName: string;
    text: string;
    prologues: ReadonlyArray<UnparsedPrologue>;
    helpers: ReadonlyArray<UnscopedEmitHelper> | undefined;
    referencedFiles: ReadonlyArray<FileReference>;
    typeReferenceDirectives: ReadonlyArray<string> | undefined;
    libReferenceDirectives: ReadonlyArray<FileReference>;
    hasNoDefaultLib?: boolean;
    sourceMapPath?: string;
    sourceMapText?: string;
    syntheticReferences?: ReadonlyArray<UnparsedSyntheticReference>;
    texts: ReadonlyArray<UnparsedSourceText>;
    oldFileOfCurrentEmit?: boolean;
    parsedSourceMap?: RawSourceMap | false | undefined;
    getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
  }
  export type UnparsedSourceText = UnparsedPrepend | UnparsedTextLike;
  export type UnparsedNode = UnparsedPrologue | UnparsedSourceText | UnparsedSyntheticReference;
  export interface UnparsedSection extends Node {
    kind: SyntaxKind;
    data?: string;
    parent: UnparsedSource;
  }
  export interface UnparsedPrologue extends UnparsedSection {
    kind: SyntaxKind.UnparsedPrologue;
    data: string;
    parent: UnparsedSource;
  }
  export interface UnparsedPrepend extends UnparsedSection {
    kind: SyntaxKind.UnparsedPrepend;
    data: string;
    parent: UnparsedSource;
    texts: ReadonlyArray<UnparsedTextLike>;
  }
  export interface UnparsedTextLike extends UnparsedSection {
    kind: SyntaxKind.UnparsedText | SyntaxKind.UnparsedInternalText;
    parent: UnparsedSource;
  }
  export interface UnparsedSyntheticReference extends UnparsedSection {
    kind: SyntaxKind.UnparsedSyntheticReference;
    parent: UnparsedSource;
    section: BundleFileHasNoDefaultLib | BundleFileReference;
  }
  export interface JsonSourceFile extends SourceFile {
    statements: NodeArray<JsonObjectExpressionStatement>;
  }
  export interface TsConfigSourceFile extends JsonSourceFile {
    extendedSourceFiles?: string[];
  }
  export interface JsonMinusNumericLiteral extends PrefixUnaryExpression {
    kind: SyntaxKind.PrefixUnaryExpression;
    operator: SyntaxKind.MinusToken;
    operand: NumericLiteral;
  }
  export interface JsonObjectExpressionStatement extends ExpressionStatement {
    expression: ObjectLiteralExpression | ArrayLiteralExpression | JsonMinusNumericLiteral | NumericLiteral | StringLiteral | BooleanLiteral | NullLiteral;
  }
  export interface ScriptReferenceHost {
    getCompilerOptions(): CompilerOptions;
    getSourceFile(fileName: string): SourceFile | undefined;
    getSourceFileByPath(path: Path): SourceFile | undefined;
    getCurrentDirectory(): string;
  }
  export interface ParseConfigHost {
    useCaseSensitiveFileNames: boolean;
    readDirectory(rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): ReadonlyArray<string>;
    /**
     * Gets a value indicating whether the specified path exists and is a file.
     * @param path The path to test.
     */
    fileExists(path: string): boolean;
    readFile(path: string): string | undefined;
    trace?(s: string): void;
  }
  /**
   * Branded string for keeping track of when we've turned an ambiguous path
   * specified like "./blah" to an absolute path to an actual
   * tsconfig file, e.g. "/root/blah/tsconfig.json"
   */
  export type ResolvedConfigFileName = string & {
    _isResolvedConfigFileName: never;
  };
  export type WriteFileCallback = (fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: ReadonlyArray<SourceFile>) => void;
  export class OperationCanceledException {
  }
  export interface CancellationToken {
    isCancellationRequested(): boolean;
    /** @throws OperationCanceledException if isCancellationRequested is true */
    throwIfCancellationRequested(): void;
  }
  export enum RefFileKind {
    Import = 0,
    ReferenceFile = 1,
    TypeReferenceDirective = 2
  }
  export interface RefFile {
    kind: RefFileKind;
    index: number;
    file: Path;
  }
  export interface Program extends ScriptReferenceHost {
    /**
     * Get a list of root file names that were passed to a 'createProgram'
     */
    getRootFileNames(): ReadonlyArray<string>;
    /**
     * Get a list of files in the program
     */
    getSourceFiles(): ReadonlyArray<SourceFile>;
    /**
     * Get a list of file names that were passed to 'createProgram' or referenced in a
     * program source file but could not be located.
     */
    getMissingFilePaths(): ReadonlyArray<Path>;
    getRefFileMap(): MultiMap<RefFile> | undefined;
    /**
     * Emits the JavaScript and declaration files.  If targetSourceFile is not specified, then
     * the JavaScript and declaration files will be produced for all the files in this program.
     * If targetSourceFile is specified, then only the JavaScript and declaration for that
     * specific file will be generated.
     *
     * If writeFile is not specified then the writeFile callback from the compiler host will be
     * used for writing the JavaScript and declaration files.  Otherwise, the writeFile parameter
     * will be invoked when writing the JavaScript and declaration files.
     */
    emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
    getOptionsDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getGlobalDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<DiagnosticWithLocation>;
    /** The first time this is called, it will return global diagnostics (no location). */
    getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getDeclarationDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<DiagnosticWithLocation>;
    getConfigFileParsingDiagnostics(): ReadonlyArray<Diagnostic>;
    getSuggestionDiagnostics(sourceFile: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<DiagnosticWithLocation>;
    /**
     * Gets a type checker that can be used to semantically analyze source files in the program.
     */
    getTypeChecker(): TypeChecker;
    getCommonSourceDirectory(): string;
    getDiagnosticsProducingTypeChecker(): TypeChecker;
    dropDiagnosticsProducingTypeChecker(): void;
    getClassifiableNames(): UnderscoreEscapedMap<true>;
    getNodeCount(): number;
    getIdentifierCount(): number;
    getSymbolCount(): number;
    getTypeCount(): number;
    getRelationCacheSizes(): {
      assignable: number;
      identity: number;
      subtype: number;
    };
    getFileProcessingDiagnostics(): DiagnosticCollection;
    getResolvedTypeReferenceDirectives(): Map<ResolvedTypeReferenceDirective | undefined>;
    isSourceFileFromExternalLibrary(file: SourceFile): boolean;
    isSourceFileDefaultLibrary(file: SourceFile): boolean;
    structureIsReused?: StructureIsReused;
    getSourceFileFromReference(referencingFile: SourceFile | UnparsedSource, ref: FileReference): SourceFile | undefined;
    getLibFileFromReference(ref: FileReference): SourceFile | undefined;
    /** Given a source file, get the name of the package it was imported from. */
    sourceFileToPackageName: Map<string>;
    /** Set of all source files that some other source file redirects to. */
    redirectTargetsMap: MultiMap<string>;
    /** Is the file emitted file */
    isEmittedFile(file: string): boolean;
    getResolvedModuleWithFailedLookupLocationsFromCache(moduleName: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
    getProjectReferences(): ReadonlyArray<ProjectReference> | undefined;
    getResolvedProjectReferences(): ReadonlyArray<ResolvedProjectReference | undefined> | undefined;
    getProjectReferenceRedirect(fileName: string): string | undefined;
    getResolvedProjectReferenceToRedirect(fileName: string): ResolvedProjectReference | undefined;
    forEachResolvedProjectReference<T>(cb: (resolvedProjectReference: ResolvedProjectReference | undefined, resolvedProjectReferencePath: Path) => T | undefined): T | undefined;
    getResolvedProjectReferenceByPath(projectReferencePath: Path): ResolvedProjectReference | undefined;
    getProgramBuildInfo?(): ProgramBuildInfo | undefined;
    emitBuildInfo(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken): EmitResult;
  }
  export type RedirectTargetsMap = ReadonlyMap<ReadonlyArray<string>>;
  export interface ResolvedProjectReference {
    commandLine: ParsedCommandLine;
    sourceFile: SourceFile;
    references?: ReadonlyArray<ResolvedProjectReference | undefined>;
  }
  export enum StructureIsReused {
    Not = 0,
    SafeModules = 1,
    Completely = 2
  }
  export type CustomTransformerFactory = (context: TransformationContext) => CustomTransformer;
  export interface CustomTransformer {
    transformSourceFile(node: SourceFile): SourceFile;
    transformBundle(node: Bundle): Bundle;
  }
  export interface CustomTransformers {
    /** Custom transformers to evaluate before built-in .js transformations. */
    before?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
    /** Custom transformers to evaluate after built-in .js transformations. */
    after?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
    /** Custom transformers to evaluate after built-in .d.ts transformations. */
    afterDeclarations?: (TransformerFactory<Bundle | SourceFile> | CustomTransformerFactory)[];
  }
  export interface EmitTransformers {
    scriptTransformers: readonly TransformerFactory<SourceFile | Bundle>[];
    declarationTransformers: readonly TransformerFactory<SourceFile | Bundle>[];
  }
  export interface SourceMapSpan {
    /** Line number in the .js file. */
    emittedLine: number;
    /** Column number in the .js file. */
    emittedColumn: number;
    /** Line number in the .ts file. */
    sourceLine: number;
    /** Column number in the .ts file. */
    sourceColumn: number;
    /** Optional name (index into names array) associated with this span. */
    nameIndex?: number;
    /** .ts file (index into sources array) associated with this span */
    sourceIndex: number;
  }
  export interface SourceMapEmitResult {
    inputSourceFileNames: ReadonlyArray<string>;
    sourceMap: RawSourceMap;
  }
  /** Return code used by getEmitOutput function to indicate status of the function */
  export enum ExitStatus {
    Success = 0,
    DiagnosticsPresent_OutputsSkipped = 1,
    DiagnosticsPresent_OutputsGenerated = 2,
    InvalidProject_OutputsSkipped = 3,
    ProjectReferenceCycle_OutputsSkupped = 4
  }
  export interface EmitResult {
    emitSkipped: boolean;
    /** Contains declaration emit diagnostics */
    diagnostics: ReadonlyArray<Diagnostic>;
    emittedFiles?: string[];
    sourceMaps?: SourceMapEmitResult[];
    exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
  }
  export interface TypeCheckerHost extends ModuleSpecifierResolutionHost {
    getCompilerOptions(): CompilerOptions;
    getSourceFiles(): ReadonlyArray<SourceFile>;
    getSourceFile(fileName: string): SourceFile | undefined;
    getResolvedTypeReferenceDirectives(): ReadonlyMap<ResolvedTypeReferenceDirective | undefined>;
    getProjectReferenceRedirect(fileName: string): string | undefined;
    readonly redirectTargetsMap: RedirectTargetsMap;
  }
  export interface TypeChecker {
    getTypeOfSymbolAtLocation(symbol: Symbol, node: Node): Type;
    getDeclaredTypeOfSymbol(symbol: Symbol): Type;
    getPropertiesOfType(type: Type): Symbol[];
    getPropertyOfType(type: Type, propertyName: string): Symbol | undefined;
    getTypeOfPropertyOfType(type: Type, propertyName: string): Type | undefined;
    getIndexInfoOfType(type: Type, kind: IndexKind): IndexInfo | undefined;
    getSignaturesOfType(type: Type, kind: SignatureKind): ReadonlyArray<Signature>;
    getIndexTypeOfType(type: Type, kind: IndexKind): Type | undefined;
    getBaseTypes(type: InterfaceType): BaseType[];
    getBaseTypeOfLiteralType(type: Type): Type;
    getWidenedType(type: Type): Type;
    getPromisedTypeOfPromise(promise: Type, errorNode?: Node): Type | undefined;
    getReturnTypeOfSignature(signature: Signature): Type;
    /**
     * Gets the type of a parameter at a given position in a signature.
     * Returns `any` if the index is not valid.
     */
    getParameterType(signature: Signature, parameterIndex: number): Type;
    getNullableType(type: Type, flags: TypeFlags): Type;
    getNonNullableType(type: Type): Type;
    /** Note that the resulting nodes cannot be checked. */
    typeToTypeNode(type: Type, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): TypeNode | undefined;
    typeToTypeNode(type: Type, enclosingDeclaration?: Node, flags?: NodeBuilderFlags, tracker?: SymbolTracker): TypeNode | undefined;
    /** Note that the resulting nodes cannot be checked. */
    signatureToSignatureDeclaration(signature: Signature, kind: SyntaxKind, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): (SignatureDeclaration & {
      typeArguments?: NodeArray<TypeNode>;
    }) | undefined;
    signatureToSignatureDeclaration(signature: Signature, kind: SyntaxKind, enclosingDeclaration?: Node, flags?: NodeBuilderFlags, tracker?: SymbolTracker): (SignatureDeclaration & {
      typeArguments?: NodeArray<TypeNode>;
    }) | undefined;
    /** Note that the resulting nodes cannot be checked. */
    indexInfoToIndexSignatureDeclaration(indexInfo: IndexInfo, kind: IndexKind, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): IndexSignatureDeclaration | undefined;
    indexInfoToIndexSignatureDeclaration(indexInfo: IndexInfo, kind: IndexKind, enclosingDeclaration?: Node, flags?: NodeBuilderFlags, tracker?: SymbolTracker): IndexSignatureDeclaration | undefined;
    /** Note that the resulting nodes cannot be checked. */
    symbolToEntityName(symbol: Symbol, meaning: SymbolFlags, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): EntityName | undefined;
    /** Note that the resulting nodes cannot be checked. */
    symbolToExpression(symbol: Symbol, meaning: SymbolFlags, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): Expression | undefined;
    /** Note that the resulting nodes cannot be checked. */
    symbolToTypeParameterDeclarations(symbol: Symbol, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): NodeArray<TypeParameterDeclaration> | undefined;
    /** Note that the resulting nodes cannot be checked. */
    symbolToParameterDeclaration(symbol: Symbol, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): ParameterDeclaration | undefined;
    /** Note that the resulting nodes cannot be checked. */
    typeParameterToDeclaration(parameter: TypeParameter, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): TypeParameterDeclaration | undefined;
    getSymbolsInScope(location: Node, meaning: SymbolFlags): Symbol[];
    getSymbolAtLocation(node: Node): Symbol | undefined;
    getSymbolsOfParameterPropertyDeclaration(parameter: ParameterDeclaration, parameterName: string): Symbol[];
    /**
     * The function returns the value (local variable) symbol of an identifier in the short-hand property assignment.
     * This is necessary as an identifier in short-hand property assignment can contains two meaning: property name and property value.
     */
    getShorthandAssignmentValueSymbol(location: Node): Symbol | undefined;
    getExportSpecifierLocalTargetSymbol(location: ExportSpecifier): Symbol | undefined;
    /**
     * If a symbol is a local symbol with an associated exported symbol, returns the exported symbol.
     * Otherwise returns its input.
     * For example, at `export type T = number;`:
     *     - `getSymbolAtLocation` at the location `T` will return the exported symbol for `T`.
     *     - But the result of `getSymbolsInScope` will contain the *local* symbol for `T`, not the exported symbol.
     *     - Calling `getExportSymbolOfSymbol` on that local symbol will return the exported symbol.
     */
    getExportSymbolOfSymbol(symbol: Symbol): Symbol;
    getPropertySymbolOfDestructuringAssignment(location: Identifier): Symbol | undefined;
    getTypeOfAssignmentPattern(pattern: AssignmentPattern): Type;
    getTypeAtLocation(node: Node): Type;
    getTypeFromTypeNode(node: TypeNode): Type;
    signatureToString(signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags, kind?: SignatureKind): string;
    typeToString(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): string;
    symbolToString(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags): string;
    typePredicateToString(predicate: TypePredicate, enclosingDeclaration?: Node, flags?: TypeFormatFlags): string;
    writeSignature(signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags, kind?: SignatureKind, writer?: EmitTextWriter): string;
    writeType(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags, writer?: EmitTextWriter): string;
    writeSymbol(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags, writer?: EmitTextWriter): string;
    writeTypePredicate(predicate: TypePredicate, enclosingDeclaration?: Node, flags?: TypeFormatFlags, writer?: EmitTextWriter): string;
    getFullyQualifiedName(symbol: Symbol): string;
    getAugmentedPropertiesOfType(type: Type): Symbol[];
    getRootSymbols(symbol: Symbol): ReadonlyArray<Symbol>;
    getContextualType(node: Expression): Type | undefined;
    getContextualTypeForObjectLiteralElement(element: ObjectLiteralElementLike): Type | undefined;
    getContextualTypeForArgumentAtIndex(call: CallLikeExpression, argIndex: number): Type | undefined;
    getContextualTypeForJsxAttribute(attribute: JsxAttribute | JsxSpreadAttribute): Type | undefined;
    isContextSensitive(node: Expression | MethodDeclaration | ObjectLiteralElementLike | JsxAttributeLike): boolean;
    /**
     * returns unknownSignature in the case of an error.
     * returns undefined if the node is not valid.
     * @param argumentCount Apparent number of arguments, passed in case of a possibly incomplete call. This should come from an ArgumentListInfo. See `signatureHelp.ts`.
     */
    getResolvedSignature(node: CallLikeExpression, candidatesOutArray?: Signature[], argumentCount?: number): Signature | undefined;
    getResolvedSignatureForSignatureHelp(node: CallLikeExpression, candidatesOutArray?: Signature[], argumentCount?: number): Signature | undefined;
    getExpandedParameters(sig: Signature): ReadonlyArray<Symbol>;
    hasEffectiveRestParameter(sig: Signature): boolean;
    getSignatureFromDeclaration(declaration: SignatureDeclaration): Signature | undefined;
    isImplementationOfOverload(node: SignatureDeclaration): boolean | undefined;
    isUndefinedSymbol(symbol: Symbol): boolean;
    isArgumentsSymbol(symbol: Symbol): boolean;
    isUnknownSymbol(symbol: Symbol): boolean;
    getMergedSymbol(symbol: Symbol): Symbol;
    getConstantValue(node: EnumMember | PropertyAccessExpression | ElementAccessExpression): string | number | undefined;
    isValidPropertyAccess(node: PropertyAccessExpression | QualifiedName | ImportTypeNode, propertyName: string): boolean;
    /** Exclude accesses to private properties or methods with a `this` parameter that `type` doesn't satisfy. */
    isValidPropertyAccessForCompletions(node: PropertyAccessExpression | ImportTypeNode | QualifiedName, type: Type, property: Symbol): boolean;
    /** Follow all aliases to get the original symbol. */
    getAliasedSymbol(symbol: Symbol): Symbol;
    /** Follow a *single* alias to get the immediately aliased symbol. */
    getImmediateAliasedSymbol(symbol: Symbol): Symbol | undefined;
    getExportsOfModule(moduleSymbol: Symbol): Symbol[];
    /** Unlike `getExportsOfModule`, this includes properties of an `export =` value. */
    getExportsAndPropertiesOfModule(moduleSymbol: Symbol): Symbol[];
    getJsxIntrinsicTagNamesAt(location: Node): Symbol[];
    isOptionalParameter(node: ParameterDeclaration): boolean;
    getAmbientModules(): Symbol[];
    tryGetMemberInModuleExports(memberName: string, moduleSymbol: Symbol): Symbol | undefined;
    /**
     * Unlike `tryGetMemberInModuleExports`, this includes properties of an `export =` value.
     * Does *not* return properties of primitive types.
     */
    tryGetMemberInModuleExportsAndProperties(memberName: string, moduleSymbol: Symbol): Symbol | undefined;
    getApparentType(type: Type): Type;
    getSuggestionForNonexistentProperty(name: Identifier | string, containingType: Type): string | undefined;
    getSuggestionForNonexistentSymbol(location: Node, name: string, meaning: SymbolFlags): string | undefined;
    getSuggestionForNonexistentExport(node: Identifier, target: Symbol): string | undefined;
    getBaseConstraintOfType(type: Type): Type | undefined;
    getDefaultFromTypeParameter(type: Type): Type | undefined;
    getAnyType(): Type;
    getStringType(): Type;
    getNumberType(): Type;
    getBooleanType(): Type;
    getFalseType(fresh?: boolean): Type;
    getTrueType(fresh?: boolean): Type;
    getVoidType(): Type;
    getUndefinedType(): Type;
    getNullType(): Type;
    getESSymbolType(): Type;
    getNeverType(): Type;
    getUnionType(types: Type[], subtypeReduction?: UnionReduction): Type;
    createArrayType(elementType: Type): Type;
    getElementTypeOfArrayType(arrayType: Type): Type | undefined;
    createPromiseType(type: Type): Type;
    createAnonymousType(symbol: Symbol, members: SymbolTable, callSignatures: Signature[], constructSignatures: Signature[], stringIndexInfo: IndexInfo | undefined, numberIndexInfo: IndexInfo | undefined): Type;
    createSignature(declaration: SignatureDeclaration, typeParameters: TypeParameter[] | undefined, thisParameter: Symbol | undefined, parameters: Symbol[], resolvedReturnType: Type, typePredicate: TypePredicate | undefined, minArgumentCount: number, hasRestParameter: boolean, hasLiteralTypes: boolean): Signature;
    createSymbol(flags: SymbolFlags, name: __String): TransientSymbol;
    createIndexInfo(type: Type, isReadonly: boolean, declaration?: SignatureDeclaration): IndexInfo;
    isSymbolAccessible(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags, shouldComputeAliasToMarkVisible: boolean): SymbolAccessibilityResult;
    tryFindAmbientModuleWithoutAugmentations(moduleName: string): Symbol | undefined;
    getSymbolWalker(accept?: (symbol: Symbol) => boolean): SymbolWalker;
    getDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): Diagnostic[];
    getGlobalDiagnostics(): Diagnostic[];
    getEmitResolver(sourceFile?: SourceFile, cancellationToken?: CancellationToken): EmitResolver;
    getNodeCount(): number;
    getIdentifierCount(): number;
    getSymbolCount(): number;
    getTypeCount(): number;
    getRelationCacheSizes(): {
      assignable: number;
      identity: number;
      subtype: number;
    };
    isArrayType(type: Type): boolean;
    isTupleType(type: Type): boolean;
    isArrayLikeType(type: Type): boolean;
    getObjectFlags(type: Type): ObjectFlags;
    /**
     * True if `contextualType` should not be considered for completions because
     * e.g. it specifies `kind: "a"` and obj has `kind: "b"`.
     */
    isTypeInvalidDueToUnionDiscriminant(contextualType: Type, obj: ObjectLiteralExpression | JsxAttributes): boolean;
    /**
     * For a union, will include a property if it's defined in *any* of the member types.
     * So for `{ a } | { b }`, this will include both `a` and `b`.
     * Does not include properties of primitive types.
     */
    getAllPossiblePropertiesOfTypes(type: ReadonlyArray<Type>): Symbol[];
    resolveName(name: string, location: Node, meaning: SymbolFlags, excludeGlobals: boolean): Symbol | undefined;
    getJsxNamespace(location?: Node): string;
    /**
     * Note that this will return undefined in the following case:
     *     // a.ts
     *     export namespace N { export class C { } }
     *     // b.ts
     *     <<enclosingDeclaration>>
     * Where `C` is the symbol we're looking for.
     * This should be called in a loop climbing parents of the symbol, so we'll get `N`.
     */
    getAccessibleSymbolChain(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags, useOnlyExternalAliasing: boolean): Symbol[] | undefined;
    getTypePredicateOfSignature(signature: Signature): TypePredicate | undefined;
    /**
     * An external module with an 'export =' declaration resolves to the target of the 'export =' declaration,
     * and an external module with no 'export =' declaration resolves to the module itself.
     */
    resolveExternalModuleSymbol(symbol: Symbol): Symbol;
    /** @param node A location where we might consider accessing `this`. Not necessarily a ThisExpression. */
    tryGetThisTypeAt(node: Node, includeGlobalThis?: boolean): Type | undefined;
    getTypeArgumentConstraint(node: TypeNode): Type | undefined;
    /**
     * Does *not* get *all* suggestion diagnostics, just the ones that were convenient to report in the checker.
     * Others are added in computeSuggestionDiagnostics.
     */
    getSuggestionDiagnostics(file: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<DiagnosticWithLocation>;
    /**
     * Depending on the operation performed, it may be appropriate to throw away the checker
     * if the cancellation token is triggered. Typically, if it is used for error checking
     * and the operation is cancelled, then it should be discarded, otherwise it is safe to keep.
     */
    runWithCancellationToken<T>(token: CancellationToken, cb: (checker: TypeChecker) => T): T;
    getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol: Symbol): ReadonlyArray<TypeParameter> | undefined;
  }
  export enum UnionReduction {
    None = 0,
    Literal = 1,
    Subtype = 2
  }
  export enum NodeBuilderFlags {
    None = 0,
    NoTruncation = 1,
    WriteArrayAsGenericType = 2,
    GenerateNamesForShadowedTypeParams = 4,
    UseStructuralFallback = 8,
    ForbidIndexedAccessSymbolReferences = 16,
    WriteTypeArgumentsOfSignature = 32,
    UseFullyQualifiedType = 64,
    UseOnlyExternalAliasing = 128,
    SuppressAnyReturnType = 256,
    WriteTypeParametersInQualifiedName = 512,
    MultilineObjectLiterals = 1024,
    WriteClassExpressionAsTypeLiteral = 2048,
    UseTypeOfFunction = 4096,
    OmitParameterModifiers = 8192,
    UseAliasDefinedOutsideCurrentScope = 16384,
    AllowThisInObjectLiteral = 32768,
    AllowQualifedNameInPlaceOfIdentifier = 65536,
    AllowAnonymousIdentifier = 131072,
    AllowEmptyUnionOrIntersection = 262144,
    AllowEmptyTuple = 524288,
    AllowUniqueESSymbolType = 1048576,
    AllowEmptyIndexInfoType = 2097152,
    AllowNodeModulesRelativePaths = 67108864,
    DoNotIncludeSymbolChain = 134217728,
    IgnoreErrors = 70221824,
    InObjectTypeLiteral = 4194304,
    InTypeAlias = 8388608,
    InInitialEntityName = 16777216,
    InReverseMappedType = 33554432
  }
  export enum TypeFormatFlags {
    None = 0,
    NoTruncation = 1,
    WriteArrayAsGenericType = 2,
    UseStructuralFallback = 8,
    WriteTypeArgumentsOfSignature = 32,
    UseFullyQualifiedType = 64,
    SuppressAnyReturnType = 256,
    MultilineObjectLiterals = 1024,
    WriteClassExpressionAsTypeLiteral = 2048,
    UseTypeOfFunction = 4096,
    OmitParameterModifiers = 8192,
    UseAliasDefinedOutsideCurrentScope = 16384,
    AllowUniqueESSymbolType = 1048576,
    AddUndefined = 131072,
    WriteArrowStyleSignature = 262144,
    InArrayType = 524288,
    InElementType = 2097152,
    InFirstTypeArgument = 4194304,
    InTypeAlias = 8388608,
    /** @deprecated */ WriteOwnNameForAnyLike = 0,
    NodeBuilderFlagsMask = 9469291
  }
  export enum SymbolFormatFlags {
    None = 0,
    WriteTypeParametersOrArguments = 1,
    UseOnlyExternalAliasing = 2,
    AllowAnyNodeKind = 4,
    UseAliasDefinedOutsideCurrentScope = 8,
    DoNotIncludeSymbolChain = 16
  }
  export interface SymbolWalker {
    /** Note: Return values are not ordered. */
    walkType(root: Type): {
      visitedTypes: ReadonlyArray<Type>;
      visitedSymbols: ReadonlyArray<Symbol>;
    };
    /** Note: Return values are not ordered. */
    walkSymbol(root: Symbol): {
      visitedTypes: ReadonlyArray<Type>;
      visitedSymbols: ReadonlyArray<Symbol>;
    };
  }
  interface SymbolWriter extends SymbolTracker {
    writeKeyword(text: string): void;
    writeOperator(text: string): void;
    writePunctuation(text: string): void;
    writeSpace(text: string): void;
    writeStringLiteral(text: string): void;
    writeParameter(text: string): void;
    writeProperty(text: string): void;
    writeSymbol(text: string, symbol: Symbol): void;
    writeLine(): void;
    increaseIndent(): void;
    decreaseIndent(): void;
    clear(): void;
  }
  export enum SymbolAccessibility {
    Accessible = 0,
    NotAccessible = 1,
    CannotBeNamed = 2
  }
  export enum SyntheticSymbolKind {
    UnionOrIntersection = 0,
    Spread = 1
  }
  export enum TypePredicateKind {
    This = 0,
    Identifier = 1
  }
  export interface TypePredicateBase {
    kind: TypePredicateKind;
    type: Type;
  }
  export interface ThisTypePredicate extends TypePredicateBase {
    kind: TypePredicateKind.This;
  }
  export interface IdentifierTypePredicate extends TypePredicateBase {
    kind: TypePredicateKind.Identifier;
    parameterName: string;
    parameterIndex: number;
  }
  export type TypePredicate = IdentifierTypePredicate | ThisTypePredicate;
  export type AnyImportSyntax = ImportDeclaration | ImportEqualsDeclaration;
  export type AnyImportOrReExport = AnyImportSyntax | ExportDeclaration;
  export interface ValidImportTypeNode extends ImportTypeNode {
    argument: LiteralTypeNode & {
      literal: StringLiteral;
    };
  }
  export type AnyValidImportOrReExport = (ImportDeclaration | ExportDeclaration) & {
    moduleSpecifier: StringLiteral;
  } | ImportEqualsDeclaration & {
    moduleReference: ExternalModuleReference & {
      expression: StringLiteral;
    };
  } | RequireOrImportCall | ValidImportTypeNode;
  export type RequireOrImportCall = CallExpression & {
    arguments: [StringLiteralLike];
  };
  export type LateVisibilityPaintedStatement = AnyImportSyntax | VariableStatement | ClassDeclaration | FunctionDeclaration | ModuleDeclaration | TypeAliasDeclaration | InterfaceDeclaration | EnumDeclaration;
  export interface SymbolVisibilityResult {
    accessibility: SymbolAccessibility;
    aliasesToMakeVisible?: LateVisibilityPaintedStatement[];
    errorSymbolName?: string;
    errorNode?: Node;
  }
  export interface SymbolAccessibilityResult extends SymbolVisibilityResult {
    errorModuleName?: string;
  }
  export interface AllAccessorDeclarations {
    firstAccessor: AccessorDeclaration;
    secondAccessor: AccessorDeclaration | undefined;
    getAccessor: GetAccessorDeclaration | undefined;
    setAccessor: SetAccessorDeclaration | undefined;
  }
  /** Indicates how to serialize the name for a TypeReferenceNode when emitting decorator metadata */
  export enum TypeReferenceSerializationKind {
    Unknown = 0,
    TypeWithConstructSignatureAndValue = 1,
    VoidNullableOrNeverType = 2,
    NumberLikeType = 3,
    BigIntLikeType = 4,
    StringLikeType = 5,
    BooleanType = 6,
    ArrayLikeType = 7,
    ESSymbolType = 8,
    Promise = 9,
    TypeWithCallSignature = 10,
    ObjectType = 11
  }
  export interface EmitResolver {
    hasGlobalName(name: string): boolean;
    getReferencedExportContainer(node: Identifier, prefixLocals?: boolean): SourceFile | ModuleDeclaration | EnumDeclaration | undefined;
    getReferencedImportDeclaration(node: Identifier): Declaration | undefined;
    getReferencedDeclarationWithCollidingName(node: Identifier): Declaration | undefined;
    isDeclarationWithCollidingName(node: Declaration): boolean;
    isValueAliasDeclaration(node: Node): boolean;
    isReferencedAliasDeclaration(node: Node, checkChildren?: boolean): boolean;
    isTopLevelValueImportEqualsWithEntityName(node: ImportEqualsDeclaration): boolean;
    getNodeCheckFlags(node: Node): NodeCheckFlags;
    isDeclarationVisible(node: Declaration | AnyImportSyntax): boolean;
    isLateBound(node: Declaration): node is LateBoundDeclaration;
    collectLinkedAliases(node: Identifier, setVisibility?: boolean): Node[] | undefined;
    isImplementationOfOverload(node: FunctionLike): boolean | undefined;
    isRequiredInitializedParameter(node: ParameterDeclaration): boolean;
    isOptionalUninitializedParameterProperty(node: ParameterDeclaration): boolean;
    isExpandoFunctionDeclaration(node: FunctionDeclaration): boolean;
    getPropertiesOfContainerFunction(node: Declaration): Symbol[];
    createTypeOfDeclaration(declaration: AccessorDeclaration | VariableLikeDeclaration | PropertyAccessExpression, enclosingDeclaration: Node, flags: NodeBuilderFlags, tracker: SymbolTracker, addUndefined?: boolean): TypeNode | undefined;
    createReturnTypeOfSignatureDeclaration(signatureDeclaration: SignatureDeclaration, enclosingDeclaration: Node, flags: NodeBuilderFlags, tracker: SymbolTracker): TypeNode | undefined;
    createTypeOfExpression(expr: Expression, enclosingDeclaration: Node, flags: NodeBuilderFlags, tracker: SymbolTracker): TypeNode | undefined;
    createLiteralConstValue(node: VariableDeclaration | PropertyDeclaration | PropertySignature | ParameterDeclaration, tracker: SymbolTracker): Expression;
    isSymbolAccessible(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags | undefined, shouldComputeAliasToMarkVisible: boolean): SymbolAccessibilityResult;
    isEntityNameVisible(entityName: EntityNameOrEntityNameExpression, enclosingDeclaration: Node): SymbolVisibilityResult;
    getConstantValue(node: EnumMember | PropertyAccessExpression | ElementAccessExpression): string | number | undefined;
    getReferencedValueDeclaration(reference: Identifier): Declaration | undefined;
    getTypeReferenceSerializationKind(typeName: EntityName, location?: Node): TypeReferenceSerializationKind;
    isOptionalParameter(node: ParameterDeclaration): boolean;
    moduleExportsSomeValue(moduleReferenceExpression: Expression): boolean;
    isArgumentsLocalBinding(node: Identifier): boolean;
    getExternalModuleFileFromDeclaration(declaration: ImportEqualsDeclaration | ImportDeclaration | ExportDeclaration | ModuleDeclaration | ImportTypeNode): SourceFile | undefined;
    getTypeReferenceDirectivesForEntityName(name: EntityNameOrEntityNameExpression): string[] | undefined;
    getTypeReferenceDirectivesForSymbol(symbol: Symbol, meaning?: SymbolFlags): string[] | undefined;
    isLiteralConstDeclaration(node: VariableDeclaration | PropertyDeclaration | PropertySignature | ParameterDeclaration): boolean;
    getJsxFactoryEntity(location?: Node): EntityName | undefined;
    getAllAccessorDeclarations(declaration: AccessorDeclaration): AllAccessorDeclarations;
    getSymbolOfExternalModuleSpecifier(node: StringLiteralLike): Symbol | undefined;
    isBindingCapturedByNode(node: Node, decl: VariableDeclaration | BindingElement): boolean;
  }
  export enum SymbolFlags {
    None = 0,
    FunctionScopedVariable = 1,
    BlockScopedVariable = 2,
    Property = 4,
    EnumMember = 8,
    Function = 16,
    Class = 32,
    Interface = 64,
    ConstEnum = 128,
    RegularEnum = 256,
    ValueModule = 512,
    NamespaceModule = 1024,
    TypeLiteral = 2048,
    ObjectLiteral = 4096,
    Method = 8192,
    Constructor = 16384,
    GetAccessor = 32768,
    SetAccessor = 65536,
    Signature = 131072,
    TypeParameter = 262144,
    TypeAlias = 524288,
    ExportValue = 1048576,
    Alias = 2097152,
    Prototype = 4194304,
    ExportStar = 8388608,
    Optional = 16777216,
    Transient = 33554432,
    Assignment = 67108864,
    ModuleExports = 134217728,
    All = 67108863,
    Enum = 384,
    Variable = 3,
    Value = 111551,
    Type = 788968,
    Namespace = 1920,
    Module = 1536,
    Accessor = 98304,
    FunctionScopedVariableExcludes = 111550,
    BlockScopedVariableExcludes = 111551,
    ParameterExcludes = 111551,
    PropertyExcludes = 0,
    EnumMemberExcludes = 900095,
    FunctionExcludes = 110991,
    ClassExcludes = 899503,
    InterfaceExcludes = 788872,
    RegularEnumExcludes = 899327,
    ConstEnumExcludes = 899967,
    ValueModuleExcludes = 110735,
    NamespaceModuleExcludes = 0,
    MethodExcludes = 103359,
    GetAccessorExcludes = 46015,
    SetAccessorExcludes = 78783,
    TypeParameterExcludes = 526824,
    TypeAliasExcludes = 788968,
    AliasExcludes = 2097152,
    ModuleMember = 2623475,
    ExportHasLocal = 944,
    BlockScoped = 418,
    PropertyOrAccessor = 98308,
    ClassMember = 106500,
    Classifiable = 2885600,
    LateBindingContainer = 6240
  }
  export interface Symbol {
    flags: SymbolFlags;
    escapedName: __String;
    declarations: Declaration[];
    valueDeclaration: Declaration;
    members?: SymbolTable;
    exports?: SymbolTable;
    globalExports?: SymbolTable;
    id?: number;
    mergeId?: number;
    parent?: Symbol;
    exportSymbol?: Symbol;
    nameType?: Type;
    constEnumOnlyModule?: boolean;
    isReferenced?: SymbolFlags;
    isReplaceableByMethod?: boolean;
    isAssigned?: boolean;
  }
  export interface SymbolLinks {
    immediateTarget?: Symbol;
    target?: Symbol;
    type?: Type;
    uniqueESSymbolType?: Type;
    declaredType?: Type;
    resolvedJSDocType?: Type;
    typeParameters?: TypeParameter[];
    outerTypeParameters?: TypeParameter[];
    instantiations?: Map<Type>;
    inferredClassSymbol?: Map<TransientSymbol>;
    mapper?: TypeMapper;
    referenced?: boolean;
    containingType?: UnionOrIntersectionType;
    leftSpread?: Symbol;
    rightSpread?: Symbol;
    syntheticOrigin?: Symbol;
    isDiscriminantProperty?: boolean;
    resolvedExports?: SymbolTable;
    resolvedMembers?: SymbolTable;
    exportsChecked?: boolean;
    typeParametersChecked?: boolean;
    isDeclarationWithCollidingName?: boolean;
    bindingElement?: BindingElement;
    exportsSomeValue?: boolean;
    enumKind?: EnumKind;
    originatingImport?: ImportDeclaration | ImportCall;
    lateSymbol?: Symbol;
    specifierCache?: Map<string>;
    extendedContainers?: Symbol[];
    extendedContainersByFile?: Map<Symbol[]>;
    variances?: VarianceFlags[];
    deferralConstituents?: Type[];
    deferralParent?: Type;
  }
  export enum EnumKind {
    Numeric = 0,
    Literal = 1
  }
  export enum CheckFlags {
    Instantiated = 1,
    SyntheticProperty = 2,
    SyntheticMethod = 4,
    Readonly = 8,
    ReadPartial = 16,
    WritePartial = 32,
    HasNonUniformType = 64,
    HasLiteralType = 128,
    ContainsPublic = 256,
    ContainsProtected = 512,
    ContainsPrivate = 1024,
    ContainsStatic = 2048,
    Late = 4096,
    ReverseMapped = 8192,
    OptionalParameter = 16384,
    RestParameter = 32768,
    DeferredType = 65536,
    Synthetic = 6,
    Discriminant = 192,
    Partial = 48
  }
  export interface TransientSymbol extends Symbol, SymbolLinks {
    checkFlags: CheckFlags;
  }
  export interface ReverseMappedSymbol extends TransientSymbol {
    propertyType: Type;
    mappedType: MappedType;
    constraintType: IndexType;
  }
  export enum InternalSymbolName {
    Call = "__call",
    Constructor = "__constructor",
    New = "__new",
    Index = "__index",
    ExportStar = "__export",
    Global = "__global",
    Missing = "__missing",
    Type = "__type",
    Object = "__object",
    JSXAttributes = "__jsxAttributes",
    Class = "__class",
    Function = "__function",
    Computed = "__computed",
    Resolving = "__resolving__",
    ExportEquals = "export=",
    Default = "default",
    This = "this"
  }
  /**
   * This represents a string whose leading underscore have been escaped by adding extra leading underscores.
   * The shape of this brand is rather unique compared to others we've used.
   * Instead of just an intersection of a string and an object, it is that union-ed
   * with an intersection of void and an object. This makes it wholly incompatible
   * with a normal string (which is good, it cannot be misused on assignment or on usage),
   * while still being comparable with a normal string via === (also good) and castable from a string.
   */
  export type __String = (string & {
    __escapedIdentifier: void;
  }) | (void & {
    __escapedIdentifier: void;
  }) | InternalSymbolName;
  /** ReadonlyMap where keys are `__String`s. */
  export interface ReadonlyUnderscoreEscapedMap<T> {
    get(key: __String): T | undefined;
    has(key: __String): boolean;
    forEach(action: (value: T, key: __String) => void): void;
    readonly size: number;
    keys(): Iterator<__String>;
    values(): Iterator<T>;
    entries(): Iterator<[__String, T]>;
  }
  /** Map where keys are `__String`s. */
  export interface UnderscoreEscapedMap<T> extends ReadonlyUnderscoreEscapedMap<T> {
    set(key: __String, value: T): this;
    delete(key: __String): boolean;
    clear(): void;
  }
  /** SymbolTable based on ES6 Map interface. */
  export type SymbolTable = UnderscoreEscapedMap<Symbol>;
  /** Used to track a `declare module "foo*"`-like declaration. */
  export interface PatternAmbientModule {
    pattern: Pattern;
    symbol: Symbol;
  }
  export enum NodeCheckFlags {
    TypeChecked = 1,
    LexicalThis = 2,
    CaptureThis = 4,
    CaptureNewTarget = 8,
    SuperInstance = 256,
    SuperStatic = 512,
    ContextChecked = 1024,
    AsyncMethodWithSuper = 2048,
    AsyncMethodWithSuperBinding = 4096,
    CaptureArguments = 8192,
    EnumValuesComputed = 16384,
    LexicalModuleMergesWithClass = 32768,
    LoopWithCapturedBlockScopedBinding = 65536,
    ContainsCapturedBlockScopeBinding = 131072,
    CapturedBlockScopedBinding = 262144,
    BlockScopedBindingInLoop = 524288,
    ClassWithBodyScopedClassBinding = 1048576,
    BodyScopedClassBinding = 2097152,
    NeedsLoopOutParameter = 4194304,
    AssignmentsMarked = 8388608,
    ClassWithConstructorReference = 16777216,
    ConstructorReferenceInClass = 33554432
  }
  export interface NodeLinks {
    flags: NodeCheckFlags;
    resolvedType?: Type;
    resolvedEnumType?: Type;
    resolvedSignature?: Signature;
    resolvedSymbol?: Symbol;
    resolvedIndexInfo?: IndexInfo;
    maybeTypePredicate?: boolean;
    enumMemberValue?: string | number;
    isVisible?: boolean;
    containsArgumentsReference?: boolean;
    hasReportedStatementInAmbientContext?: boolean;
    jsxFlags: JsxFlags;
    resolvedJsxElementAttributesType?: Type;
    resolvedJsxElementAllAttributesType?: Type;
    hasSuperCall?: boolean;
    superCall?: SuperCall;
    switchTypes?: Type[];
    jsxNamespace?: Symbol | false;
    contextFreeType?: Type;
    deferredNodes?: Map<Node>;
    capturedBlockScopeBindings?: Symbol[];
  }
  export enum TypeFlags {
    Any = 1,
    Unknown = 2,
    String = 4,
    Number = 8,
    Boolean = 16,
    Enum = 32,
    BigInt = 64,
    StringLiteral = 128,
    NumberLiteral = 256,
    BooleanLiteral = 512,
    EnumLiteral = 1024,
    BigIntLiteral = 2048,
    ESSymbol = 4096,
    UniqueESSymbol = 8192,
    Void = 16384,
    Undefined = 32768,
    Null = 65536,
    Never = 131072,
    TypeParameter = 262144,
    Object = 524288,
    Union = 1048576,
    Intersection = 2097152,
    Index = 4194304,
    IndexedAccess = 8388608,
    Conditional = 16777216,
    Substitution = 33554432,
    NonPrimitive = 67108864,
    AnyOrUnknown = 3,
    Nullable = 98304,
    Literal = 2944,
    Unit = 109440,
    StringOrNumberLiteral = 384,
    StringOrNumberLiteralOrUnique = 8576,
    DefinitelyFalsy = 117632,
    PossiblyFalsy = 117724,
    Intrinsic = 67359327,
    Primitive = 131068,
    StringLike = 132,
    NumberLike = 296,
    BigIntLike = 2112,
    BooleanLike = 528,
    EnumLike = 1056,
    ESSymbolLike = 12288,
    VoidLike = 49152,
    DisjointDomains = 67238908,
    UnionOrIntersection = 3145728,
    StructuredType = 3670016,
    TypeVariable = 8650752,
    InstantiableNonPrimitive = 58982400,
    InstantiablePrimitive = 4194304,
    Instantiable = 63176704,
    StructuredOrInstantiable = 66846720,
    ObjectFlagsType = 3899392,
    Simplifiable = 25165824,
    Narrowable = 133970943,
    NotUnionOrUnit = 67637251,
    NotPrimitiveUnion = 66994211,
    IncludesMask = 68943871,
    IncludesStructuredOrInstantiable = 262144,
    IncludesNonWideningType = 2097152,
    IncludesWildcard = 4194304,
    IncludesEmptyObject = 8388608,
    GenericMappedType = 131072
  }
  export type DestructuringPattern = BindingPattern | ObjectLiteralExpression | ArrayLiteralExpression;
  export interface Type {
    flags: TypeFlags;
    id: number;
    checker: TypeChecker;
    symbol: Symbol;
    pattern?: DestructuringPattern;
    aliasSymbol?: Symbol;
    aliasTypeArguments?: ReadonlyArray<Type>;
    aliasTypeArgumentsContainsMarker?: boolean;
    permissiveInstantiation?: Type;
    restrictiveInstantiation?: Type;
    immediateBaseConstraint?: Type;
    widened?: Type;
  }
  export interface IntrinsicType extends Type {
    intrinsicName: string;
    objectFlags: ObjectFlags;
  }
  export interface NullableType extends IntrinsicType {
    objectFlags: ObjectFlags;
  }
  export interface FreshableIntrinsicType extends IntrinsicType {
    freshType: IntrinsicType;
    regularType: IntrinsicType;
  }
  export type FreshableType = LiteralType | FreshableIntrinsicType;
  export interface LiteralType extends Type {
    value: string | number | PseudoBigInt;
    freshType: LiteralType;
    regularType: LiteralType;
  }
  export interface UniqueESSymbolType extends Type {
    symbol: Symbol;
    escapedName: __String;
  }
  export interface StringLiteralType extends LiteralType {
    value: string;
  }
  export interface NumberLiteralType extends LiteralType {
    value: number;
  }
  export interface BigIntLiteralType extends LiteralType {
    value: PseudoBigInt;
  }
  export interface EnumType extends Type {
  }
  export enum ObjectFlags {
    Class = 1,
    Interface = 2,
    Reference = 4,
    Tuple = 8,
    Anonymous = 16,
    Mapped = 32,
    Instantiated = 64,
    ObjectLiteral = 128,
    EvolvingArray = 256,
    ObjectLiteralPatternWithComputedProperties = 512,
    ContainsSpread = 1024,
    ReverseMapped = 2048,
    JsxAttributes = 4096,
    MarkerType = 8192,
    JSLiteral = 16384,
    FreshLiteral = 32768,
    ArrayLiteral = 65536,
    PrimitiveUnion = 131072,
    ContainsWideningType = 262144,
    ContainsObjectOrArrayLiteral = 524288,
    NonInferrableType = 1048576,
    ClassOrInterface = 3,
    RequiresWidening = 786432,
    PropagatingFlags = 1835008
  }
  export type ObjectFlagsType = NullableType | ObjectType | UnionType | IntersectionType;
  export interface ObjectType extends Type {
    objectFlags: ObjectFlags;
    members?: SymbolTable;
    properties?: Symbol[];
    callSignatures?: ReadonlyArray<Signature>;
    constructSignatures?: ReadonlyArray<Signature>;
    stringIndexInfo?: IndexInfo;
    numberIndexInfo?: IndexInfo;
  }
  /** Class and interface types (ObjectFlags.Class and ObjectFlags.Interface). */
  export interface InterfaceType extends ObjectType {
    typeParameters: TypeParameter[] | undefined;
    outerTypeParameters: TypeParameter[] | undefined;
    localTypeParameters: TypeParameter[] | undefined;
    thisType: TypeParameter | undefined;
    resolvedBaseConstructorType?: Type;
    resolvedBaseTypes: BaseType[];
  }
  export type BaseType = ObjectType | IntersectionType;
  export interface InterfaceTypeWithDeclaredMembers extends InterfaceType {
    declaredProperties: Symbol[];
    declaredCallSignatures: Signature[];
    declaredConstructSignatures: Signature[];
    declaredStringIndexInfo?: IndexInfo;
    declaredNumberIndexInfo?: IndexInfo;
  }
  /**
   * Type references (ObjectFlags.Reference). When a class or interface has type parameters or
   * a "this" type, references to the class or interface are made using type references. The
   * typeArguments property specifies the types to substitute for the type parameters of the
   * class or interface and optionally includes an extra element that specifies the type to
   * substitute for "this" in the resulting instantiation. When no extra argument is present,
   * the type reference itself is substituted for "this". The typeArguments property is undefined
   * if the class or interface has no type parameters and the reference isn't specifying an
   * explicit "this" argument.
   */
  export interface TypeReference extends ObjectType {
    target: GenericType;
    typeArguments?: ReadonlyArray<Type>;
    literalType?: TypeReference;
  }
  export enum VarianceFlags {
    Invariant = 0,
    Covariant = 1,
    Contravariant = 2,
    Bivariant = 3,
    Independent = 4,
    VarianceMask = 7,
    Unmeasurable = 8,
    Unreliable = 16,
    AllowsStructuralFallback = 24
  }
  export interface GenericType extends InterfaceType, TypeReference {
    instantiations: Map<TypeReference>;
    variances?: VarianceFlags[];
  }
  export interface TupleType extends GenericType {
    minLength: number;
    hasRestElement: boolean;
    readonly: boolean;
    associatedNames?: __String[];
  }
  export interface TupleTypeReference extends TypeReference {
    target: TupleType;
  }
  export interface UnionOrIntersectionType extends Type {
    types: Type[];
    objectFlags: ObjectFlags;
    propertyCache: SymbolTable;
    resolvedProperties: Symbol[];
    resolvedIndexType: IndexType;
    resolvedStringIndexType: IndexType;
    resolvedBaseConstraint: Type;
    couldContainTypeVariables: boolean;
  }
  export interface UnionType extends UnionOrIntersectionType {
    possiblePropertyCache?: SymbolTable;
  }
  export interface IntersectionType extends UnionOrIntersectionType {
    resolvedApparentType: Type;
  }
  export type StructuredType = ObjectType | UnionType | IntersectionType;
  export interface AnonymousType extends ObjectType {
    target?: AnonymousType;
    mapper?: TypeMapper;
  }
  export interface MappedType extends AnonymousType {
    declaration: MappedTypeNode;
    typeParameter?: TypeParameter;
    constraintType?: Type;
    templateType?: Type;
    modifiersType?: Type;
    resolvedApparentType?: Type;
  }
  export interface EvolvingArrayType extends ObjectType {
    elementType: Type;
    finalArrayType?: Type;
  }
  export interface ReverseMappedType extends ObjectType {
    source: Type;
    mappedType: MappedType;
    constraintType: IndexType;
  }
  export interface ResolvedType extends ObjectType, UnionOrIntersectionType {
    members: SymbolTable;
    properties: Symbol[];
    callSignatures: ReadonlyArray<Signature>;
    constructSignatures: ReadonlyArray<Signature>;
  }
  export interface FreshObjectLiteralType extends ResolvedType {
    regularType: ResolvedType;
  }
  export interface IterationTypes {
    readonly yieldType: Type;
    readonly returnType: Type;
    readonly nextType: Type;
  }
  export interface IterableOrIteratorType extends ObjectType, UnionType {
    iterationTypesOfGeneratorReturnType?: IterationTypes;
    iterationTypesOfAsyncGeneratorReturnType?: IterationTypes;
    iterationTypesOfIterable?: IterationTypes;
    iterationTypesOfIterator?: IterationTypes;
    iterationTypesOfAsyncIterable?: IterationTypes;
    iterationTypesOfAsyncIterator?: IterationTypes;
    iterationTypesOfIteratorResult?: IterationTypes;
  }
  export interface PromiseOrAwaitableType extends ObjectType, UnionType {
    promiseTypeOfPromiseConstructor?: Type;
    promisedTypeOfPromise?: Type;
    awaitedTypeOfType?: Type;
  }
  export interface SyntheticDefaultModuleType extends Type {
    syntheticType?: Type;
  }
  export interface InstantiableType extends Type {
    resolvedBaseConstraint?: Type;
    resolvedIndexType?: IndexType;
    resolvedStringIndexType?: IndexType;
  }
  export interface TypeParameter extends InstantiableType {
    /** Retrieve using getConstraintFromTypeParameter */
    constraint?: Type;
    default?: Type;
    target?: TypeParameter;
    mapper?: TypeMapper;
    isThisType?: boolean;
    resolvedDefaultType?: Type;
  }
  export interface IndexedAccessType extends InstantiableType {
    objectType: Type;
    indexType: Type;
    constraint?: Type;
    simplifiedForReading?: Type;
    simplifiedForWriting?: Type;
  }
  export type TypeVariable = TypeParameter | IndexedAccessType;
  export interface IndexType extends InstantiableType {
    type: InstantiableType | UnionOrIntersectionType;
    stringsOnly: boolean;
  }
  export interface ConditionalRoot {
    node: ConditionalTypeNode;
    checkType: Type;
    extendsType: Type;
    trueType: Type;
    falseType: Type;
    isDistributive: boolean;
    inferTypeParameters?: TypeParameter[];
    outerTypeParameters?: TypeParameter[];
    instantiations?: Map<Type>;
    aliasSymbol?: Symbol;
    aliasTypeArguments?: Type[];
  }
  export interface ConditionalType extends InstantiableType {
    root: ConditionalRoot;
    checkType: Type;
    extendsType: Type;
    resolvedTrueType: Type;
    resolvedFalseType: Type;
    resolvedInferredTrueType?: Type;
    resolvedDefaultConstraint?: Type;
    mapper?: TypeMapper;
    combinedMapper?: TypeMapper;
  }
  export interface SubstitutionType extends InstantiableType {
    typeVariable: TypeVariable;
    substitute: Type;
  }
  export enum JsxReferenceKind {
    Component = 0,
    Function = 1,
    Mixed = 2
  }
  export enum SignatureKind {
    Call = 0,
    Construct = 1
  }
  export interface Signature {
    declaration?: SignatureDeclaration | JSDocSignature;
    typeParameters?: ReadonlyArray<TypeParameter>;
    parameters: ReadonlyArray<Symbol>;
    thisParameter?: Symbol;
    resolvedReturnType?: Type;
    resolvedTypePredicate?: TypePredicate;
    minArgumentCount: number;
    hasRestParameter: boolean;
    hasLiteralTypes: boolean;
    target?: Signature;
    mapper?: TypeMapper;
    unionSignatures?: Signature[];
    erasedSignatureCache?: Signature;
    canonicalSignatureCache?: Signature;
    isolatedSignatureType?: ObjectType;
    instantiations?: Map<Signature>;
  }
  export enum IndexKind {
    String = 0,
    Number = 1
  }
  export interface IndexInfo {
    type: Type;
    isReadonly: boolean;
    declaration?: IndexSignatureDeclaration;
  }
  export type TypeMapper = (t: TypeParameter) => Type;
  export enum InferencePriority {
    NakedTypeVariable = 1,
    HomomorphicMappedType = 2,
    PartialHomomorphicMappedType = 4,
    MappedTypeConstraint = 8,
    ReturnType = 16,
    LiteralKeyof = 32,
    NoConstraints = 64,
    AlwaysStrict = 128,
    MaxValue = 256,
    PriorityImpliesCombination = 56,
    Circularity = -1
  }
  export interface InferenceInfo {
    typeParameter: TypeParameter;
    candidates: Type[] | undefined;
    contraCandidates: Type[] | undefined;
    inferredType?: Type;
    priority?: InferencePriority;
    topLevel: boolean;
    isFixed: boolean;
  }
  export enum InferenceFlags {
    None = 0,
    NoDefault = 1,
    AnyDefault = 2,
    SkippedGenericFunction = 4
  }
  /**
   * Ternary values are defined such that
   * x & y is False if either x or y is False.
   * x & y is Maybe if either x or y is Maybe, but neither x or y is False.
   * x & y is True if both x and y are True.
   * x | y is False if both x and y are False.
   * x | y is Maybe if either x or y is Maybe, but neither x or y is True.
   * x | y is True if either x or y is True.
   */
  export enum Ternary {
    False = 0,
    Maybe = 1,
    True = -1
  }
  export type TypeComparer = (s: Type, t: Type, reportErrors?: boolean) => Ternary;
  export interface InferenceContext {
    inferences: InferenceInfo[];
    signature?: Signature;
    flags: InferenceFlags;
    compareTypes: TypeComparer;
    mapper: TypeMapper;
    nonFixingMapper: TypeMapper;
    returnMapper?: TypeMapper;
    inferredTypeParameters?: ReadonlyArray<TypeParameter>;
  }
  export interface WideningContext {
    parent?: WideningContext;
    propertyName?: __String;
    siblings?: Type[];
    resolvedProperties?: Symbol[];
  }
  export enum AssignmentDeclarationKind {
    None = 0,
    ExportsProperty = 1,
    ModuleExports = 2,
    PrototypeProperty = 3,
    ThisProperty = 4,
    Property = 5,
    Prototype = 6,
    ObjectDefinePropertyValue = 7,
    ObjectDefinePropertyExports = 8,
    ObjectDefinePrototypeProperty = 9
  }
  /** @deprecated Use FileExtensionInfo instead. */
  export type JsFileExtensionInfo = FileExtensionInfo;
  export interface FileExtensionInfo {
    extension: string;
    isMixedContent: boolean;
    scriptKind?: ScriptKind;
  }
  export interface DiagnosticMessage {
    key: string;
    category: DiagnosticCategory;
    code: number;
    message: string;
    reportsUnnecessary?: {};
  }
  /**
   * A linked list of formatted diagnostic messages to be used as part of a multiline message.
   * It is built from the bottom up, leaving the head to be the "main" diagnostic.
   * While it seems that DiagnosticMessageChain is structurally similar to DiagnosticMessage,
   * the difference is that messages are all preformatted in DMC.
   */
  export interface DiagnosticMessageChain {
    messageText: string;
    category: DiagnosticCategory;
    code: number;
    next?: DiagnosticMessageChain[];
  }
  export interface Diagnostic extends DiagnosticRelatedInformation {
    /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
    reportsUnnecessary?: {};
    source?: string;
    relatedInformation?: DiagnosticRelatedInformation[];
  }
  export interface DiagnosticRelatedInformation {
    category: DiagnosticCategory;
    code: number;
    file: SourceFile | undefined;
    start: number | undefined;
    length: number | undefined;
    messageText: string | DiagnosticMessageChain;
  }
  export interface DiagnosticWithLocation extends Diagnostic {
    file: SourceFile;
    start: number;
    length: number;
  }
  export enum DiagnosticCategory {
    Warning = 0,
    Error = 1,
    Suggestion = 2,
    Message = 3
  }
  export function diagnosticCategoryName(d: {
    category: DiagnosticCategory;
  }, lowerCase?: boolean): string;
  export enum ModuleResolutionKind {
    Classic = 1,
    NodeJs = 2
  }
  export interface PluginImport {
    name: string;
  }
  export interface ProjectReference {
    /** A normalized path on disk */
    path: string;
    /** The path as the user originally wrote it */
    originalPath?: string;
    /** True if the output of this reference should be prepended to the output of this project. Only valid for --outFile compilations */
    prepend?: boolean;
    /** True if it is intended that this reference form a circularity */
    circular?: boolean;
  }
  export type CompilerOptionsValue = string | number | boolean | (string | number)[] | string[] | MapLike<string[]> | PluginImport[] | ProjectReference[] | null | undefined;
  export interface CompilerOptions {
    all?: boolean;
    allowJs?: boolean;
    allowNonTsExtensions?: boolean;
    allowSyntheticDefaultImports?: boolean;
    allowUmdGlobalAccess?: boolean;
    allowUnreachableCode?: boolean;
    allowUnusedLabels?: boolean;
    alwaysStrict?: boolean;
    baseUrl?: string;
    /** An error if set - this should only go through the -b pipeline and not actually be observed */
    build?: boolean;
    charset?: string;
    checkJs?: boolean;
    configFilePath?: string;
    /** configFile is set as non enumerable property so as to avoid checking of json source files */
    readonly configFile?: TsConfigSourceFile;
    declaration?: boolean;
    declarationMap?: boolean;
    emitDeclarationOnly?: boolean;
    declarationDir?: string;
    diagnostics?: boolean;
    extendedDiagnostics?: boolean;
    disableSizeLimit?: boolean;
    downlevelIteration?: boolean;
    emitBOM?: boolean;
    emitDecoratorMetadata?: boolean;
    experimentalDecorators?: boolean;
    forceConsistentCasingInFileNames?: boolean;
    help?: boolean;
    importHelpers?: boolean;
    init?: boolean;
    inlineSourceMap?: boolean;
    inlineSources?: boolean;
    isolatedModules?: boolean;
    jsx?: JsxEmit;
    keyofStringsOnly?: boolean;
    lib?: string[];
    listEmittedFiles?: boolean;
    listFiles?: boolean;
    locale?: string;
    mapRoot?: string;
    maxNodeModuleJsDepth?: number;
    module?: ModuleKind;
    moduleResolution?: ModuleResolutionKind;
    newLine?: NewLineKind;
    noEmit?: boolean;
    noEmitForJsFiles?: boolean;
    noEmitHelpers?: boolean;
    noEmitOnError?: boolean;
    noErrorTruncation?: boolean;
    noFallthroughCasesInSwitch?: boolean;
    noImplicitAny?: boolean;
    noImplicitReturns?: boolean;
    noImplicitThis?: boolean;
    noStrictGenericChecks?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noImplicitUseStrict?: boolean;
    noLib?: boolean;
    noResolve?: boolean;
    out?: string;
    outDir?: string;
    outFile?: string;
    paths?: MapLike<string[]>;
    plugins?: PluginImport[];
    preserveConstEnums?: boolean;
    preserveSymlinks?: boolean;
    preserveWatchOutput?: boolean;
    project?: string;
    pretty?: boolean;
    reactNamespace?: string;
    jsxFactory?: string;
    composite?: boolean;
    incremental?: boolean;
    tsBuildInfoFile?: string;
    removeComments?: boolean;
    rootDir?: string;
    rootDirs?: string[];
    skipLibCheck?: boolean;
    skipDefaultLibCheck?: boolean;
    sourceMap?: boolean;
    sourceRoot?: string;
    strict?: boolean;
    strictFunctionTypes?: boolean;
    strictBindCallApply?: boolean;
    strictNullChecks?: boolean;
    strictPropertyInitialization?: boolean;
    stripInternal?: boolean;
    suppressExcessPropertyErrors?: boolean;
    suppressImplicitAnyIndexErrors?: boolean;
    suppressOutputPathCheck?: boolean;
    target?: ScriptTarget;
    traceResolution?: boolean;
    resolveJsonModule?: boolean;
    types?: string[];
    /** Paths used to compute primary types search locations */
    typeRoots?: string[];
    version?: boolean;
    watch?: boolean;
    esModuleInterop?: boolean;
    showConfig?: boolean;
    [option: string]: CompilerOptionsValue | TsConfigSourceFile | undefined;
  }
  export interface TypeAcquisition {
    enableAutoDiscovery?: boolean;
    enable?: boolean;
    include?: string[];
    exclude?: string[];
    [option: string]: string[] | boolean | undefined;
  }
  export enum ModuleKind {
    None = 0,
    CommonJS = 1,
    AMD = 2,
    UMD = 3,
    System = 4,
    ES2015 = 5,
    ESNext = 99
  }
  export enum JsxEmit {
    None = 0,
    Preserve = 1,
    React = 2,
    ReactNative = 3
  }
  export enum NewLineKind {
    CarriageReturnLineFeed = 0,
    LineFeed = 1
  }
  export interface LineAndCharacter {
    /** 0-based. */
    line: number;
    character: number;
  }
  export enum ScriptKind {
    Unknown = 0,
    JS = 1,
    JSX = 2,
    TS = 3,
    TSX = 4,
    External = 5,
    JSON = 6,
    /**
     * Used on extensions that doesn't define the ScriptKind but the content defines it.
     * Deferred extensions are going to be included in all project contexts.
     */
    Deferred = 7
  }
  export enum ScriptTarget {
    ES3 = 0,
    ES5 = 1,
    ES2015 = 2,
    ES2016 = 3,
    ES2017 = 4,
    ES2018 = 5,
    ES2019 = 6,
    ES2020 = 7,
    ESNext = 99,
    JSON = 100,
    Latest = 99
  }
  export enum LanguageVariant {
    Standard = 0,
    JSX = 1
  }
  /** Either a parsed command line or a parsed tsconfig.json */
  export interface ParsedCommandLine {
    options: CompilerOptions;
    typeAcquisition?: TypeAcquisition;
    fileNames: string[];
    projectReferences?: ReadonlyArray<ProjectReference>;
    raw?: any;
    errors: Diagnostic[];
    wildcardDirectories?: MapLike<WatchDirectoryFlags>;
    compileOnSave?: boolean;
    configFileSpecs?: ConfigFileSpecs;
  }
  export enum WatchDirectoryFlags {
    None = 0,
    Recursive = 1
  }
  export interface ConfigFileSpecs {
    filesSpecs: ReadonlyArray<string> | undefined;
    /**
     * Present to report errors (user specified specs), validatedIncludeSpecs are used for file name matching
     */
    includeSpecs?: ReadonlyArray<string>;
    /**
     * Present to report errors (user specified specs), validatedExcludeSpecs are used for file name matching
     */
    excludeSpecs?: ReadonlyArray<string>;
    validatedIncludeSpecs?: ReadonlyArray<string>;
    validatedExcludeSpecs?: ReadonlyArray<string>;
    wildcardDirectories: MapLike<WatchDirectoryFlags>;
  }
  export interface ExpandResult {
    fileNames: string[];
    wildcardDirectories: MapLike<WatchDirectoryFlags>;
    spec: ConfigFileSpecs;
  }
  export interface CreateProgramOptions {
    rootNames: ReadonlyArray<string>;
    options: CompilerOptions;
    projectReferences?: ReadonlyArray<ProjectReference>;
    host?: CompilerHost;
    oldProgram?: Program;
    configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>;
  }
  export interface CommandLineOptionBase {
    name: string;
    type: "string" | "number" | "boolean" | "object" | "list" | Map<number | string>;
    isFilePath?: boolean;
    shortName?: string;
    description?: DiagnosticMessage;
    paramType?: DiagnosticMessage;
    isTSConfigOnly?: boolean;
    isCommandLineOnly?: boolean;
    showInSimplifiedHelpView?: boolean;
    category?: DiagnosticMessage;
    strictFlag?: true;
    affectsSourceFile?: true;
    affectsModuleResolution?: true;
    affectsBindDiagnostics?: true;
    affectsSemanticDiagnostics?: true;
    affectsEmit?: true;
  }
  export interface CommandLineOptionOfPrimitiveType extends CommandLineOptionBase {
    type: "string" | "number" | "boolean";
  }
  export interface CommandLineOptionOfCustomType extends CommandLineOptionBase {
    type: Map<number | string>;
  }
  export interface TsConfigOnlyOption extends CommandLineOptionBase {
    type: "object";
    elementOptions?: Map<CommandLineOption>;
    extraKeyDiagnosticMessage?: DiagnosticMessage;
  }
  export interface CommandLineOptionOfListType extends CommandLineOptionBase {
    type: "list";
    element: CommandLineOptionOfCustomType | CommandLineOptionOfPrimitiveType | TsConfigOnlyOption;
  }
  export type CommandLineOption = CommandLineOptionOfCustomType | CommandLineOptionOfPrimitiveType | TsConfigOnlyOption | CommandLineOptionOfListType;
  export enum CharacterCodes {
    nullCharacter = 0,
    maxAsciiCharacter = 127,
    lineFeed = 10,
    carriageReturn = 13,
    lineSeparator = 8232,
    paragraphSeparator = 8233,
    nextLine = 133,
    space = 32,
    nonBreakingSpace = 160,
    enQuad = 8192,
    emQuad = 8193,
    enSpace = 8194,
    emSpace = 8195,
    threePerEmSpace = 8196,
    fourPerEmSpace = 8197,
    sixPerEmSpace = 8198,
    figureSpace = 8199,
    punctuationSpace = 8200,
    thinSpace = 8201,
    hairSpace = 8202,
    zeroWidthSpace = 8203,
    narrowNoBreakSpace = 8239,
    ideographicSpace = 12288,
    mathematicalSpace = 8287,
    ogham = 5760,
    _ = 95,
    $ = 36,
    _0 = 48,
    _1 = 49,
    _2 = 50,
    _3 = 51,
    _4 = 52,
    _5 = 53,
    _6 = 54,
    _7 = 55,
    _8 = 56,
    _9 = 57,
    a = 97,
    b = 98,
    c = 99,
    d = 100,
    e = 101,
    f = 102,
    g = 103,
    h = 104,
    i = 105,
    j = 106,
    k = 107,
    l = 108,
    m = 109,
    n = 110,
    o = 111,
    p = 112,
    q = 113,
    r = 114,
    s = 115,
    t = 116,
    u = 117,
    v = 118,
    w = 119,
    x = 120,
    y = 121,
    z = 122,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    ampersand = 38,
    asterisk = 42,
    at = 64,
    backslash = 92,
    backtick = 96,
    bar = 124,
    caret = 94,
    closeBrace = 125,
    closeBracket = 93,
    closeParen = 41,
    colon = 58,
    comma = 44,
    dot = 46,
    doubleQuote = 34,
    equals = 61,
    exclamation = 33,
    greaterThan = 62,
    hash = 35,
    lessThan = 60,
    minus = 45,
    openBrace = 123,
    openBracket = 91,
    openParen = 40,
    percent = 37,
    plus = 43,
    question = 63,
    semicolon = 59,
    singleQuote = 39,
    slash = 47,
    tilde = 126,
    backspace = 8,
    formFeed = 12,
    byteOrderMark = 65279,
    tab = 9,
    verticalTab = 11
  }
  export interface ModuleResolutionHost {
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string | undefined;
    trace?(s: string): void;
    directoryExists?(directoryName: string): boolean;
    /**
     * Resolve a symbolic link.
     * @see https://nodejs.org/api/fs.html#fs_fs_realpathsync_path_options
     */
    realpath?(path: string): string;
    getCurrentDirectory?(): string;
    getDirectories?(path: string): string[];
  }
  /**
   * Represents the result of module resolution.
   * Module resolution will pick up tsx/jsx/js files even if '--jsx' and '--allowJs' are turned off.
   * The Program will then filter results based on these flags.
   *
   * Prefer to return a `ResolvedModuleFull` so that the file type does not have to be inferred.
   */
  export interface ResolvedModule {
    /** Path of the file the module was resolved to. */
    resolvedFileName: string;
    /** True if `resolvedFileName` comes from `node_modules`. */
    isExternalLibraryImport?: boolean;
  }
  /**
   * ResolvedModule with an explicitly provided `extension` property.
   * Prefer this over `ResolvedModule`.
   * If changing this, remember to change `moduleResolutionIsEqualTo`.
   */
  export interface ResolvedModuleFull extends ResolvedModule {
    readonly originalPath?: string;
    /**
     * Extension of resolvedFileName. This must match what's at the end of resolvedFileName.
     * This is optional for backwards-compatibility, but will be added if not provided.
     */
    extension: Extension;
    packageId?: PackageId;
  }
  /**
   * Unique identifier with a package name and version.
   * If changing this, remember to change `packageIdIsEqual`.
   */
  export interface PackageId {
    /**
     * Name of the package.
     * Should not include `@types`.
     * If accessing a non-index file, this should include its name e.g. "foo/bar".
     */
    name: string;
    /**
     * Name of a submodule within this package.
     * May be "".
     */
    subModuleName: string;
    /** Version of the package, e.g. "1.2.3" */
    version: string;
  }
  export enum Extension {
    Ts = ".ts",
    Tsx = ".tsx",
    Dts = ".d.ts",
    Js = ".js",
    Jsx = ".jsx",
    Json = ".json",
    TsBuildInfo = ".tsbuildinfo"
  }
  export interface ResolvedModuleWithFailedLookupLocations {
    readonly resolvedModule: ResolvedModuleFull | undefined;
    readonly failedLookupLocations: ReadonlyArray<string>;
  }
  export interface ResolvedTypeReferenceDirective {
    primary: boolean;
    resolvedFileName: string | undefined;
    packageId?: PackageId;
    /** True if `resolvedFileName` comes from `node_modules`. */
    isExternalLibraryImport?: boolean;
  }
  export interface ResolvedTypeReferenceDirectiveWithFailedLookupLocations {
    readonly resolvedTypeReferenceDirective: ResolvedTypeReferenceDirective | undefined;
    readonly failedLookupLocations: ReadonlyArray<string>;
  }
  export type HasInvalidatedResolution = (sourceFile: Path) => boolean;
  export interface CompilerHost extends ModuleResolutionHost {
    getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): SourceFile | undefined;
    getSourceFileByPath?(fileName: string, path: Path, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): SourceFile | undefined;
    getCancellationToken?(): CancellationToken;
    getDefaultLibFileName(options: CompilerOptions): string;
    getDefaultLibLocation?(): string;
    writeFile: WriteFileCallback;
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    readDirectory?(rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): string[];
    resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
    /**
     * This method is a companion for 'resolveModuleNames' and is used to resolve 'types' references to actual type declaration files
     */
    resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
    getEnvironmentVariable?(name: string): string | undefined;
    onReleaseOldSourceFile?(oldSourceFile: SourceFile, oldOptions: CompilerOptions, hasSourceFileByPath: boolean): void;
    hasInvalidatedResolution?: HasInvalidatedResolution;
    hasChangedAutomaticTypeDirectiveNames?: boolean;
    createHash?(data: string): string;
    getParsedCommandLine?(fileName: string): ParsedCommandLine | undefined;
    createDirectory?(directory: string): void;
  }
  export enum TransformFlags {
    None = 0,
    ContainsTypeScript = 1,
    ContainsJsx = 2,
    ContainsESNext = 4,
    ContainsES2019 = 8,
    ContainsES2018 = 16,
    ContainsES2017 = 32,
    ContainsES2016 = 64,
    ContainsES2015 = 128,
    ContainsGenerator = 256,
    ContainsDestructuringAssignment = 512,
    ContainsTypeScriptClassSyntax = 1024,
    ContainsLexicalThis = 2048,
    ContainsRestOrSpread = 4096,
    ContainsObjectRestOrSpread = 8192,
    ContainsComputedPropertyName = 16384,
    ContainsBlockScopedBinding = 32768,
    ContainsBindingPattern = 65536,
    ContainsYield = 131072,
    ContainsHoistedDeclarationOrCompletion = 262144,
    ContainsDynamicImport = 524288,
    ContainsClassFields = 1048576,
    HasComputedFlags = 536870912,
    AssertTypeScript = 1,
    AssertJsx = 2,
    AssertESNext = 4,
    AssertES2019 = 8,
    AssertES2018 = 16,
    AssertES2017 = 32,
    AssertES2016 = 64,
    AssertES2015 = 128,
    AssertGenerator = 256,
    AssertDestructuringAssignment = 512,
    OuterExpressionExcludes = 536870912,
    PropertyAccessExcludes = 536870912,
    NodeExcludes = 536870912,
    ArrowFunctionExcludes = 537371648,
    FunctionExcludes = 537373696,
    ConstructorExcludes = 537372672,
    MethodOrAccessorExcludes = 537372672,
    PropertyExcludes = 536872960,
    ClassExcludes = 536888320,
    ModuleExcludes = 537168896,
    TypeExcludes = -2,
    ObjectLiteralExcludes = 536896512,
    ArrayLiteralOrCallOrNewExcludes = 536875008,
    VariableDeclarationListExcludes = 536944640,
    ParameterExcludes = 536870912,
    CatchClauseExcludes = 536879104,
    BindingPatternExcludes = 536875008,
    PropertyNamePropagatingFlags = 2048
  }
  export interface SourceMapRange extends TextRange {
    source?: SourceMapSource;
  }
  export interface SourceMapSource {
    fileName: string;
    text: string;
    lineMap: ReadonlyArray<number>;
    skipTrivia?: (pos: number) => number;
  }
  export interface EmitNode {
    annotatedNodes?: Node[];
    flags: EmitFlags;
    leadingComments?: SynthesizedComment[];
    trailingComments?: SynthesizedComment[];
    commentRange?: TextRange;
    sourceMapRange?: SourceMapRange;
    tokenSourceMapRanges?: (SourceMapRange | undefined)[];
    constantValue?: string | number;
    externalHelpersModuleName?: Identifier;
    externalHelpers?: boolean;
    helpers?: EmitHelper[];
    startsOnNewLine?: boolean;
  }
  export enum EmitFlags {
    None = 0,
    SingleLine = 1,
    AdviseOnEmitNode = 2,
    NoSubstitution = 4,
    CapturesThis = 8,
    NoLeadingSourceMap = 16,
    NoTrailingSourceMap = 32,
    NoSourceMap = 48,
    NoNestedSourceMaps = 64,
    NoTokenLeadingSourceMaps = 128,
    NoTokenTrailingSourceMaps = 256,
    NoTokenSourceMaps = 384,
    NoLeadingComments = 512,
    NoTrailingComments = 1024,
    NoComments = 1536,
    NoNestedComments = 2048,
    HelperName = 4096,
    ExportName = 8192,
    LocalName = 16384,
    InternalName = 32768,
    Indented = 65536,
    NoIndentation = 131072,
    AsyncFunctionBody = 262144,
    ReuseTempVariableScope = 524288,
    CustomPrologue = 1048576,
    NoHoisting = 2097152,
    HasEndOfDeclarationMarker = 4194304,
    Iterator = 8388608,
    NoAsciiEscaping = 16777216,
    TypeScriptClassWrapper = 33554432,
    NeverApplyImportHelper = 67108864
  }
  export interface EmitHelper {
    readonly name: string;
    readonly scoped: boolean;
    readonly text: string | ((node: EmitHelperUniqueNameCallback) => string);
    readonly priority?: number;
  }
  export interface UnscopedEmitHelper extends EmitHelper {
    readonly scoped: false;
    readonly importName?: string;
    readonly text: string;
  }
  export type UniqueNameHandler = (baseName: string, checkFn?: (name: string) => boolean, optimistic?: boolean) => string;
  export type EmitHelperUniqueNameCallback = (name: string) => string;
  /**
   * Used by the checker, this enum keeps track of external emit helpers that should be type
   * checked.
   */
  export enum ExternalEmitHelpers {
    Extends = 1,
    Assign = 2,
    Rest = 4,
    Decorate = 8,
    Metadata = 16,
    Param = 32,
    Awaiter = 64,
    Generator = 128,
    Values = 256,
    Read = 512,
    Spread = 1024,
    SpreadArrays = 2048,
    Await = 4096,
    AsyncGenerator = 8192,
    AsyncDelegator = 16384,
    AsyncValues = 32768,
    ExportStar = 65536,
    MakeTemplateObject = 131072,
    FirstEmitHelper = 1,
    LastEmitHelper = 131072,
    ForOfIncludes = 256,
    ForAwaitOfIncludes = 32768,
    AsyncGeneratorIncludes = 12288,
    AsyncDelegatorIncludes = 53248,
    SpreadIncludes = 1536
  }
  export enum EmitHint {
    SourceFile = 0,
    Expression = 1,
    IdentifierName = 2,
    MappedTypeParameter = 3,
    Unspecified = 4,
    EmbeddedStatement = 5
  }
  export interface EmitHost extends ScriptReferenceHost, ModuleSpecifierResolutionHost {
    getSourceFiles(): ReadonlyArray<SourceFile>;
    useCaseSensitiveFileNames(): boolean;
    getCurrentDirectory(): string;
    isSourceFileFromExternalLibrary(file: SourceFile): boolean;
    getResolvedProjectReferenceToRedirect(fileName: string): ResolvedProjectReference | undefined;
    getLibFileFromReference(ref: FileReference): SourceFile | undefined;
    getCommonSourceDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    getNewLine(): string;
    isEmitBlocked(emitFileName: string): boolean;
    getPrependNodes(): ReadonlyArray<InputFiles | UnparsedSource>;
    writeFile: WriteFileCallback;
    getProgramBuildInfo(): ProgramBuildInfo | undefined;
    getSourceFileFromReference: Program["getSourceFileFromReference"];
    readonly redirectTargetsMap: RedirectTargetsMap;
  }
  export interface TransformationContext {
    getEmitResolver(): EmitResolver;
    getEmitHost(): EmitHost;
    /** Gets the compiler options supplied to the transformer. */
    getCompilerOptions(): CompilerOptions;
    /** Starts a new lexical environment. */
    startLexicalEnvironment(): void;
    /** Suspends the current lexical environment, usually after visiting a parameter list. */
    suspendLexicalEnvironment(): void;
    /** Resumes a suspended lexical environment, usually before visiting a function body. */
    resumeLexicalEnvironment(): void;
    /** Ends a lexical environment, returning any declarations. */
    endLexicalEnvironment(): Statement[] | undefined;
    /** Hoists a function declaration to the containing scope. */
    hoistFunctionDeclaration(node: FunctionDeclaration): void;
    /** Hoists a variable declaration to the containing scope. */
    hoistVariableDeclaration(node: Identifier): void;
    /** Records a request for a non-scoped emit helper in the current context. */
    requestEmitHelper(helper: EmitHelper): void;
    /** Gets and resets the requested non-scoped emit helpers. */
    readEmitHelpers(): EmitHelper[] | undefined;
    /** Enables expression substitutions in the pretty printer for the provided SyntaxKind. */
    enableSubstitution(kind: SyntaxKind): void;
    /** Determines whether expression substitutions are enabled for the provided node. */
    isSubstitutionEnabled(node: Node): boolean;
    /**
     * Hook used by transformers to substitute expressions just before they
     * are emitted by the pretty printer.
     *
     * NOTE: Transformation hooks should only be modified during `Transformer` initialization,
     * before returning the `NodeTransformer` callback.
     */
    onSubstituteNode: (hint: EmitHint, node: Node) => Node;
    /**
     * Enables before/after emit notifications in the pretty printer for the provided
     * SyntaxKind.
     */
    enableEmitNotification(kind: SyntaxKind): void;
    /**
     * Determines whether before/after emit notifications should be raised in the pretty
     * printer when it emits a node.
     */
    isEmitNotificationEnabled(node: Node): boolean;
    /**
     * Hook used to allow transformers to capture state before or after
     * the printer emits a node.
     *
     * NOTE: Transformation hooks should only be modified during `Transformer` initialization,
     * before returning the `NodeTransformer` callback.
     */
    onEmitNode: (hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void) => void;
    addDiagnostic(diag: DiagnosticWithLocation): void;
  }
  export interface TransformationResult<T extends Node> {
    /** Gets the transformed source files. */
    transformed: T[];
    /** Gets diagnostics for the transformation. */
    diagnostics?: DiagnosticWithLocation[];
    /**
     * Gets a substitute for a node, if one is available; otherwise, returns the original node.
     *
     * @param hint A hint as to the intended usage of the node.
     * @param node The node to substitute.
     */
    substituteNode(hint: EmitHint, node: Node): Node;
    /**
     * Emits a node with possible notification.
     *
     * @param hint A hint as to the intended usage of the node.
     * @param node The node to emit.
     * @param emitCallback A callback used to emit the node.
     */
    emitNodeWithNotification(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
    /**
     * Clean up EmitNode entries on any parse-tree nodes.
     */
    dispose(): void;
  }
  /**
   * A function that is used to initialize and return a `Transformer` callback, which in turn
   * will be used to transform one or more nodes.
   */
  export type TransformerFactory<T extends Node> = (context: TransformationContext) => Transformer<T>;
  /**
   * A function that transforms a node.
   */
  export type Transformer<T extends Node> = (node: T) => T;
  /**
   * A function that accepts and possibly transforms a node.
   */
  export type Visitor = (node: Node) => VisitResult<Node>;
  export type VisitResult<T extends Node> = T | T[] | undefined;
  export interface Printer {
    /**
     * Print a node and its subtree as-is, without any emit transformations.
     * @param hint A value indicating the purpose of a node. This is primarily used to
     * distinguish between an `Identifier` used in an expression position, versus an
     * `Identifier` used as an `IdentifierName` as part of a declaration. For most nodes you
     * should just pass `Unspecified`.
     * @param node The node to print. The node and its subtree are printed as-is, without any
     * emit transformations.
     * @param sourceFile A source file that provides context for the node. The source text of
     * the file is used to emit the original source content for literals and identifiers, while
     * the identifiers of the source file are used when generating unique names to avoid
     * collisions.
     */
    printNode(hint: EmitHint, node: Node, sourceFile: SourceFile): string;
    /**
     * Prints a list of nodes using the given format flags
     */
    printList<T extends Node>(format: ListFormat, list: NodeArray<T>, sourceFile: SourceFile): string;
    /**
     * Prints a source file as-is, without any emit transformations.
     */
    printFile(sourceFile: SourceFile): string;
    /**
     * Prints a bundle of source files as-is, without any emit transformations.
     */
    printBundle(bundle: Bundle): string;
    writeNode(hint: EmitHint, node: Node, sourceFile: SourceFile | undefined, writer: EmitTextWriter): void;
    writeList<T extends Node>(format: ListFormat, list: NodeArray<T> | undefined, sourceFile: SourceFile | undefined, writer: EmitTextWriter): void;
    writeFile(sourceFile: SourceFile, writer: EmitTextWriter, sourceMapGenerator: SourceMapGenerator | undefined): void;
    writeBundle(bundle: Bundle, writer: EmitTextWriter, sourceMapGenerator: SourceMapGenerator | undefined): void;
    bundleFileInfo?: BundleFileInfo;
  }
  export enum BundleFileSectionKind {
    Prologue = "prologue",
    EmitHelpers = "emitHelpers",
    NoDefaultLib = "no-default-lib",
    Reference = "reference",
    Type = "type",
    Lib = "lib",
    Prepend = "prepend",
    Text = "text",
    Internal = "internal"
  }
  export interface BundleFileSectionBase extends TextRange {
    kind: BundleFileSectionKind;
    data?: string;
  }
  export interface BundleFilePrologue extends BundleFileSectionBase {
    kind: BundleFileSectionKind.Prologue;
    data: string;
  }
  export interface BundleFileEmitHelpers extends BundleFileSectionBase {
    kind: BundleFileSectionKind.EmitHelpers;
    data: string;
  }
  export interface BundleFileHasNoDefaultLib extends BundleFileSectionBase {
    kind: BundleFileSectionKind.NoDefaultLib;
  }
  export interface BundleFileReference extends BundleFileSectionBase {
    kind: BundleFileSectionKind.Reference | BundleFileSectionKind.Type | BundleFileSectionKind.Lib;
    data: string;
  }
  export interface BundleFilePrepend extends BundleFileSectionBase {
    kind: BundleFileSectionKind.Prepend;
    data: string;
    texts: BundleFileTextLike[];
  }
  export type BundleFileTextLikeKind = BundleFileSectionKind.Text | BundleFileSectionKind.Internal;
  export interface BundleFileTextLike extends BundleFileSectionBase {
    kind: BundleFileTextLikeKind;
  }
  export type BundleFileSection = BundleFilePrologue | BundleFileEmitHelpers | BundleFileHasNoDefaultLib | BundleFileReference | BundleFilePrepend | BundleFileTextLike;
  export interface SourceFilePrologueDirectiveExpression extends TextRange {
    text: string;
  }
  export interface SourceFilePrologueDirective extends TextRange {
    expression: SourceFilePrologueDirectiveExpression;
  }
  export interface SourceFilePrologueInfo {
    file: number;
    text: string;
    directives: SourceFilePrologueDirective[];
  }
  export interface SourceFileInfo {
    helpers?: string[];
    prologues?: SourceFilePrologueInfo[];
  }
  export interface BundleFileInfo {
    sections: BundleFileSection[];
    sources?: SourceFileInfo;
  }
  export interface BundleBuildInfo {
    js?: BundleFileInfo;
    dts?: BundleFileInfo;
    commonSourceDirectory: string;
    sourceFiles: ReadonlyArray<string>;
  }
  export interface BuildInfo {
    bundle?: BundleBuildInfo;
    program?: ProgramBuildInfo;
    version: string;
  }
  export interface PrintHandlers {
    /**
     * A hook used by the Printer when generating unique names to avoid collisions with
     * globally defined names that exist outside of the current source file.
     */
    hasGlobalName?(name: string): boolean;
    /**
     * A hook used by the Printer to provide notifications prior to emitting a node. A
     * compatible implementation **must** invoke `emitCallback` with the provided `hint` and
     * `node` values.
     * @param hint A hint indicating the intended purpose of the node.
     * @param node The node to emit.
     * @param emitCallback A callback that, when invoked, will emit the node.
     * @example
     * ```ts
     * var printer = createPrinter(printerOptions, {
     *   onEmitNode(hint, node, emitCallback) {
     *     // set up or track state prior to emitting the node...
     *     emitCallback(hint, node);
     *     // restore state after emitting the node...
     *   }
     * });
     * ```
     */
    onEmitNode?(hint: EmitHint, node: Node | undefined, emitCallback: (hint: EmitHint, node: Node | undefined) => void): void;
    /**
     * A hook used by the Printer to perform just-in-time substitution of a node. This is
     * primarily used by node transformations that need to substitute one node for another,
     * such as replacing `myExportedVar` with `exports.myExportedVar`.
     * @param hint A hint indicating the intended purpose of the node.
     * @param node The node to emit.
     * @example
     * ```ts
     * var printer = createPrinter(printerOptions, {
     *   substituteNode(hint, node) {
     *     // perform substitution if necessary...
     *     return node;
     *   }
     * });
     * ```
     */
    substituteNode?(hint: EmitHint, node: Node): Node;
    onEmitSourceMapOfNode?: (hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void) => void;
    onEmitSourceMapOfToken?: (node: Node | undefined, token: SyntaxKind, writer: (s: string) => void, pos: number, emitCallback: (token: SyntaxKind, writer: (s: string) => void, pos: number) => number) => number;
    onEmitSourceMapOfPosition?: (pos: number) => void;
    onSetSourceFile?: (node: SourceFile) => void;
    onBeforeEmitNodeArray?: (nodes: NodeArray<any> | undefined) => void;
    onAfterEmitNodeArray?: (nodes: NodeArray<any> | undefined) => void;
    onBeforeEmitToken?: (node: Node) => void;
    onAfterEmitToken?: (node: Node) => void;
  }
  export interface PrinterOptions {
    removeComments?: boolean;
    newLine?: NewLineKind;
    omitTrailingSemicolon?: boolean;
    noEmitHelpers?: boolean;
    module?: CompilerOptions["module"];
    target?: CompilerOptions["target"];
    sourceMap?: boolean;
    inlineSourceMap?: boolean;
    inlineSources?: boolean;
    extendedDiagnostics?: boolean;
    onlyPrintJsDocStyle?: boolean;
    neverAsciiEscape?: boolean;
    writeBundleFileInfo?: boolean;
    recordInternalSection?: boolean;
    stripInternal?: boolean;
    relativeToBuildInfo?: (path: string) => string;
  }
  export interface RawSourceMap {
    version: 3;
    file: string;
    sourceRoot?: string | null;
    sources: string[];
    sourcesContent?: (string | null)[] | null;
    mappings: string;
    names?: string[] | null;
  }
  /**
   * Generates a source map.
   */
  export interface SourceMapGenerator {
    getSources(): ReadonlyArray<string>;
    /**
     * Adds a source to the source map.
     */
    addSource(fileName: string): number;
    /**
     * Set the content for a source.
     */
    setSourceContent(sourceIndex: number, content: string | null): void;
    /**
     * Adds a name.
     */
    addName(name: string): number;
    /**
     * Adds a mapping without source information.
     */
    addMapping(generatedLine: number, generatedCharacter: number): void;
    /**
     * Adds a mapping with source information.
     */
    addMapping(generatedLine: number, generatedCharacter: number, sourceIndex: number, sourceLine: number, sourceCharacter: number, nameIndex?: number): void;
    /**
     * Appends a source map.
     */
    appendSourceMap(generatedLine: number, generatedCharacter: number, sourceMap: RawSourceMap, sourceMapPath: string, start?: LineAndCharacter, end?: LineAndCharacter): void;
    /**
     * Gets the source map as a `RawSourceMap` object.
     */
    toJSON(): RawSourceMap;
    /**
     * Gets the string representation of the source map.
     */
    toString(): string;
  }
  export interface DocumentPositionMapperHost {
    getSourceFileLike(fileName: string): SourceFileLike | undefined;
    getCanonicalFileName(path: string): string;
    log(text: string): void;
  }
  /**
   * Maps positions between source and generated files.
   */
  export interface DocumentPositionMapper {
    getSourcePosition(input: DocumentPosition): DocumentPosition;
    getGeneratedPosition(input: DocumentPosition): DocumentPosition;
  }
  export interface DocumentPosition {
    fileName: string;
    pos: number;
  }
  export interface EmitTextWriter extends SymbolWriter {
    write(s: string): void;
    writeTrailingSemicolon(text: string): void;
    writeComment(text: string): void;
    getText(): string;
    rawWrite(s: string): void;
    writeLiteral(s: string): void;
    getTextPos(): number;
    getLine(): number;
    getColumn(): number;
    getIndent(): number;
    isAtStartOfLine(): boolean;
    getTextPosWithWriteLine?(): number;
  }
  export interface GetEffectiveTypeRootsHost {
    directoryExists?(directoryName: string): boolean;
    getCurrentDirectory?(): string;
  }
  /** @internal */
  export interface ModuleSpecifierResolutionHost extends GetEffectiveTypeRootsHost {
    useCaseSensitiveFileNames?(): boolean;
    fileExists?(path: string): boolean;
    readFile?(path: string): string | undefined;
  }
  export interface SymbolTracker {
    trackSymbol?(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags): void;
    reportInaccessibleThisError?(): void;
    reportPrivateInBaseOfClassExpression?(propertyName: string): void;
    reportInaccessibleUniqueSymbolError?(): void;
    reportLikelyUnsafeImportRequiredError?(specifier: string): void;
    moduleResolverHost?: ModuleSpecifierResolutionHost & {
      getSourceFiles(): ReadonlyArray<SourceFile>;
      getCommonSourceDirectory(): string;
    };
    trackReferencedAmbientModule?(decl: ModuleDeclaration, symbol: Symbol): void;
    trackExternalModuleSymbolOfImportTypeNode?(symbol: Symbol): void;
  }
  export interface TextSpan {
    start: number;
    length: number;
  }
  export interface TextChangeRange {
    span: TextSpan;
    newLength: number;
  }
  export interface DiagnosticCollection {
    add(diagnostic: Diagnostic): void;
    lookup(diagnostic: Diagnostic): Diagnostic | undefined;
    getGlobalDiagnostics(): Diagnostic[];
    getDiagnostics(fileName: string): DiagnosticWithLocation[];
    getDiagnostics(): Diagnostic[];
    reattachFileDiagnostics(newFile: SourceFile): void;
  }
  export interface SyntaxList extends Node {
    _children: Node[];
  }
  export enum ListFormat {
    None = 0,
    SingleLine = 0,
    MultiLine = 1,
    PreserveLines = 2,
    LinesMask = 3,
    NotDelimited = 0,
    BarDelimited = 4,
    AmpersandDelimited = 8,
    CommaDelimited = 16,
    AsteriskDelimited = 32,
    DelimitersMask = 60,
    AllowTrailingComma = 64,
    Indented = 128,
    SpaceBetweenBraces = 256,
    SpaceBetweenSiblings = 512,
    Braces = 1024,
    Parenthesis = 2048,
    AngleBrackets = 4096,
    SquareBrackets = 8192,
    BracketsMask = 15360,
    OptionalIfUndefined = 16384,
    OptionalIfEmpty = 32768,
    Optional = 49152,
    PreferNewLine = 65536,
    NoTrailingNewLine = 131072,
    NoInterveningComments = 262144,
    NoSpaceIfEmpty = 524288,
    SingleElement = 1048576,
    Modifiers = 262656,
    HeritageClauses = 512,
    SingleLineTypeLiteralMembers = 768,
    MultiLineTypeLiteralMembers = 32897,
    TupleTypeElements = 528,
    UnionTypeConstituents = 516,
    IntersectionTypeConstituents = 520,
    ObjectBindingPatternElements = 525136,
    ArrayBindingPatternElements = 524880,
    ObjectLiteralExpressionProperties = 526226,
    ArrayLiteralExpressionElements = 8914,
    CommaListElements = 528,
    CallExpressionArguments = 2576,
    NewExpressionArguments = 18960,
    TemplateExpressionSpans = 262144,
    SingleLineBlockStatements = 768,
    MultiLineBlockStatements = 129,
    VariableDeclarationList = 528,
    SingleLineFunctionBodyStatements = 768,
    MultiLineFunctionBodyStatements = 1,
    ClassHeritageClauses = 0,
    ClassMembers = 129,
    InterfaceMembers = 129,
    EnumMembers = 145,
    CaseBlockClauses = 129,
    NamedImportsOrExportsElements = 525136,
    JsxElementOrFragmentChildren = 262144,
    JsxElementAttributes = 262656,
    CaseOrDefaultClauseStatements = 163969,
    HeritageClauseTypes = 528,
    SourceFileStatements = 131073,
    Decorators = 49153,
    TypeArguments = 53776,
    TypeParameters = 53776,
    Parameters = 2576,
    IndexSignatureParameters = 8848,
    JSDocComment = 33
  }
  export enum PragmaKindFlags {
    None = 0,
    /**
     * Triple slash comment of the form
     * /// <pragma-name argname="value" />
     */
    TripleSlashXML = 1,
    /**
     * Single line comment of the form
     * // @pragma-name argval1 argval2
     * or
     * /// @pragma-name argval1 argval2
     */
    SingleLine = 2,
    /**
     * Multiline non-jsdoc pragma of the form
     * /* @pragma-name argval1 argval2 * /
     */
    MultiLine = 4,
    All = 7,
    Default = 7
  }
  export interface PragmaArgumentSpecification<TName extends string> {
    name: TName;
    optional?: boolean;
    captureSpan?: boolean;
  }
  export interface PragmaDefinition<T1 extends string = string, T2 extends string = string, T3 extends string = string, T4 extends string = string> {
    args?: readonly [PragmaArgumentSpecification<T1>] | readonly [PragmaArgumentSpecification<T1>, PragmaArgumentSpecification<T2>] | readonly [PragmaArgumentSpecification<T1>, PragmaArgumentSpecification<T2>, PragmaArgumentSpecification<T3>] | readonly [PragmaArgumentSpecification<T1>, PragmaArgumentSpecification<T2>, PragmaArgumentSpecification<T3>, PragmaArgumentSpecification<T4>];
    kind?: PragmaKindFlags;
  }
  export const commentPragmas: {
    readonly "reference": {
      readonly args: readonly [{
        readonly name: "types";
        readonly optional: true;
        readonly captureSpan: true;
      }, {
        readonly name: "lib";
        readonly optional: true;
        readonly captureSpan: true;
      }, {
        readonly name: "path";
        readonly optional: true;
        readonly captureSpan: true;
      }, {
        readonly name: "no-default-lib";
        readonly optional: true;
      }];
      readonly kind: PragmaKindFlags;
    };
    readonly "amd-dependency": {
      readonly args: readonly [{
        readonly name: "path";
      }, {
        readonly name: "name";
        readonly optional: true;
      }];
      readonly kind: PragmaKindFlags;
    };
    readonly "amd-module": {
      readonly args: readonly [{
        readonly name: "name";
      }];
      readonly kind: PragmaKindFlags;
    };
    readonly "ts-check": {
      readonly kind: PragmaKindFlags;
    };
    readonly "ts-nocheck": {
      readonly kind: PragmaKindFlags;
    };
    readonly "jsx": {
      readonly args: readonly [{
        readonly name: "factory";
      }];
      readonly kind: PragmaKindFlags;
    };
  };
  export type PragmaArgTypeMaybeCapture<TDesc> = TDesc extends {
    captureSpan: true;
  } ? {
    value: string;
    pos: number;
    end: number;
  } : string;
  export type PragmaArgTypeOptional<TDesc, TName extends string> = TDesc extends {
    optional: true;
  } ? {
    [K in TName]?: PragmaArgTypeMaybeCapture<TDesc>;
  } : {
    [K in TName]: PragmaArgTypeMaybeCapture<TDesc>;
  };
  type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
  type ArgumentDefinitionToFieldUnion<T extends readonly PragmaArgumentSpecification<any>[]> = {
    [K in keyof T]: PragmaArgTypeOptional<T[K], T[K] extends {
      name: infer TName;
    } ? TName extends string ? TName : never : never>;
  }[Extract<keyof T, number>];
  /**
   * Maps a pragma definition into the desired shape for its arguments object
   */
  export type PragmaArgumentType<KPrag extends keyof ConcretePragmaSpecs> = ConcretePragmaSpecs[KPrag] extends {
    args: readonly PragmaArgumentSpecification<any>[];
  } ? UnionToIntersection<ArgumentDefinitionToFieldUnion<ConcretePragmaSpecs[KPrag]["args"]>> : never;
  export type ConcretePragmaSpecs = typeof commentPragmas;
  export type PragmaPseudoMap = {
    [K in keyof ConcretePragmaSpecs]: {
      arguments: PragmaArgumentType<K>;
      range: CommentRange;
    };
  };
  export type PragmaPseudoMapEntry = {
    [K in keyof PragmaPseudoMap]: {
      name: K;
      args: PragmaPseudoMap[K];
    };
  }[keyof PragmaPseudoMap];
  export interface ReadonlyPragmaMap extends ReadonlyMap<PragmaPseudoMap[keyof PragmaPseudoMap] | PragmaPseudoMap[keyof PragmaPseudoMap][]> {
    get<TKey extends keyof PragmaPseudoMap>(key: TKey): PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][];
    forEach(action: <TKey extends keyof PragmaPseudoMap>(value: PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][], key: TKey) => void): void;
  }
  /**
   * A strongly-typed es6 map of pragma entries, the values of which are either a single argument
   * value (if only one was found), or an array of multiple argument values if the pragma is present
   * in multiple places
   */
  export interface PragmaMap extends Map<PragmaPseudoMap[keyof PragmaPseudoMap] | PragmaPseudoMap[keyof PragmaPseudoMap][]>, ReadonlyPragmaMap {
    set<TKey extends keyof PragmaPseudoMap>(key: TKey, value: PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][]): this;
    get<TKey extends keyof PragmaPseudoMap>(key: TKey): PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][];
    forEach(action: <TKey extends keyof PragmaPseudoMap>(value: PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][], key: TKey) => void): void;
  }
  export interface UserPreferences {
    readonly disableSuggestions?: boolean;
    readonly quotePreference?: "auto" | "double" | "single";
    readonly includeCompletionsForModuleExports?: boolean;
    readonly includeCompletionsWithInsertText?: boolean;
    readonly importModuleSpecifierPreference?: "relative" | "non-relative";
    /** Determines whether we import `foo/index.ts` as "foo", "foo/index", or "foo/index.js" */
    readonly importModuleSpecifierEnding?: "minimal" | "index" | "js";
    readonly allowTextChangesInNewFiles?: boolean;
    readonly providePrefixAndSuffixTextForRename?: boolean;
  }
  /** Represents a bigint literal value without requiring bigint support */
  export interface PseudoBigInt {
    negative: boolean;
    base10Value: string;
  }
  export {};
}
declare function setTimeout(handler: (...args: any[]) => void, timeout: number): any;
declare function clearTimeout(handle: any): void;
declare namespace ts {
  /**
   * djb2 hashing algorithm
   * http://www.cse.yorku.ca/~oz/hash.html
   */
  export function generateDjb2Hash(data: string): string;
  /**
   * Set a high stack trace limit to provide more information in case of an error.
   * Called for command-line and server use cases.
   * Not called if TypeScript is used as a library.
   */
  export function setStackTraceLimit(): void;
  export enum FileWatcherEventKind {
    Created = 0,
    Changed = 1,
    Deleted = 2
  }
  export type FileWatcherCallback = (fileName: string, eventKind: FileWatcherEventKind) => void;
  export type DirectoryWatcherCallback = (fileName: string) => void;
  export interface WatchedFile {
    readonly fileName: string;
    readonly callback: FileWatcherCallback;
    mtime: Date;
  }
  export enum PollingInterval {
    High = 2000,
    Medium = 500,
    Low = 250
  }
  export type HostWatchFile = (fileName: string, callback: FileWatcherCallback, pollingInterval: PollingInterval | undefined) => FileWatcher;
  export type HostWatchDirectory = (fileName: string, callback: DirectoryWatcherCallback, recursive?: boolean) => FileWatcher;
  export const missingFileModifiedTime: Date;
  export let unchangedPollThresholds: {
    [PollingInterval.Low]: number;
    [PollingInterval.Medium]: number;
    [PollingInterval.High]: number;
  };
  export function setCustomPollingValues(system: System): void;
  export function createDynamicPriorityPollingWatchFile(host: {
    getModifiedTime: System["getModifiedTime"];
    setTimeout: System["setTimeout"];
  }): HostWatchFile;
  export function createSingleFileWatcherPerName(watchFile: HostWatchFile, useCaseSensitiveFileNames: boolean): HostWatchFile;
  /**
   * Returns true if file status changed
   */
  export function onWatchedFileStat(watchedFile: WatchedFile, modifiedTime: Date): boolean;
  export function getFileWatcherEventKind(oldTime: number, newTime: number): FileWatcherEventKind;
  export const ignoredPaths: string[];
  export let sysLog: (s: string) => void;
  export interface RecursiveDirectoryWatcherHost {
    watchDirectory: HostWatchDirectory;
    useCaseSensitiveFileNames: boolean;
    getAccessibleSortedChildDirectories(path: string): ReadonlyArray<string>;
    directoryExists(dir: string): boolean;
    realpath(s: string): string;
  }
  /**
   * Watch the directory recursively using host provided method to watch child directories
   * that means if this is recursive watcher, watch the children directories as well
   * (eg on OS that dont support recursive watch using fs.watch use fs.watchFile)
   */
  export function createRecursiveDirectoryWatcher(host: RecursiveDirectoryWatcherHost): (directoryName: string, callback: DirectoryWatcherCallback) => FileWatcher;
  export type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";
  interface NodeBuffer extends Uint8Array {
    constructor: any;
    write(str: string, encoding?: BufferEncoding): number;
    write(str: string, offset: number, encoding?: BufferEncoding): number;
    write(str: string, offset: number, length: number, encoding?: BufferEncoding): number;
    toString(encoding?: string, start?: number, end?: number): string;
    toJSON(): {
      type: "Buffer";
      data: number[];
    };
    equals(otherBuffer: Uint8Array): boolean;
    compare(otherBuffer: Uint8Array, targetStart?: number, targetEnd?: number, sourceStart?: number, sourceEnd?: number): number;
    copy(targetBuffer: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
    slice(begin?: number, end?: number): Buffer;
    subarray(begin?: number, end?: number): Buffer;
    writeUIntLE(value: number, offset: number, byteLength: number): number;
    writeUIntBE(value: number, offset: number, byteLength: number): number;
    writeIntLE(value: number, offset: number, byteLength: number): number;
    writeIntBE(value: number, offset: number, byteLength: number): number;
    readUIntLE(offset: number, byteLength: number): number;
    readUIntBE(offset: number, byteLength: number): number;
    readIntLE(offset: number, byteLength: number): number;
    readIntBE(offset: number, byteLength: number): number;
    readUInt8(offset: number): number;
    readUInt16LE(offset: number): number;
    readUInt16BE(offset: number): number;
    readUInt32LE(offset: number): number;
    readUInt32BE(offset: number): number;
    readInt8(offset: number): number;
    readInt16LE(offset: number): number;
    readInt16BE(offset: number): number;
    readInt32LE(offset: number): number;
    readInt32BE(offset: number): number;
    readFloatLE(offset: number): number;
    readFloatBE(offset: number): number;
    readDoubleLE(offset: number): number;
    readDoubleBE(offset: number): number;
    reverse(): this;
    swap16(): Buffer;
    swap32(): Buffer;
    swap64(): Buffer;
    writeUInt8(value: number, offset: number): number;
    writeUInt16LE(value: number, offset: number): number;
    writeUInt16BE(value: number, offset: number): number;
    writeUInt32LE(value: number, offset: number): number;
    writeUInt32BE(value: number, offset: number): number;
    writeInt8(value: number, offset: number): number;
    writeInt16LE(value: number, offset: number): number;
    writeInt16BE(value: number, offset: number): number;
    writeInt32LE(value: number, offset: number): number;
    writeInt32BE(value: number, offset: number): number;
    writeFloatLE(value: number, offset: number): number;
    writeFloatBE(value: number, offset: number): number;
    writeDoubleLE(value: number, offset: number): number;
    writeDoubleBE(value: number, offset: number): number;
    readBigUInt64BE(offset?: number): bigint;
    readBigUInt64LE(offset?: number): bigint;
    readBigInt64BE(offset?: number): bigint;
    readBigInt64LE(offset?: number): bigint;
    writeBigInt64BE(value: bigint, offset?: number): number;
    writeBigInt64LE(value: bigint, offset?: number): number;
    writeBigUInt64BE(value: bigint, offset?: number): number;
    writeBigUInt64LE(value: bigint, offset?: number): number;
    fill(value: string | Uint8Array | number, offset?: number, end?: number, encoding?: BufferEncoding): this;
    indexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number;
    lastIndexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number;
    entries(): IterableIterator<[number, number]>;
    includes(value: string | number | Buffer, byteOffset?: number, encoding?: BufferEncoding): boolean;
    keys(): IterableIterator<number>;
    values(): IterableIterator<number>;
  }
  interface Buffer extends NodeBuffer {
  }
  export interface System {
    args: string[];
    newLine: string;
    useCaseSensitiveFileNames: boolean;
    write(s: string): void;
    writeOutputIsTTY?(): boolean;
    readFile(path: string, encoding?: string): string | undefined;
    getFileSize?(path: string): number;
    writeFile(path: string, data: string, writeByteOrderMark?: boolean): void;
    /**
     * @pollingInterval - this parameter is used in polling-based watchers and ignored in watchers that
     * use native OS file watching
     */
    watchFile?(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
    watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
    resolvePath(path: string): string;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    createDirectory(path: string): void;
    getExecutingFilePath(): string;
    getCurrentDirectory(): string;
    getDirectories(path: string): string[];
    readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    getModifiedTime?(path: string): Date | undefined;
    setModifiedTime?(path: string, time: Date): void;
    deleteFile?(path: string): void;
    /**
     * A good implementation is node.js' `crypto.createHash`. (https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm)
     */
    createHash?(data: string): string;
    /** This must be cryptographically secure. Only implement this method using `crypto.createHash("sha256")`. */
    createSHA256Hash?(data: string): string;
    getMemoryUsage?(): number;
    exit(exitCode?: number): void;
    realpath?(path: string): string;
    getEnvironmentVariable(name: string): string;
    tryEnableSourceMapsForHost?(): void;
    debugMode?: boolean;
    setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
    clearTimeout?(timeoutId: any): void;
    clearScreen?(): void;
    setBlocking?(): void;
    base64decode?(input: string): string;
    base64encode?(input: string): string;
    bufferFrom?(input: string, encoding?: string): Buffer;
  }
  export interface FileWatcher {
    close(): void;
  }
  export function getNodeMajorVersion(): number | undefined;
  export let sys: System;
  export {};
}
declare namespace ts {
  const Diagnostics: {
    Unterminated_string_literal: DiagnosticMessage;
    Identifier_expected: DiagnosticMessage;
    _0_expected: DiagnosticMessage;
    A_file_cannot_have_a_reference_to_itself: DiagnosticMessage;
    Trailing_comma_not_allowed: DiagnosticMessage;
    Asterisk_Slash_expected: DiagnosticMessage;
    An_element_access_expression_should_take_an_argument: DiagnosticMessage;
    Unexpected_token: DiagnosticMessage;
    A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma: DiagnosticMessage;
    A_rest_parameter_must_be_last_in_a_parameter_list: DiagnosticMessage;
    Parameter_cannot_have_question_mark_and_initializer: DiagnosticMessage;
    A_required_parameter_cannot_follow_an_optional_parameter: DiagnosticMessage;
    An_index_signature_cannot_have_a_rest_parameter: DiagnosticMessage;
    An_index_signature_parameter_cannot_have_an_accessibility_modifier: DiagnosticMessage;
    An_index_signature_parameter_cannot_have_a_question_mark: DiagnosticMessage;
    An_index_signature_parameter_cannot_have_an_initializer: DiagnosticMessage;
    An_index_signature_must_have_a_type_annotation: DiagnosticMessage;
    An_index_signature_parameter_must_have_a_type_annotation: DiagnosticMessage;
    An_index_signature_parameter_type_must_be_string_or_number: DiagnosticMessage;
    readonly_modifier_can_only_appear_on_a_property_declaration_or_index_signature: DiagnosticMessage;
    Accessibility_modifier_already_seen: DiagnosticMessage;
    _0_modifier_must_precede_1_modifier: DiagnosticMessage;
    _0_modifier_already_seen: DiagnosticMessage;
    _0_modifier_cannot_appear_on_a_class_element: DiagnosticMessage;
    super_must_be_followed_by_an_argument_list_or_member_access: DiagnosticMessage;
    Only_ambient_modules_can_use_quoted_names: DiagnosticMessage;
    Statements_are_not_allowed_in_ambient_contexts: DiagnosticMessage;
    A_declare_modifier_cannot_be_used_in_an_already_ambient_context: DiagnosticMessage;
    Initializers_are_not_allowed_in_ambient_contexts: DiagnosticMessage;
    _0_modifier_cannot_be_used_in_an_ambient_context: DiagnosticMessage;
    _0_modifier_cannot_be_used_with_a_class_declaration: DiagnosticMessage;
    _0_modifier_cannot_be_used_here: DiagnosticMessage;
    _0_modifier_cannot_appear_on_a_data_property: DiagnosticMessage;
    _0_modifier_cannot_appear_on_a_module_or_namespace_element: DiagnosticMessage;
    A_0_modifier_cannot_be_used_with_an_interface_declaration: DiagnosticMessage;
    Top_level_declarations_in_d_ts_files_must_start_with_either_a_declare_or_export_modifier: DiagnosticMessage;
    A_rest_parameter_cannot_be_optional: DiagnosticMessage;
    A_rest_parameter_cannot_have_an_initializer: DiagnosticMessage;
    A_set_accessor_must_have_exactly_one_parameter: DiagnosticMessage;
    A_set_accessor_cannot_have_an_optional_parameter: DiagnosticMessage;
    A_set_accessor_parameter_cannot_have_an_initializer: DiagnosticMessage;
    A_set_accessor_cannot_have_rest_parameter: DiagnosticMessage;
    A_get_accessor_cannot_have_parameters: DiagnosticMessage;
    Type_0_is_not_a_valid_async_function_return_type_in_ES5_SlashES3_because_it_does_not_refer_to_a_Promise_compatible_constructor_value: DiagnosticMessage;
    Accessors_are_only_available_when_targeting_ECMAScript_5_and_higher: DiagnosticMessage;
    An_async_function_or_method_must_have_a_valid_awaitable_return_type: DiagnosticMessage;
    The_return_type_of_an_async_function_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
    A_promise_must_have_a_then_method: DiagnosticMessage;
    The_first_parameter_of_the_then_method_of_a_promise_must_be_a_callback: DiagnosticMessage;
    Enum_member_must_have_initializer: DiagnosticMessage;
    Type_is_referenced_directly_or_indirectly_in_the_fulfillment_callback_of_its_own_then_method: DiagnosticMessage;
    An_export_assignment_cannot_be_used_in_a_namespace: DiagnosticMessage;
    The_return_type_of_an_async_function_or_method_must_be_the_global_Promise_T_type: DiagnosticMessage;
    In_ambient_enum_declarations_member_initializer_must_be_constant_expression: DiagnosticMessage;
    Unexpected_token_A_constructor_method_accessor_or_property_was_expected: DiagnosticMessage;
    Unexpected_token_A_type_parameter_name_was_expected_without_curly_braces: DiagnosticMessage;
    _0_modifier_cannot_appear_on_a_type_member: DiagnosticMessage;
    _0_modifier_cannot_appear_on_an_index_signature: DiagnosticMessage;
    A_0_modifier_cannot_be_used_with_an_import_declaration: DiagnosticMessage;
    Invalid_reference_directive_syntax: DiagnosticMessage;
    Octal_literals_are_not_available_when_targeting_ECMAScript_5_and_higher_Use_the_syntax_0: DiagnosticMessage;
    _0_modifier_cannot_appear_on_a_constructor_declaration: DiagnosticMessage;
    _0_modifier_cannot_appear_on_a_parameter: DiagnosticMessage;
    Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement: DiagnosticMessage;
    Type_parameters_cannot_appear_on_a_constructor_declaration: DiagnosticMessage;
    Type_annotation_cannot_appear_on_a_constructor_declaration: DiagnosticMessage;
    An_accessor_cannot_have_type_parameters: DiagnosticMessage;
    A_set_accessor_cannot_have_a_return_type_annotation: DiagnosticMessage;
    An_index_signature_must_have_exactly_one_parameter: DiagnosticMessage;
    _0_list_cannot_be_empty: DiagnosticMessage;
    Type_parameter_list_cannot_be_empty: DiagnosticMessage;
    Type_argument_list_cannot_be_empty: DiagnosticMessage;
    Invalid_use_of_0_in_strict_mode: DiagnosticMessage;
    with_statements_are_not_allowed_in_strict_mode: DiagnosticMessage;
    delete_cannot_be_called_on_an_identifier_in_strict_mode: DiagnosticMessage;
    A_for_await_of_statement_is_only_allowed_within_an_async_function_or_async_generator: DiagnosticMessage;
    A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement: DiagnosticMessage;
    A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement: DiagnosticMessage;
    Jump_target_cannot_cross_function_boundary: DiagnosticMessage;
    A_return_statement_can_only_be_used_within_a_function_body: DiagnosticMessage;
    Expression_expected: DiagnosticMessage;
    Type_expected: DiagnosticMessage;
    A_default_clause_cannot_appear_more_than_once_in_a_switch_statement: DiagnosticMessage;
    Duplicate_label_0: DiagnosticMessage;
    A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement: DiagnosticMessage;
    A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement: DiagnosticMessage;
    An_object_literal_cannot_have_multiple_properties_with_the_same_name_in_strict_mode: DiagnosticMessage;
    An_object_literal_cannot_have_multiple_get_Slashset_accessors_with_the_same_name: DiagnosticMessage;
    An_object_literal_cannot_have_property_and_accessor_with_the_same_name: DiagnosticMessage;
    An_export_assignment_cannot_have_modifiers: DiagnosticMessage;
    Octal_literals_are_not_allowed_in_strict_mode: DiagnosticMessage;
    Variable_declaration_list_cannot_be_empty: DiagnosticMessage;
    Digit_expected: DiagnosticMessage;
    Hexadecimal_digit_expected: DiagnosticMessage;
    Unexpected_end_of_text: DiagnosticMessage;
    Invalid_character: DiagnosticMessage;
    Declaration_or_statement_expected: DiagnosticMessage;
    Statement_expected: DiagnosticMessage;
    case_or_default_expected: DiagnosticMessage;
    Property_or_signature_expected: DiagnosticMessage;
    Enum_member_expected: DiagnosticMessage;
    Variable_declaration_expected: DiagnosticMessage;
    Argument_expression_expected: DiagnosticMessage;
    Property_assignment_expected: DiagnosticMessage;
    Expression_or_comma_expected: DiagnosticMessage;
    Parameter_declaration_expected: DiagnosticMessage;
    Type_parameter_declaration_expected: DiagnosticMessage;
    Type_argument_expected: DiagnosticMessage;
    String_literal_expected: DiagnosticMessage;
    Line_break_not_permitted_here: DiagnosticMessage;
    or_expected: DiagnosticMessage;
    Declaration_expected: DiagnosticMessage;
    Import_declarations_in_a_namespace_cannot_reference_a_module: DiagnosticMessage;
    Cannot_use_imports_exports_or_module_augmentations_when_module_is_none: DiagnosticMessage;
    File_name_0_differs_from_already_included_file_name_1_only_in_casing: DiagnosticMessage;
    const_declarations_must_be_initialized: DiagnosticMessage;
    const_declarations_can_only_be_declared_inside_a_block: DiagnosticMessage;
    let_declarations_can_only_be_declared_inside_a_block: DiagnosticMessage;
    Unterminated_template_literal: DiagnosticMessage;
    Unterminated_regular_expression_literal: DiagnosticMessage;
    An_object_member_cannot_be_declared_optional: DiagnosticMessage;
    A_yield_expression_is_only_allowed_in_a_generator_body: DiagnosticMessage;
    Computed_property_names_are_not_allowed_in_enums: DiagnosticMessage;
    A_computed_property_name_in_an_ambient_context_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
    A_computed_property_name_in_a_class_property_declaration_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
    A_computed_property_name_in_a_method_overload_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
    A_computed_property_name_in_an_interface_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
    A_computed_property_name_in_a_type_literal_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
    A_comma_expression_is_not_allowed_in_a_computed_property_name: DiagnosticMessage;
    extends_clause_already_seen: DiagnosticMessage;
    extends_clause_must_precede_implements_clause: DiagnosticMessage;
    Classes_can_only_extend_a_single_class: DiagnosticMessage;
    implements_clause_already_seen: DiagnosticMessage;
    Interface_declaration_cannot_have_implements_clause: DiagnosticMessage;
    Binary_digit_expected: DiagnosticMessage;
    Octal_digit_expected: DiagnosticMessage;
    Unexpected_token_expected: DiagnosticMessage;
    Property_destructuring_pattern_expected: DiagnosticMessage;
    Array_element_destructuring_pattern_expected: DiagnosticMessage;
    A_destructuring_declaration_must_have_an_initializer: DiagnosticMessage;
    An_implementation_cannot_be_declared_in_ambient_contexts: DiagnosticMessage;
    Modifiers_cannot_appear_here: DiagnosticMessage;
    Merge_conflict_marker_encountered: DiagnosticMessage;
    A_rest_element_cannot_have_an_initializer: DiagnosticMessage;
    A_parameter_property_may_not_be_declared_using_a_binding_pattern: DiagnosticMessage;
    Only_a_single_variable_declaration_is_allowed_in_a_for_of_statement: DiagnosticMessage;
    The_variable_declaration_of_a_for_in_statement_cannot_have_an_initializer: DiagnosticMessage;
    The_variable_declaration_of_a_for_of_statement_cannot_have_an_initializer: DiagnosticMessage;
    An_import_declaration_cannot_have_modifiers: DiagnosticMessage;
    Module_0_has_no_default_export: DiagnosticMessage;
    An_export_declaration_cannot_have_modifiers: DiagnosticMessage;
    Export_declarations_are_not_permitted_in_a_namespace: DiagnosticMessage;
    Catch_clause_variable_cannot_have_a_type_annotation: DiagnosticMessage;
    Catch_clause_variable_cannot_have_an_initializer: DiagnosticMessage;
    An_extended_Unicode_escape_value_must_be_between_0x0_and_0x10FFFF_inclusive: DiagnosticMessage;
    Unterminated_Unicode_escape_sequence: DiagnosticMessage;
    Line_terminator_not_permitted_before_arrow: DiagnosticMessage;
    Import_assignment_cannot_be_used_when_targeting_ECMAScript_modules_Consider_using_import_Asterisk_as_ns_from_mod_import_a_from_mod_import_d_from_mod_or_another_module_format_instead: DiagnosticMessage;
    Export_assignment_cannot_be_used_when_targeting_ECMAScript_modules_Consider_using_export_default_or_another_module_format_instead: DiagnosticMessage;
    Cannot_re_export_a_type_when_the_isolatedModules_flag_is_provided: DiagnosticMessage;
    Decorators_are_not_valid_here: DiagnosticMessage;
    Decorators_cannot_be_applied_to_multiple_get_Slashset_accessors_of_the_same_name: DiagnosticMessage;
    All_files_must_be_modules_when_the_isolatedModules_flag_is_provided: DiagnosticMessage;
    Invalid_use_of_0_Class_definitions_are_automatically_in_strict_mode: DiagnosticMessage;
    A_class_declaration_without_the_default_modifier_must_have_a_name: DiagnosticMessage;
    Identifier_expected_0_is_a_reserved_word_in_strict_mode: DiagnosticMessage;
    Identifier_expected_0_is_a_reserved_word_in_strict_mode_Class_definitions_are_automatically_in_strict_mode: DiagnosticMessage;
    Identifier_expected_0_is_a_reserved_word_in_strict_mode_Modules_are_automatically_in_strict_mode: DiagnosticMessage;
    Invalid_use_of_0_Modules_are_automatically_in_strict_mode: DiagnosticMessage;
    Identifier_expected_esModule_is_reserved_as_an_exported_marker_when_transforming_ECMAScript_modules: DiagnosticMessage;
    Export_assignment_is_not_supported_when_module_flag_is_system: DiagnosticMessage;
    Experimental_support_for_decorators_is_a_feature_that_is_subject_to_change_in_a_future_release_Set_the_experimentalDecorators_option_in_your_tsconfig_or_jsconfig_to_remove_this_warning: DiagnosticMessage;
    Generators_are_only_available_when_targeting_ECMAScript_2015_or_higher: DiagnosticMessage;
    Generators_are_not_allowed_in_an_ambient_context: DiagnosticMessage;
    An_overload_signature_cannot_be_declared_as_a_generator: DiagnosticMessage;
    _0_tag_already_specified: DiagnosticMessage;
    Signature_0_must_be_a_type_predicate: DiagnosticMessage;
    Cannot_find_parameter_0: DiagnosticMessage;
    Type_predicate_0_is_not_assignable_to_1: DiagnosticMessage;
    Parameter_0_is_not_in_the_same_position_as_parameter_1: DiagnosticMessage;
    A_type_predicate_is_only_allowed_in_return_type_position_for_functions_and_methods: DiagnosticMessage;
    A_type_predicate_cannot_reference_a_rest_parameter: DiagnosticMessage;
    A_type_predicate_cannot_reference_element_0_in_a_binding_pattern: DiagnosticMessage;
    An_export_assignment_can_only_be_used_in_a_module: DiagnosticMessage;
    An_import_declaration_can_only_be_used_in_a_namespace_or_module: DiagnosticMessage;
    An_export_declaration_can_only_be_used_in_a_module: DiagnosticMessage;
    An_ambient_module_declaration_is_only_allowed_at_the_top_level_in_a_file: DiagnosticMessage;
    A_namespace_declaration_is_only_allowed_in_a_namespace_or_module: DiagnosticMessage;
    The_return_type_of_a_property_decorator_function_must_be_either_void_or_any: DiagnosticMessage;
    The_return_type_of_a_parameter_decorator_function_must_be_either_void_or_any: DiagnosticMessage;
    Unable_to_resolve_signature_of_class_decorator_when_called_as_an_expression: DiagnosticMessage;
    Unable_to_resolve_signature_of_parameter_decorator_when_called_as_an_expression: DiagnosticMessage;
    Unable_to_resolve_signature_of_property_decorator_when_called_as_an_expression: DiagnosticMessage;
    Unable_to_resolve_signature_of_method_decorator_when_called_as_an_expression: DiagnosticMessage;
    abstract_modifier_can_only_appear_on_a_class_method_or_property_declaration: DiagnosticMessage;
    _0_modifier_cannot_be_used_with_1_modifier: DiagnosticMessage;
    Abstract_methods_can_only_appear_within_an_abstract_class: DiagnosticMessage;
    Method_0_cannot_have_an_implementation_because_it_is_marked_abstract: DiagnosticMessage;
    An_interface_property_cannot_have_an_initializer: DiagnosticMessage;
    A_type_literal_property_cannot_have_an_initializer: DiagnosticMessage;
    A_class_member_cannot_have_the_0_keyword: DiagnosticMessage;
    A_decorator_can_only_decorate_a_method_implementation_not_an_overload: DiagnosticMessage;
    Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5: DiagnosticMessage;
    Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Class_definitions_are_automatically_in_strict_mode: DiagnosticMessage;
    Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Modules_are_automatically_in_strict_mode: DiagnosticMessage;
    _0_tag_cannot_be_used_independently_as_a_top_level_JSDoc_tag: DiagnosticMessage;
    A_const_initializer_in_an_ambient_context_must_be_a_string_or_numeric_literal_or_literal_enum_reference: DiagnosticMessage;
    A_definite_assignment_assertion_is_not_permitted_in_this_context: DiagnosticMessage;
    A_rest_element_must_be_last_in_a_tuple_type: DiagnosticMessage;
    A_required_element_cannot_follow_an_optional_element: DiagnosticMessage;
    Definite_assignment_assertions_can_only_be_used_along_with_a_type_annotation: DiagnosticMessage;
    Module_0_can_only_be_default_imported_using_the_1_flag: DiagnosticMessage;
    Keywords_cannot_contain_escape_characters: DiagnosticMessage;
    with_statements_are_not_allowed_in_an_async_function_block: DiagnosticMessage;
    await_expression_is_only_allowed_within_an_async_function: DiagnosticMessage;
    can_only_be_used_in_an_object_literal_property_inside_a_destructuring_assignment: DiagnosticMessage;
    The_body_of_an_if_statement_cannot_be_the_empty_statement: DiagnosticMessage;
    Global_module_exports_may_only_appear_in_module_files: DiagnosticMessage;
    Global_module_exports_may_only_appear_in_declaration_files: DiagnosticMessage;
    Global_module_exports_may_only_appear_at_top_level: DiagnosticMessage;
    A_parameter_property_cannot_be_declared_using_a_rest_parameter: DiagnosticMessage;
    An_abstract_accessor_cannot_have_an_implementation: DiagnosticMessage;
    A_default_export_can_only_be_used_in_an_ECMAScript_style_module: DiagnosticMessage;
    Type_of_await_operand_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
    Type_of_yield_operand_in_an_async_generator_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
    Type_of_iterated_elements_of_a_yield_Asterisk_operand_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
    Dynamic_import_is_only_supported_when_module_flag_is_commonjs_or_esNext: DiagnosticMessage;
    Dynamic_import_must_have_one_specifier_as_an_argument: DiagnosticMessage;
    Specifier_of_dynamic_import_cannot_be_spread_element: DiagnosticMessage;
    Dynamic_import_cannot_have_type_arguments: DiagnosticMessage;
    String_literal_with_double_quotes_expected: DiagnosticMessage;
    Property_value_can_only_be_string_literal_numeric_literal_true_false_null_object_literal_or_array_literal: DiagnosticMessage;
    _0_accepts_too_few_arguments_to_be_used_as_a_decorator_here_Did_you_mean_to_call_it_first_and_write_0: DiagnosticMessage;
    A_property_of_an_interface_or_type_literal_whose_type_is_a_unique_symbol_type_must_be_readonly: DiagnosticMessage;
    A_property_of_a_class_whose_type_is_a_unique_symbol_type_must_be_both_static_and_readonly: DiagnosticMessage;
    A_variable_whose_type_is_a_unique_symbol_type_must_be_const: DiagnosticMessage;
    unique_symbol_types_may_not_be_used_on_a_variable_declaration_with_a_binding_name: DiagnosticMessage;
    unique_symbol_types_are_only_allowed_on_variables_in_a_variable_statement: DiagnosticMessage;
    unique_symbol_types_are_not_allowed_here: DiagnosticMessage;
    An_index_signature_parameter_type_cannot_be_a_type_alias_Consider_writing_0_Colon_1_Colon_2_instead: DiagnosticMessage;
    An_index_signature_parameter_type_cannot_be_a_union_type_Consider_using_a_mapped_object_type_instead: DiagnosticMessage;
    infer_declarations_are_only_permitted_in_the_extends_clause_of_a_conditional_type: DiagnosticMessage;
    Module_0_does_not_refer_to_a_value_but_is_used_as_a_value_here: DiagnosticMessage;
    Module_0_does_not_refer_to_a_type_but_is_used_as_a_type_here_Did_you_mean_typeof_import_0: DiagnosticMessage;
    Type_arguments_cannot_be_used_here: DiagnosticMessage;
    The_import_meta_meta_property_is_only_allowed_when_the_module_option_is_esnext_or_system: DiagnosticMessage;
    A_label_is_not_allowed_here: DiagnosticMessage;
    An_expression_of_type_void_cannot_be_tested_for_truthiness: DiagnosticMessage;
    This_parameter_is_not_allowed_with_use_strict_directive: DiagnosticMessage;
    use_strict_directive_cannot_be_used_with_non_simple_parameter_list: DiagnosticMessage;
    Non_simple_parameter_declared_here: DiagnosticMessage;
    use_strict_directive_used_here: DiagnosticMessage;
    Print_the_final_configuration_instead_of_building: DiagnosticMessage;
    An_identifier_or_keyword_cannot_immediately_follow_a_numeric_literal: DiagnosticMessage;
    A_bigint_literal_cannot_use_exponential_notation: DiagnosticMessage;
    A_bigint_literal_must_be_an_integer: DiagnosticMessage;
    readonly_type_modifier_is_only_permitted_on_array_and_tuple_literal_types: DiagnosticMessage;
    A_const_assertions_can_only_be_applied_to_references_to_enum_members_or_string_number_boolean_array_or_object_literals: DiagnosticMessage;
    Did_you_mean_to_mark_this_function_as_async: DiagnosticMessage;
    Duplicate_identifier_0: DiagnosticMessage;
    Initializer_of_instance_member_variable_0_cannot_reference_identifier_1_declared_in_the_constructor: DiagnosticMessage;
    Static_members_cannot_reference_class_type_parameters: DiagnosticMessage;
    Circular_definition_of_import_alias_0: DiagnosticMessage;
    Cannot_find_name_0: DiagnosticMessage;
    Module_0_has_no_exported_member_1: DiagnosticMessage;
    File_0_is_not_a_module: DiagnosticMessage;
    Cannot_find_module_0: DiagnosticMessage;
    Module_0_has_already_exported_a_member_named_1_Consider_explicitly_re_exporting_to_resolve_the_ambiguity: DiagnosticMessage;
    An_export_assignment_cannot_be_used_in_a_module_with_other_exported_elements: DiagnosticMessage;
    Type_0_recursively_references_itself_as_a_base_type: DiagnosticMessage;
    A_class_may_only_extend_another_class: DiagnosticMessage;
    An_interface_can_only_extend_an_object_type_or_intersection_of_object_types_with_statically_known_members: DiagnosticMessage;
    Type_parameter_0_has_a_circular_constraint: DiagnosticMessage;
    Generic_type_0_requires_1_type_argument_s: DiagnosticMessage;
    Type_0_is_not_generic: DiagnosticMessage;
    Global_type_0_must_be_a_class_or_interface_type: DiagnosticMessage;
    Global_type_0_must_have_1_type_parameter_s: DiagnosticMessage;
    Cannot_find_global_type_0: DiagnosticMessage;
    Named_property_0_of_types_1_and_2_are_not_identical: DiagnosticMessage;
    Interface_0_cannot_simultaneously_extend_types_1_and_2: DiagnosticMessage;
    Excessive_stack_depth_comparing_types_0_and_1: DiagnosticMessage;
    Type_0_is_not_assignable_to_type_1: DiagnosticMessage;
    Cannot_redeclare_exported_variable_0: DiagnosticMessage;
    Property_0_is_missing_in_type_1: DiagnosticMessage;
    Property_0_is_private_in_type_1_but_not_in_type_2: DiagnosticMessage;
    Types_of_property_0_are_incompatible: DiagnosticMessage;
    Property_0_is_optional_in_type_1_but_required_in_type_2: DiagnosticMessage;
    Types_of_parameters_0_and_1_are_incompatible: DiagnosticMessage;
    Index_signature_is_missing_in_type_0: DiagnosticMessage;
    Index_signatures_are_incompatible: DiagnosticMessage;
    this_cannot_be_referenced_in_a_module_or_namespace_body: DiagnosticMessage;
    this_cannot_be_referenced_in_current_location: DiagnosticMessage;
    this_cannot_be_referenced_in_constructor_arguments: DiagnosticMessage;
    this_cannot_be_referenced_in_a_static_property_initializer: DiagnosticMessage;
    super_can_only_be_referenced_in_a_derived_class: DiagnosticMessage;
    super_cannot_be_referenced_in_constructor_arguments: DiagnosticMessage;
    Super_calls_are_not_permitted_outside_constructors_or_in_nested_functions_inside_constructors: DiagnosticMessage;
    super_property_access_is_permitted_only_in_a_constructor_member_function_or_member_accessor_of_a_derived_class: DiagnosticMessage;
    Property_0_does_not_exist_on_type_1: DiagnosticMessage;
    Only_public_and_protected_methods_of_the_base_class_are_accessible_via_the_super_keyword: DiagnosticMessage;
    Property_0_is_private_and_only_accessible_within_class_1: DiagnosticMessage;
    An_index_expression_argument_must_be_of_type_string_number_symbol_or_any: DiagnosticMessage;
    This_syntax_requires_an_imported_helper_named_1_but_module_0_has_no_exported_member_1: DiagnosticMessage;
    Type_0_does_not_satisfy_the_constraint_1: DiagnosticMessage;
    Argument_of_type_0_is_not_assignable_to_parameter_of_type_1: DiagnosticMessage;
    Call_target_does_not_contain_any_signatures: DiagnosticMessage;
    Untyped_function_calls_may_not_accept_type_arguments: DiagnosticMessage;
    Value_of_type_0_is_not_callable_Did_you_mean_to_include_new: DiagnosticMessage;
    This_expression_is_not_callable: DiagnosticMessage;
    Only_a_void_function_can_be_called_with_the_new_keyword: DiagnosticMessage;
    This_expression_is_not_constructable: DiagnosticMessage;
    Conversion_of_type_0_to_type_1_may_be_a_mistake_because_neither_type_sufficiently_overlaps_with_the_other_If_this_was_intentional_convert_the_expression_to_unknown_first: DiagnosticMessage;
    Object_literal_may_only_specify_known_properties_and_0_does_not_exist_in_type_1: DiagnosticMessage;
    This_syntax_requires_an_imported_helper_but_module_0_cannot_be_found: DiagnosticMessage;
    A_function_whose_declared_type_is_neither_void_nor_any_must_return_a_value: DiagnosticMessage;
    An_arithmetic_operand_must_be_of_type_any_number_bigint_or_an_enum_type: DiagnosticMessage;
    The_operand_of_an_increment_or_decrement_operator_must_be_a_variable_or_a_property_access: DiagnosticMessage;
    The_left_hand_side_of_an_instanceof_expression_must_be_of_type_any_an_object_type_or_a_type_parameter: DiagnosticMessage;
    The_right_hand_side_of_an_instanceof_expression_must_be_of_type_any_or_of_a_type_assignable_to_the_Function_interface_type: DiagnosticMessage;
    The_left_hand_side_of_an_in_expression_must_be_of_type_any_string_number_or_symbol: DiagnosticMessage;
    The_right_hand_side_of_an_in_expression_must_be_of_type_any_an_object_type_or_a_type_parameter: DiagnosticMessage;
    The_left_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type: DiagnosticMessage;
    The_right_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type: DiagnosticMessage;
    The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access: DiagnosticMessage;
    Operator_0_cannot_be_applied_to_types_1_and_2: DiagnosticMessage;
    Function_lacks_ending_return_statement_and_return_type_does_not_include_undefined: DiagnosticMessage;
    This_condition_will_always_return_0_since_the_types_1_and_2_have_no_overlap: DiagnosticMessage;
    Type_parameter_name_cannot_be_0: DiagnosticMessage;
    A_parameter_property_is_only_allowed_in_a_constructor_implementation: DiagnosticMessage;
    A_rest_parameter_must_be_of_an_array_type: DiagnosticMessage;
    A_parameter_initializer_is_only_allowed_in_a_function_or_constructor_implementation: DiagnosticMessage;
    Parameter_0_cannot_be_referenced_in_its_initializer: DiagnosticMessage;
    Initializer_of_parameter_0_cannot_reference_identifier_1_declared_after_it: DiagnosticMessage;
    Duplicate_string_index_signature: DiagnosticMessage;
    Duplicate_number_index_signature: DiagnosticMessage;
    A_super_call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_initialized_properties_or_has_parameter_properties: DiagnosticMessage;
    Constructors_for_derived_classes_must_contain_a_super_call: DiagnosticMessage;
    A_get_accessor_must_return_a_value: DiagnosticMessage;
    Getter_and_setter_accessors_do_not_agree_in_visibility: DiagnosticMessage;
    get_and_set_accessor_must_have_the_same_type: DiagnosticMessage;
    A_signature_with_an_implementation_cannot_use_a_string_literal_type: DiagnosticMessage;
    Specialized_overload_signature_is_not_assignable_to_any_non_specialized_signature: DiagnosticMessage;
    Overload_signatures_must_all_be_exported_or_non_exported: DiagnosticMessage;
    Overload_signatures_must_all_be_ambient_or_non_ambient: DiagnosticMessage;
    Overload_signatures_must_all_be_public_private_or_protected: DiagnosticMessage;
    Overload_signatures_must_all_be_optional_or_required: DiagnosticMessage;
    Function_overload_must_be_static: DiagnosticMessage;
    Function_overload_must_not_be_static: DiagnosticMessage;
    Function_implementation_name_must_be_0: DiagnosticMessage;
    Constructor_implementation_is_missing: DiagnosticMessage;
    Function_implementation_is_missing_or_not_immediately_following_the_declaration: DiagnosticMessage;
    Multiple_constructor_implementations_are_not_allowed: DiagnosticMessage;
    Duplicate_function_implementation: DiagnosticMessage;
    This_overload_signature_is_not_compatible_with_its_implementation_signature: DiagnosticMessage;
    Individual_declarations_in_merged_declaration_0_must_be_all_exported_or_all_local: DiagnosticMessage;
    Duplicate_identifier_arguments_Compiler_uses_arguments_to_initialize_rest_parameters: DiagnosticMessage;
    Declaration_name_conflicts_with_built_in_global_identifier_0: DiagnosticMessage;
    Duplicate_identifier_this_Compiler_uses_variable_declaration_this_to_capture_this_reference: DiagnosticMessage;
    Expression_resolves_to_variable_declaration_this_that_compiler_uses_to_capture_this_reference: DiagnosticMessage;
    Duplicate_identifier_super_Compiler_uses_super_to_capture_base_class_reference: DiagnosticMessage;
    Expression_resolves_to_super_that_compiler_uses_to_capture_base_class_reference: DiagnosticMessage;
    Subsequent_variable_declarations_must_have_the_same_type_Variable_0_must_be_of_type_1_but_here_has_type_2: DiagnosticMessage;
    The_left_hand_side_of_a_for_in_statement_cannot_use_a_type_annotation: DiagnosticMessage;
    The_left_hand_side_of_a_for_in_statement_must_be_of_type_string_or_any: DiagnosticMessage;
    The_left_hand_side_of_a_for_in_statement_must_be_a_variable_or_a_property_access: DiagnosticMessage;
    The_right_hand_side_of_a_for_in_statement_must_be_of_type_any_an_object_type_or_a_type_parameter_but_here_has_type_0: DiagnosticMessage;
    Setters_cannot_return_a_value: DiagnosticMessage;
    Return_type_of_constructor_signature_must_be_assignable_to_the_instance_type_of_the_class: DiagnosticMessage;
    The_with_statement_is_not_supported_All_symbols_in_a_with_block_will_have_type_any: DiagnosticMessage;
    Property_0_of_type_1_is_not_assignable_to_string_index_type_2: DiagnosticMessage;
    Property_0_of_type_1_is_not_assignable_to_numeric_index_type_2: DiagnosticMessage;
    Numeric_index_type_0_is_not_assignable_to_string_index_type_1: DiagnosticMessage;
    Class_name_cannot_be_0: DiagnosticMessage;
    Class_0_incorrectly_extends_base_class_1: DiagnosticMessage;
    Property_0_in_type_1_is_not_assignable_to_the_same_property_in_base_type_2: DiagnosticMessage;
    Class_static_side_0_incorrectly_extends_base_class_static_side_1: DiagnosticMessage;
    Type_of_computed_property_s_value_is_0_which_is_not_assignable_to_type_1: DiagnosticMessage;
    Class_0_incorrectly_implements_interface_1: DiagnosticMessage;
    A_class_can_only_implement_an_object_type_or_intersection_of_object_types_with_statically_known_members: DiagnosticMessage;
    Class_0_defines_instance_member_function_1_but_extended_class_2_defines_it_as_instance_member_accessor: DiagnosticMessage;
    Class_0_defines_instance_member_function_1_but_extended_class_2_defines_it_as_instance_member_property: DiagnosticMessage;
    Class_0_defines_instance_member_property_1_but_extended_class_2_defines_it_as_instance_member_function: DiagnosticMessage;
    Class_0_defines_instance_member_accessor_1_but_extended_class_2_defines_it_as_instance_member_function: DiagnosticMessage;
    Interface_name_cannot_be_0: DiagnosticMessage;
    All_declarations_of_0_must_have_identical_type_parameters: DiagnosticMessage;
    Interface_0_incorrectly_extends_interface_1: DiagnosticMessage;
    Enum_name_cannot_be_0: DiagnosticMessage;
    In_an_enum_with_multiple_declarations_only_one_declaration_can_omit_an_initializer_for_its_first_enum_element: DiagnosticMessage;
    A_namespace_declaration_cannot_be_in_a_different_file_from_a_class_or_function_with_which_it_is_merged: DiagnosticMessage;
    A_namespace_declaration_cannot_be_located_prior_to_a_class_or_function_with_which_it_is_merged: DiagnosticMessage;
    Ambient_modules_cannot_be_nested_in_other_modules_or_namespaces: DiagnosticMessage;
    Ambient_module_declaration_cannot_specify_relative_module_name: DiagnosticMessage;
    Module_0_is_hidden_by_a_local_declaration_with_the_same_name: DiagnosticMessage;
    Import_name_cannot_be_0: DiagnosticMessage;
    Import_or_export_declaration_in_an_ambient_module_declaration_cannot_reference_module_through_relative_module_name: DiagnosticMessage;
    Import_declaration_conflicts_with_local_declaration_of_0: DiagnosticMessage;
    Duplicate_identifier_0_Compiler_reserves_name_1_in_top_level_scope_of_a_module: DiagnosticMessage;
    Types_have_separate_declarations_of_a_private_property_0: DiagnosticMessage;
    Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2: DiagnosticMessage;
    Property_0_is_protected_in_type_1_but_public_in_type_2: DiagnosticMessage;
    Property_0_is_protected_and_only_accessible_within_class_1_and_its_subclasses: DiagnosticMessage;
    Property_0_is_protected_and_only_accessible_through_an_instance_of_class_1: DiagnosticMessage;
    The_0_operator_is_not_allowed_for_boolean_types_Consider_using_1_instead: DiagnosticMessage;
    Block_scoped_variable_0_used_before_its_declaration: DiagnosticMessage;
    Class_0_used_before_its_declaration: DiagnosticMessage;
    Enum_0_used_before_its_declaration: DiagnosticMessage;
    Cannot_redeclare_block_scoped_variable_0: DiagnosticMessage;
    An_enum_member_cannot_have_a_numeric_name: DiagnosticMessage;
    The_type_argument_for_type_parameter_0_cannot_be_inferred_from_the_usage_Consider_specifying_the_type_arguments_explicitly: DiagnosticMessage;
    Variable_0_is_used_before_being_assigned: DiagnosticMessage;
    Type_argument_candidate_1_is_not_a_valid_type_argument_because_it_is_not_a_supertype_of_candidate_0: DiagnosticMessage;
    Type_alias_0_circularly_references_itself: DiagnosticMessage;
    Type_alias_name_cannot_be_0: DiagnosticMessage;
    An_AMD_module_cannot_have_multiple_name_assignments: DiagnosticMessage;
    Type_0_is_not_an_array_type: DiagnosticMessage;
    A_rest_element_must_be_last_in_a_destructuring_pattern: DiagnosticMessage;
    A_binding_pattern_parameter_cannot_be_optional_in_an_implementation_signature: DiagnosticMessage;
    A_computed_property_name_must_be_of_type_string_number_symbol_or_any: DiagnosticMessage;
    this_cannot_be_referenced_in_a_computed_property_name: DiagnosticMessage;
    super_cannot_be_referenced_in_a_computed_property_name: DiagnosticMessage;
    A_computed_property_name_cannot_reference_a_type_parameter_from_its_containing_type: DiagnosticMessage;
    Cannot_find_global_value_0: DiagnosticMessage;
    The_0_operator_cannot_be_applied_to_type_symbol: DiagnosticMessage;
    Symbol_reference_does_not_refer_to_the_global_Symbol_constructor_object: DiagnosticMessage;
    A_computed_property_name_of_the_form_0_must_be_of_type_symbol: DiagnosticMessage;
    Spread_operator_in_new_expressions_is_only_available_when_targeting_ECMAScript_5_and_higher: DiagnosticMessage;
    Enum_declarations_must_all_be_const_or_non_const: DiagnosticMessage;
    const_enum_member_initializers_can_only_contain_literal_values_and_other_computed_enum_values: DiagnosticMessage;
    const_enums_can_only_be_used_in_property_or_index_access_expressions_or_the_right_hand_side_of_an_import_declaration_or_export_assignment_or_type_query: DiagnosticMessage;
    A_const_enum_member_can_only_be_accessed_using_a_string_literal: DiagnosticMessage;
    const_enum_member_initializer_was_evaluated_to_a_non_finite_value: DiagnosticMessage;
    const_enum_member_initializer_was_evaluated_to_disallowed_value_NaN: DiagnosticMessage;
    Property_0_does_not_exist_on_const_enum_1: DiagnosticMessage;
    let_is_not_allowed_to_be_used_as_a_name_in_let_or_const_declarations: DiagnosticMessage;
    Cannot_initialize_outer_scoped_variable_0_in_the_same_scope_as_block_scoped_declaration_1: DiagnosticMessage;
    The_left_hand_side_of_a_for_of_statement_cannot_use_a_type_annotation: DiagnosticMessage;
    Export_declaration_conflicts_with_exported_declaration_of_0: DiagnosticMessage;
    The_left_hand_side_of_a_for_of_statement_must_be_a_variable_or_a_property_access: DiagnosticMessage;
    Type_0_must_have_a_Symbol_iterator_method_that_returns_an_iterator: DiagnosticMessage;
    An_iterator_must_have_a_next_method: DiagnosticMessage;
    The_type_returned_by_the_0_method_of_an_iterator_must_have_a_value_property: DiagnosticMessage;
    The_left_hand_side_of_a_for_in_statement_cannot_be_a_destructuring_pattern: DiagnosticMessage;
    Cannot_redeclare_identifier_0_in_catch_clause: DiagnosticMessage;
    Tuple_type_0_of_length_1_has_no_element_at_index_2: DiagnosticMessage;
    Using_a_string_in_a_for_of_statement_is_only_supported_in_ECMAScript_5_and_higher: DiagnosticMessage;
    Type_0_is_not_an_array_type_or_a_string_type: DiagnosticMessage;
    The_arguments_object_cannot_be_referenced_in_an_arrow_function_in_ES3_and_ES5_Consider_using_a_standard_function_expression: DiagnosticMessage;
    This_module_can_only_be_referenced_with_ECMAScript_imports_Slashexports_by_turning_on_the_0_flag_and_referencing_its_default_export: DiagnosticMessage;
    Module_0_uses_export_and_cannot_be_used_with_export_Asterisk: DiagnosticMessage;
    An_interface_can_only_extend_an_identifier_Slashqualified_name_with_optional_type_arguments: DiagnosticMessage;
    A_class_can_only_implement_an_identifier_Slashqualified_name_with_optional_type_arguments: DiagnosticMessage;
    A_rest_element_cannot_contain_a_binding_pattern: DiagnosticMessage;
    _0_is_referenced_directly_or_indirectly_in_its_own_type_annotation: DiagnosticMessage;
    Cannot_find_namespace_0: DiagnosticMessage;
    Type_0_must_have_a_Symbol_asyncIterator_method_that_returns_an_async_iterator: DiagnosticMessage;
    A_generator_cannot_have_a_void_type_annotation: DiagnosticMessage;
    _0_is_referenced_directly_or_indirectly_in_its_own_base_expression: DiagnosticMessage;
    Type_0_is_not_a_constructor_function_type: DiagnosticMessage;
    No_base_constructor_has_the_specified_number_of_type_arguments: DiagnosticMessage;
    Base_constructor_return_type_0_is_not_an_object_type_or_intersection_of_object_types_with_statically_known_members: DiagnosticMessage;
    Base_constructors_must_all_have_the_same_return_type: DiagnosticMessage;
    Cannot_create_an_instance_of_an_abstract_class: DiagnosticMessage;
    Overload_signatures_must_all_be_abstract_or_non_abstract: DiagnosticMessage;
    Abstract_method_0_in_class_1_cannot_be_accessed_via_super_expression: DiagnosticMessage;
    Classes_containing_abstract_methods_must_be_marked_abstract: DiagnosticMessage;
    Non_abstract_class_0_does_not_implement_inherited_abstract_member_1_from_class_2: DiagnosticMessage;
    All_declarations_of_an_abstract_method_must_be_consecutive: DiagnosticMessage;
    Cannot_assign_an_abstract_constructor_type_to_a_non_abstract_constructor_type: DiagnosticMessage;
    A_this_based_type_guard_is_not_compatible_with_a_parameter_based_type_guard: DiagnosticMessage;
    An_async_iterator_must_have_a_next_method: DiagnosticMessage;
    Duplicate_identifier_0_Compiler_uses_declaration_1_to_support_async_functions: DiagnosticMessage;
    Expression_resolves_to_variable_declaration_0_that_compiler_uses_to_support_async_functions: DiagnosticMessage;
    The_arguments_object_cannot_be_referenced_in_an_async_function_or_method_in_ES3_and_ES5_Consider_using_a_standard_function_or_method: DiagnosticMessage;
    yield_expressions_cannot_be_used_in_a_parameter_initializer: DiagnosticMessage;
    await_expressions_cannot_be_used_in_a_parameter_initializer: DiagnosticMessage;
    Initializer_provides_no_value_for_this_binding_element_and_the_binding_element_has_no_default_value: DiagnosticMessage;
    A_this_type_is_available_only_in_a_non_static_member_of_a_class_or_interface: DiagnosticMessage;
    The_inferred_type_of_0_references_an_inaccessible_1_type_A_type_annotation_is_necessary: DiagnosticMessage;
    A_module_cannot_have_multiple_default_exports: DiagnosticMessage;
    Duplicate_identifier_0_Compiler_reserves_name_1_in_top_level_scope_of_a_module_containing_async_functions: DiagnosticMessage;
    Property_0_is_incompatible_with_index_signature: DiagnosticMessage;
    Object_is_possibly_null: DiagnosticMessage;
    Object_is_possibly_undefined: DiagnosticMessage;
    Object_is_possibly_null_or_undefined: DiagnosticMessage;
    A_function_returning_never_cannot_have_a_reachable_end_point: DiagnosticMessage;
    Enum_type_0_has_members_with_initializers_that_are_not_literals: DiagnosticMessage;
    Type_0_cannot_be_used_to_index_type_1: DiagnosticMessage;
    Type_0_has_no_matching_index_signature_for_type_1: DiagnosticMessage;
    Type_0_cannot_be_used_as_an_index_type: DiagnosticMessage;
    Cannot_assign_to_0_because_it_is_not_a_variable: DiagnosticMessage;
    Cannot_assign_to_0_because_it_is_a_read_only_property: DiagnosticMessage;
    The_target_of_an_assignment_must_be_a_variable_or_a_property_access: DiagnosticMessage;
    Index_signature_in_type_0_only_permits_reading: DiagnosticMessage;
    Duplicate_identifier_newTarget_Compiler_uses_variable_declaration_newTarget_to_capture_new_target_meta_property_reference: DiagnosticMessage;
    Expression_resolves_to_variable_declaration_newTarget_that_compiler_uses_to_capture_new_target_meta_property_reference: DiagnosticMessage;
    A_mixin_class_must_have_a_constructor_with_a_single_rest_parameter_of_type_any: DiagnosticMessage;
    Property_0_has_conflicting_declarations_and_is_inaccessible_in_type_1: DiagnosticMessage;
    The_type_returned_by_the_0_method_of_an_async_iterator_must_be_a_promise_for_a_type_with_a_value_property: DiagnosticMessage;
    Type_0_is_not_an_array_type_or_does_not_have_a_Symbol_iterator_method_that_returns_an_iterator: DiagnosticMessage;
    Type_0_is_not_an_array_type_or_a_string_type_or_does_not_have_a_Symbol_iterator_method_that_returns_an_iterator: DiagnosticMessage;
    Property_0_does_not_exist_on_type_1_Did_you_mean_2: DiagnosticMessage;
    Cannot_find_name_0_Did_you_mean_1: DiagnosticMessage;
    Computed_values_are_not_permitted_in_an_enum_with_string_valued_members: DiagnosticMessage;
    Expected_0_arguments_but_got_1: DiagnosticMessage;
    Expected_at_least_0_arguments_but_got_1: DiagnosticMessage;
    Expected_0_arguments_but_got_1_or_more: DiagnosticMessage;
    Expected_at_least_0_arguments_but_got_1_or_more: DiagnosticMessage;
    Expected_0_type_arguments_but_got_1: DiagnosticMessage;
    Type_0_has_no_properties_in_common_with_type_1: DiagnosticMessage;
    Value_of_type_0_has_no_properties_in_common_with_type_1_Did_you_mean_to_call_it: DiagnosticMessage;
    Object_literal_may_only_specify_known_properties_but_0_does_not_exist_in_type_1_Did_you_mean_to_write_2: DiagnosticMessage;
    Base_class_expressions_cannot_reference_class_type_parameters: DiagnosticMessage;
    The_containing_function_or_module_body_is_too_large_for_control_flow_analysis: DiagnosticMessage;
    Property_0_has_no_initializer_and_is_not_definitely_assigned_in_the_constructor: DiagnosticMessage;
    Property_0_is_used_before_being_assigned: DiagnosticMessage;
    A_rest_element_cannot_have_a_property_name: DiagnosticMessage;
    Enum_declarations_can_only_merge_with_namespace_or_other_enum_declarations: DiagnosticMessage;
    Type_0_is_not_an_array_type_or_a_string_type_Use_compiler_option_downlevelIteration_to_allow_iterating_of_iterators: DiagnosticMessage;
    Object_is_of_type_unknown: DiagnosticMessage;
    Rest_signatures_are_incompatible: DiagnosticMessage;
    Property_0_is_incompatible_with_rest_element_type: DiagnosticMessage;
    A_rest_element_type_must_be_an_array_type: DiagnosticMessage;
    No_overload_expects_0_arguments_but_overloads_do_exist_that_expect_either_1_or_2_arguments: DiagnosticMessage;
    Property_0_is_a_static_member_of_type_1: DiagnosticMessage;
    Return_type_annotation_circularly_references_itself: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_node_Try_npm_i_types_Slashnode: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_jQuery_Try_npm_i_types_Slashjquery: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_a_test_runner_Try_npm_i_types_Slashjest_or_npm_i_types_Slashmocha: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_es2015_or_later: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_include_dom: DiagnosticMessage;
    _0_only_refers_to_a_type_but_is_being_used_as_a_value_here_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_es2015_or_later: DiagnosticMessage;
    Enum_type_0_circularly_references_itself: DiagnosticMessage;
    JSDoc_type_0_circularly_references_itself: DiagnosticMessage;
    Cannot_assign_to_0_because_it_is_a_constant: DiagnosticMessage;
    Type_instantiation_is_excessively_deep_and_possibly_infinite: DiagnosticMessage;
    Expression_produces_a_union_type_that_is_too_complex_to_represent: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_node_Try_npm_i_types_Slashnode_and_then_add_node_to_the_types_field_in_your_tsconfig: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_jQuery_Try_npm_i_types_Slashjquery_and_then_add_jquery_to_the_types_field_in_your_tsconfig: DiagnosticMessage;
    Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_a_test_runner_Try_npm_i_types_Slashjest_or_npm_i_types_Slashmocha_and_then_add_jest_or_mocha_to_the_types_field_in_your_tsconfig: DiagnosticMessage;
    This_module_is_declared_with_using_export_and_can_only_be_used_with_a_default_import_when_using_the_0_flag: DiagnosticMessage;
    JSX_element_attributes_type_0_may_not_be_a_union_type: DiagnosticMessage;
    The_return_type_of_a_JSX_element_constructor_must_return_an_object_type: DiagnosticMessage;
    JSX_element_implicitly_has_type_any_because_the_global_type_JSX_Element_does_not_exist: DiagnosticMessage;
    Property_0_in_type_1_is_not_assignable_to_type_2: DiagnosticMessage;
    JSX_element_type_0_does_not_have_any_construct_or_call_signatures: DiagnosticMessage;
    JSX_element_type_0_is_not_a_constructor_function_for_JSX_elements: DiagnosticMessage;
    Property_0_of_JSX_spread_attribute_is_not_assignable_to_target_property: DiagnosticMessage;
    JSX_element_class_does_not_support_attributes_because_it_does_not_have_a_0_property: DiagnosticMessage;
    The_global_type_JSX_0_may_not_have_more_than_one_property: DiagnosticMessage;
    JSX_spread_child_must_be_an_array_type: DiagnosticMessage;
    Cannot_augment_module_0_with_value_exports_because_it_resolves_to_a_non_module_entity: DiagnosticMessage;
    A_member_initializer_in_a_enum_declaration_cannot_reference_members_declared_after_it_including_members_defined_in_other_enums: DiagnosticMessage;
    Merged_declaration_0_cannot_include_a_default_export_declaration_Consider_adding_a_separate_export_default_0_declaration_instead: DiagnosticMessage;
    Non_abstract_class_expression_does_not_implement_inherited_abstract_member_0_from_class_1: DiagnosticMessage;
    Exported_external_package_typings_file_cannot_contain_tripleslash_references_Please_contact_the_package_author_to_update_the_package_definition: DiagnosticMessage;
    Exported_external_package_typings_file_0_is_not_a_module_Please_contact_the_package_author_to_update_the_package_definition: DiagnosticMessage;
    JSX_expressions_must_have_one_parent_element: DiagnosticMessage;
    Type_0_provides_no_match_for_the_signature_1: DiagnosticMessage;
    super_is_only_allowed_in_members_of_object_literal_expressions_when_option_target_is_ES2015_or_higher: DiagnosticMessage;
    super_can_only_be_referenced_in_members_of_derived_classes_or_object_literal_expressions: DiagnosticMessage;
    Cannot_export_0_Only_local_declarations_can_be_exported_from_a_module: DiagnosticMessage;
    Cannot_find_name_0_Did_you_mean_the_static_member_1_0: DiagnosticMessage;
    Cannot_find_name_0_Did_you_mean_the_instance_member_this_0: DiagnosticMessage;
    Invalid_module_name_in_augmentation_module_0_cannot_be_found: DiagnosticMessage;
    Invalid_module_name_in_augmentation_Module_0_resolves_to_an_untyped_module_at_1_which_cannot_be_augmented: DiagnosticMessage;
    Exports_and_export_assignments_are_not_permitted_in_module_augmentations: DiagnosticMessage;
    Imports_are_not_permitted_in_module_augmentations_Consider_moving_them_to_the_enclosing_external_module: DiagnosticMessage;
    export_modifier_cannot_be_applied_to_ambient_modules_and_module_augmentations_since_they_are_always_visible: DiagnosticMessage;
    Augmentations_for_the_global_scope_can_only_be_directly_nested_in_external_modules_or_ambient_module_declarations: DiagnosticMessage;
    Augmentations_for_the_global_scope_should_have_declare_modifier_unless_they_appear_in_already_ambient_context: DiagnosticMessage;
    Cannot_augment_module_0_because_it_resolves_to_a_non_module_entity: DiagnosticMessage;
    Cannot_assign_a_0_constructor_type_to_a_1_constructor_type: DiagnosticMessage;
    Constructor_of_class_0_is_private_and_only_accessible_within_the_class_declaration: DiagnosticMessage;
    Constructor_of_class_0_is_protected_and_only_accessible_within_the_class_declaration: DiagnosticMessage;
    Cannot_extend_a_class_0_Class_constructor_is_marked_as_private: DiagnosticMessage;
    Accessors_must_both_be_abstract_or_non_abstract: DiagnosticMessage;
    A_type_predicate_s_type_must_be_assignable_to_its_parameter_s_type: DiagnosticMessage;
    Type_0_is_not_comparable_to_type_1: DiagnosticMessage;
    A_function_that_is_called_with_the_new_keyword_cannot_have_a_this_type_that_is_void: DiagnosticMessage;
    A_0_parameter_must_be_the_first_parameter: DiagnosticMessage;
    A_constructor_cannot_have_a_this_parameter: DiagnosticMessage;
    get_and_set_accessor_must_have_the_same_this_type: DiagnosticMessage;
    this_implicitly_has_type_any_because_it_does_not_have_a_type_annotation: DiagnosticMessage;
    The_this_context_of_type_0_is_not_assignable_to_method_s_this_of_type_1: DiagnosticMessage;
    The_this_types_of_each_signature_are_incompatible: DiagnosticMessage;
    _0_refers_to_a_UMD_global_but_the_current_file_is_a_module_Consider_adding_an_import_instead: DiagnosticMessage;
    All_declarations_of_0_must_have_identical_modifiers: DiagnosticMessage;
    Cannot_find_type_definition_file_for_0: DiagnosticMessage;
    Cannot_extend_an_interface_0_Did_you_mean_implements: DiagnosticMessage;
    An_import_path_cannot_end_with_a_0_extension_Consider_importing_1_instead: DiagnosticMessage;
    _0_is_a_primitive_but_1_is_a_wrapper_object_Prefer_using_0_when_possible: DiagnosticMessage;
    _0_only_refers_to_a_type_but_is_being_used_as_a_value_here: DiagnosticMessage;
    Namespace_0_has_no_exported_member_1: DiagnosticMessage;
    Left_side_of_comma_operator_is_unused_and_has_no_side_effects: DiagnosticMessage;
    The_Object_type_is_assignable_to_very_few_other_types_Did_you_mean_to_use_the_any_type_instead: DiagnosticMessage;
    An_async_function_or_method_must_return_a_Promise_Make_sure_you_have_a_declaration_for_Promise_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
    Spread_types_may_only_be_created_from_object_types: DiagnosticMessage;
    Static_property_0_conflicts_with_built_in_property_Function_0_of_constructor_function_1: DiagnosticMessage;
    Rest_types_may_only_be_created_from_object_types: DiagnosticMessage;
    The_target_of_an_object_rest_assignment_must_be_a_variable_or_a_property_access: DiagnosticMessage;
    _0_only_refers_to_a_type_but_is_being_used_as_a_namespace_here: DiagnosticMessage;
    The_operand_of_a_delete_operator_must_be_a_property_reference: DiagnosticMessage;
    The_operand_of_a_delete_operator_cannot_be_a_read_only_property: DiagnosticMessage;
    An_async_function_or_method_in_ES5_SlashES3_requires_the_Promise_constructor_Make_sure_you_have_a_declaration_for_the_Promise_constructor_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
    Required_type_parameters_may_not_follow_optional_type_parameters: DiagnosticMessage;
    Generic_type_0_requires_between_1_and_2_type_arguments: DiagnosticMessage;
    Cannot_use_namespace_0_as_a_value: DiagnosticMessage;
    Cannot_use_namespace_0_as_a_type: DiagnosticMessage;
    _0_are_specified_twice_The_attribute_named_0_will_be_overwritten: DiagnosticMessage;
    A_dynamic_import_call_returns_a_Promise_Make_sure_you_have_a_declaration_for_Promise_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
    A_dynamic_import_call_in_ES5_SlashES3_requires_the_Promise_constructor_Make_sure_you_have_a_declaration_for_the_Promise_constructor_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
    Cannot_access_0_1_because_0_is_a_type_but_not_a_namespace_Did_you_mean_to_retrieve_the_type_of_the_property_1_in_0_with_0_1: DiagnosticMessage;
    The_expression_of_an_export_assignment_must_be_an_identifier_or_qualified_name_in_an_ambient_context: DiagnosticMessage;
    Abstract_property_0_in_class_1_cannot_be_accessed_in_the_constructor: DiagnosticMessage;
    Type_parameter_0_has_a_circular_default: DiagnosticMessage;
    Subsequent_property_declarations_must_have_the_same_type_Property_0_must_be_of_type_1_but_here_has_type_2: DiagnosticMessage;
    Duplicate_property_0: DiagnosticMessage;
    Type_0_is_not_assignable_to_type_1_Two_different_types_with_this_name_exist_but_they_are_unrelated: DiagnosticMessage;
    Class_0_incorrectly_implements_class_1_Did_you_mean_to_extend_1_and_inherit_its_members_as_a_subclass: DiagnosticMessage;
    Cannot_invoke_an_object_which_is_possibly_null: DiagnosticMessage;
    Cannot_invoke_an_object_which_is_possibly_undefined: DiagnosticMessage;
    Cannot_invoke_an_object_which_is_possibly_null_or_undefined: DiagnosticMessage;
    Module_0_has_no_exported_member_1_Did_you_mean_2: DiagnosticMessage;
    Class_name_cannot_be_Object_when_targeting_ES5_with_module_0: DiagnosticMessage;
    Cannot_find_lib_definition_for_0: DiagnosticMessage;
    Cannot_find_lib_definition_for_0_Did_you_mean_1: DiagnosticMessage;
    _0_is_declared_here: DiagnosticMessage;
    Property_0_is_used_before_its_initialization: DiagnosticMessage;
    An_arrow_function_cannot_have_a_this_parameter: DiagnosticMessage;
    Implicit_conversion_of_a_symbol_to_a_string_will_fail_at_runtime_Consider_wrapping_this_expression_in_String: DiagnosticMessage;
    Cannot_find_module_0_Consider_using_resolveJsonModule_to_import_module_with_json_extension: DiagnosticMessage;
    Property_0_was_also_declared_here: DiagnosticMessage;
    It_is_highly_likely_that_you_are_missing_a_semicolon: DiagnosticMessage;
    Did_you_mean_for_0_to_be_constrained_to_type_new_args_Colon_any_1: DiagnosticMessage;
    Operator_0_cannot_be_applied_to_type_1: DiagnosticMessage;
    BigInt_literals_are_not_available_when_targeting_lower_than_ESNext: DiagnosticMessage;
    An_outer_value_of_this_is_shadowed_by_this_container: DiagnosticMessage;
    Type_0_is_missing_the_following_properties_from_type_1_Colon_2: DiagnosticMessage;
    Type_0_is_missing_the_following_properties_from_type_1_Colon_2_and_3_more: DiagnosticMessage;
    Property_0_is_missing_in_type_1_but_required_in_type_2: DiagnosticMessage;
    The_inferred_type_of_0_cannot_be_named_without_a_reference_to_1_This_is_likely_not_portable_A_type_annotation_is_necessary: DiagnosticMessage;
    No_overload_expects_0_type_arguments_but_overloads_do_exist_that_expect_either_1_or_2_type_arguments: DiagnosticMessage;
    Type_parameter_defaults_can_only_reference_previously_declared_type_parameters: DiagnosticMessage;
    This_JSX_tag_s_0_prop_expects_type_1_which_requires_multiple_children_but_only_a_single_child_was_provided: DiagnosticMessage;
    This_JSX_tag_s_0_prop_expects_a_single_child_of_type_1_but_multiple_children_were_provided: DiagnosticMessage;
    _0_components_don_t_accept_text_as_child_elements_Text_in_JSX_has_the_type_string_but_the_expected_type_of_1_is_2: DiagnosticMessage;
    Cannot_access_ambient_const_enums_when_the_isolatedModules_flag_is_provided: DiagnosticMessage;
    _0_refers_to_a_value_but_is_being_used_as_a_type_here: DiagnosticMessage;
    The_implementation_signature_is_declared_here: DiagnosticMessage;
    Circularity_originates_in_type_at_this_location: DiagnosticMessage;
    The_first_export_default_is_here: DiagnosticMessage;
    Another_export_default_is_here: DiagnosticMessage;
    super_may_not_use_type_arguments: DiagnosticMessage;
    No_constituent_of_type_0_is_callable: DiagnosticMessage;
    Not_all_constituents_of_type_0_are_callable: DiagnosticMessage;
    Type_0_has_no_call_signatures: DiagnosticMessage;
    Each_member_of_the_union_type_0_has_signatures_but_none_of_those_signatures_are_compatible_with_each_other: DiagnosticMessage;
    No_constituent_of_type_0_is_constructable: DiagnosticMessage;
    Not_all_constituents_of_type_0_are_constructable: DiagnosticMessage;
    Type_0_has_no_construct_signatures: DiagnosticMessage;
    Each_member_of_the_union_type_0_has_construct_signatures_but_none_of_those_signatures_are_compatible_with_each_other: DiagnosticMessage;
    Cannot_iterate_value_because_the_next_method_of_its_iterator_expects_type_1_but_for_of_will_always_send_0: DiagnosticMessage;
    Cannot_iterate_value_because_the_next_method_of_its_iterator_expects_type_1_but_array_spread_will_always_send_0: DiagnosticMessage;
    Cannot_iterate_value_because_the_next_method_of_its_iterator_expects_type_1_but_array_destructuring_will_always_send_0: DiagnosticMessage;
    Cannot_delegate_iteration_to_value_because_the_next_method_of_its_iterator_expects_type_1_but_the_containing_generator_will_always_send_0: DiagnosticMessage;
    The_0_property_of_an_iterator_must_be_a_method: DiagnosticMessage;
    The_0_property_of_an_async_iterator_must_be_a_method: DiagnosticMessage;
    No_overload_matches_this_call: DiagnosticMessage;
    The_last_overload_gave_the_following_error: DiagnosticMessage;
    The_last_overload_is_declared_here: DiagnosticMessage;
    Overload_0_of_1_2_gave_the_following_error: DiagnosticMessage;
    Did_you_forget_to_use_await: DiagnosticMessage;
    Import_declaration_0_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_public_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_method_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_exported_function_has_or_is_using_private_name_1: DiagnosticMessage;
    Implements_clause_of_exported_class_0_has_or_is_using_private_name_1: DiagnosticMessage;
    extends_clause_of_exported_class_0_has_or_is_using_private_name_1: DiagnosticMessage;
    extends_clause_of_exported_interface_0_has_or_is_using_private_name_1: DiagnosticMessage;
    Exported_variable_0_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Exported_variable_0_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Exported_variable_0_has_or_is_using_private_name_1: DiagnosticMessage;
    Public_static_property_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Public_static_property_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Public_static_property_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Public_property_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Public_property_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Public_property_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Property_0_of_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Property_0_of_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_type_of_public_static_setter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_type_of_public_static_setter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_type_of_public_setter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_type_of_public_setter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Return_type_of_public_static_getter_0_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Return_type_of_public_static_getter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Return_type_of_public_static_getter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Return_type_of_public_getter_0_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Return_type_of_public_getter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Return_type_of_public_getter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
    Return_type_of_call_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
    Return_type_of_index_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
    Return_type_of_public_static_method_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named: DiagnosticMessage;
    Return_type_of_public_static_method_from_exported_class_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_name_0: DiagnosticMessage;
    Return_type_of_public_method_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named: DiagnosticMessage;
    Return_type_of_public_method_from_exported_class_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_public_method_from_exported_class_has_or_is_using_private_name_0: DiagnosticMessage;
    Return_type_of_method_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_method_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
    Return_type_of_exported_function_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named: DiagnosticMessage;
    Return_type_of_exported_function_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
    Return_type_of_exported_function_has_or_is_using_private_name_0: DiagnosticMessage;
    Parameter_0_of_constructor_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Parameter_0_of_constructor_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_constructor_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_0_of_public_method_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Parameter_0_of_public_method_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_public_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_0_of_method_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_method_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Parameter_0_of_exported_function_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Parameter_0_of_exported_function_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_exported_function_has_or_is_using_private_name_1: DiagnosticMessage;
    Exported_type_alias_0_has_or_is_using_private_name_1: DiagnosticMessage;
    Default_export_of_the_module_has_or_is_using_private_name_0: DiagnosticMessage;
    Type_parameter_0_of_exported_type_alias_has_or_is_using_private_name_1: DiagnosticMessage;
    Conflicting_definitions_for_0_found_at_1_and_2_Consider_installing_a_specific_version_of_this_library_to_resolve_the_conflict: DiagnosticMessage;
    Parameter_0_of_index_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Parameter_0_of_index_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Property_0_of_exported_class_expression_may_not_be_private_or_protected: DiagnosticMessage;
    Public_static_method_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Public_static_method_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Public_static_method_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Public_method_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
    Public_method_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Public_method_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
    Method_0_of_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
    Method_0_of_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
    Type_parameter_0_of_exported_mapped_object_type_is_using_private_name_1: DiagnosticMessage;
    The_type_0_is_readonly_and_cannot_be_assigned_to_the_mutable_type_1: DiagnosticMessage;
    Private_or_protected_member_0_cannot_be_accessed_on_a_type_parameter: DiagnosticMessage;
    The_current_host_does_not_support_the_0_option: DiagnosticMessage;
    Cannot_find_the_common_subdirectory_path_for_the_input_files: DiagnosticMessage;
    File_specification_cannot_end_in_a_recursive_directory_wildcard_Asterisk_Asterisk_Colon_0: DiagnosticMessage;
    Cannot_read_file_0_Colon_1: DiagnosticMessage;
    Failed_to_parse_file_0_Colon_1: DiagnosticMessage;
    Unknown_compiler_option_0: DiagnosticMessage;
    Compiler_option_0_requires_a_value_of_type_1: DiagnosticMessage;
    Could_not_write_file_0_Colon_1: DiagnosticMessage;
    Option_project_cannot_be_mixed_with_source_files_on_a_command_line: DiagnosticMessage;
    Option_isolatedModules_can_only_be_used_when_either_option_module_is_provided_or_option_target_is_ES2015_or_higher: DiagnosticMessage;
    Option_0_can_only_be_used_when_either_option_inlineSourceMap_or_option_sourceMap_is_provided: DiagnosticMessage;
    Option_0_cannot_be_specified_without_specifying_option_1: DiagnosticMessage;
    Option_0_cannot_be_specified_with_option_1: DiagnosticMessage;
    A_tsconfig_json_file_is_already_defined_at_Colon_0: DiagnosticMessage;
    Cannot_write_file_0_because_it_would_overwrite_input_file: DiagnosticMessage;
    Cannot_write_file_0_because_it_would_be_overwritten_by_multiple_input_files: DiagnosticMessage;
    Cannot_find_a_tsconfig_json_file_at_the_specified_directory_Colon_0: DiagnosticMessage;
    The_specified_path_does_not_exist_Colon_0: DiagnosticMessage;
    Invalid_value_for_reactNamespace_0_is_not_a_valid_identifier: DiagnosticMessage;
    Option_paths_cannot_be_used_without_specifying_baseUrl_option: DiagnosticMessage;
    Pattern_0_can_have_at_most_one_Asterisk_character: DiagnosticMessage;
    Substitution_0_in_pattern_1_in_can_have_at_most_one_Asterisk_character: DiagnosticMessage;
    Substitutions_for_pattern_0_should_be_an_array: DiagnosticMessage;
    Substitution_0_for_pattern_1_has_incorrect_type_expected_string_got_2: DiagnosticMessage;
    File_specification_cannot_contain_a_parent_directory_that_appears_after_a_recursive_directory_wildcard_Asterisk_Asterisk_Colon_0: DiagnosticMessage;
    Substitutions_for_pattern_0_shouldn_t_be_an_empty_array: DiagnosticMessage;
    Invalid_value_for_jsxFactory_0_is_not_a_valid_identifier_or_qualified_name: DiagnosticMessage;
    Adding_a_tsconfig_json_file_will_help_organize_projects_that_contain_both_TypeScript_and_JavaScript_files_Learn_more_at_https_Colon_Slash_Slashaka_ms_Slashtsconfig: DiagnosticMessage;
    Option_0_cannot_be_specified_without_specifying_option_1_or_option_2: DiagnosticMessage;
    Option_resolveJsonModule_cannot_be_specified_without_node_module_resolution_strategy: DiagnosticMessage;
    Option_resolveJsonModule_can_only_be_specified_when_module_code_generation_is_commonjs_amd_es2015_or_esNext: DiagnosticMessage;
    Unknown_build_option_0: DiagnosticMessage;
    Build_option_0_requires_a_value_of_type_1: DiagnosticMessage;
    Option_incremental_can_only_be_specified_using_tsconfig_emitting_to_single_file_or_when_option_tsBuildInfoFile_is_specified: DiagnosticMessage;
    _0_is_assignable_to_the_constraint_of_type_1_but_1_could_be_instantiated_with_a_different_subtype_of_constraint_2: DiagnosticMessage;
    Generates_a_sourcemap_for_each_corresponding_d_ts_file: DiagnosticMessage;
    Concatenate_and_emit_output_to_single_file: DiagnosticMessage;
    Generates_corresponding_d_ts_file: DiagnosticMessage;
    Specify_the_location_where_debugger_should_locate_map_files_instead_of_generated_locations: DiagnosticMessage;
    Specify_the_location_where_debugger_should_locate_TypeScript_files_instead_of_source_locations: DiagnosticMessage;
    Watch_input_files: DiagnosticMessage;
    Redirect_output_structure_to_the_directory: DiagnosticMessage;
    Do_not_erase_const_enum_declarations_in_generated_code: DiagnosticMessage;
    Do_not_emit_outputs_if_any_errors_were_reported: DiagnosticMessage;
    Do_not_emit_comments_to_output: DiagnosticMessage;
    Do_not_emit_outputs: DiagnosticMessage;
    Allow_default_imports_from_modules_with_no_default_export_This_does_not_affect_code_emit_just_typechecking: DiagnosticMessage;
    Skip_type_checking_of_declaration_files: DiagnosticMessage;
    Do_not_resolve_the_real_path_of_symlinks: DiagnosticMessage;
    Only_emit_d_ts_declaration_files: DiagnosticMessage;
    Specify_ECMAScript_target_version_Colon_ES3_default_ES5_ES2015_ES2016_ES2017_ES2018_ES2019_or_ESNEXT: DiagnosticMessage;
    Specify_module_code_generation_Colon_none_commonjs_amd_system_umd_es2015_or_ESNext: DiagnosticMessage;
    Print_this_message: DiagnosticMessage;
    Print_the_compiler_s_version: DiagnosticMessage;
    Compile_the_project_given_the_path_to_its_configuration_file_or_to_a_folder_with_a_tsconfig_json: DiagnosticMessage;
    Syntax_Colon_0: DiagnosticMessage;
    options: DiagnosticMessage;
    file: DiagnosticMessage;
    Examples_Colon_0: DiagnosticMessage;
    Options_Colon: DiagnosticMessage;
    Version_0: DiagnosticMessage;
    Insert_command_line_options_and_files_from_a_file: DiagnosticMessage;
    Starting_compilation_in_watch_mode: DiagnosticMessage;
    File_change_detected_Starting_incremental_compilation: DiagnosticMessage;
    KIND: DiagnosticMessage;
    FILE: DiagnosticMessage;
    VERSION: DiagnosticMessage;
    LOCATION: DiagnosticMessage;
    DIRECTORY: DiagnosticMessage;
    STRATEGY: DiagnosticMessage;
    FILE_OR_DIRECTORY: DiagnosticMessage;
    Generates_corresponding_map_file: DiagnosticMessage;
    Compiler_option_0_expects_an_argument: DiagnosticMessage;
    Unterminated_quoted_string_in_response_file_0: DiagnosticMessage;
    Argument_for_0_option_must_be_Colon_1: DiagnosticMessage;
    Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1: DiagnosticMessage;
    Unsupported_locale_0: DiagnosticMessage;
    Unable_to_open_file_0: DiagnosticMessage;
    Corrupted_locale_file_0: DiagnosticMessage;
    Raise_error_on_expressions_and_declarations_with_an_implied_any_type: DiagnosticMessage;
    File_0_not_found: DiagnosticMessage;
    File_0_has_unsupported_extension_The_only_supported_extensions_are_1: DiagnosticMessage;
    Suppress_noImplicitAny_errors_for_indexing_objects_lacking_index_signatures: DiagnosticMessage;
    Do_not_emit_declarations_for_code_that_has_an_internal_annotation: DiagnosticMessage;
    Specify_the_root_directory_of_input_files_Use_to_control_the_output_directory_structure_with_outDir: DiagnosticMessage;
    File_0_is_not_under_rootDir_1_rootDir_is_expected_to_contain_all_source_files: DiagnosticMessage;
    Specify_the_end_of_line_sequence_to_be_used_when_emitting_files_Colon_CRLF_dos_or_LF_unix: DiagnosticMessage;
    NEWLINE: DiagnosticMessage;
    Option_0_can_only_be_specified_in_tsconfig_json_file: DiagnosticMessage;
    Enables_experimental_support_for_ES7_decorators: DiagnosticMessage;
    Enables_experimental_support_for_emitting_type_metadata_for_decorators: DiagnosticMessage;
    Enables_experimental_support_for_ES7_async_functions: DiagnosticMessage;
    Specify_module_resolution_strategy_Colon_node_Node_js_or_classic_TypeScript_pre_1_6: DiagnosticMessage;
    Initializes_a_TypeScript_project_and_creates_a_tsconfig_json_file: DiagnosticMessage;
    Successfully_created_a_tsconfig_json_file: DiagnosticMessage;
    Suppress_excess_property_checks_for_object_literals: DiagnosticMessage;
    Stylize_errors_and_messages_using_color_and_context_experimental: DiagnosticMessage;
    Do_not_report_errors_on_unused_labels: DiagnosticMessage;
    Report_error_when_not_all_code_paths_in_function_return_a_value: DiagnosticMessage;
    Report_errors_for_fallthrough_cases_in_switch_statement: DiagnosticMessage;
    Do_not_report_errors_on_unreachable_code: DiagnosticMessage;
    Disallow_inconsistently_cased_references_to_the_same_file: DiagnosticMessage;
    Specify_library_files_to_be_included_in_the_compilation: DiagnosticMessage;
    Specify_JSX_code_generation_Colon_preserve_react_native_or_react: DiagnosticMessage;
    File_0_has_an_unsupported_extension_so_skipping_it: DiagnosticMessage;
    Only_amd_and_system_modules_are_supported_alongside_0: DiagnosticMessage;
    Base_directory_to_resolve_non_absolute_module_names: DiagnosticMessage;
    Deprecated_Use_jsxFactory_instead_Specify_the_object_invoked_for_createElement_when_targeting_react_JSX_emit: DiagnosticMessage;
    Enable_tracing_of_the_name_resolution_process: DiagnosticMessage;
    Resolving_module_0_from_1: DiagnosticMessage;
    Explicitly_specified_module_resolution_kind_Colon_0: DiagnosticMessage;
    Module_resolution_kind_is_not_specified_using_0: DiagnosticMessage;
    Module_name_0_was_successfully_resolved_to_1: DiagnosticMessage;
    Module_name_0_was_not_resolved: DiagnosticMessage;
    paths_option_is_specified_looking_for_a_pattern_to_match_module_name_0: DiagnosticMessage;
    Module_name_0_matched_pattern_1: DiagnosticMessage;
    Trying_substitution_0_candidate_module_location_Colon_1: DiagnosticMessage;
    Resolving_module_name_0_relative_to_base_url_1_2: DiagnosticMessage;
    Loading_module_as_file_Slash_folder_candidate_module_location_0_target_file_type_1: DiagnosticMessage;
    File_0_does_not_exist: DiagnosticMessage;
    File_0_exist_use_it_as_a_name_resolution_result: DiagnosticMessage;
    Loading_module_0_from_node_modules_folder_target_file_type_1: DiagnosticMessage;
    Found_package_json_at_0: DiagnosticMessage;
    package_json_does_not_have_a_0_field: DiagnosticMessage;
    package_json_has_0_field_1_that_references_2: DiagnosticMessage;
    Allow_javascript_files_to_be_compiled: DiagnosticMessage;
    Option_0_should_have_array_of_strings_as_a_value: DiagnosticMessage;
    Checking_if_0_is_the_longest_matching_prefix_for_1_2: DiagnosticMessage;
    Expected_type_of_0_field_in_package_json_to_be_1_got_2: DiagnosticMessage;
    baseUrl_option_is_set_to_0_using_this_value_to_resolve_non_relative_module_name_1: DiagnosticMessage;
    rootDirs_option_is_set_using_it_to_resolve_relative_module_name_0: DiagnosticMessage;
    Longest_matching_prefix_for_0_is_1: DiagnosticMessage;
    Loading_0_from_the_root_dir_1_candidate_location_2: DiagnosticMessage;
    Trying_other_entries_in_rootDirs: DiagnosticMessage;
    Module_resolution_using_rootDirs_has_failed: DiagnosticMessage;
    Do_not_emit_use_strict_directives_in_module_output: DiagnosticMessage;
    Enable_strict_null_checks: DiagnosticMessage;
    Unknown_option_excludes_Did_you_mean_exclude: DiagnosticMessage;
    Raise_error_on_this_expressions_with_an_implied_any_type: DiagnosticMessage;
    Resolving_type_reference_directive_0_containing_file_1_root_directory_2: DiagnosticMessage;
    Resolving_using_primary_search_paths: DiagnosticMessage;
    Resolving_from_node_modules_folder: DiagnosticMessage;
    Type_reference_directive_0_was_successfully_resolved_to_1_primary_Colon_2: DiagnosticMessage;
    Type_reference_directive_0_was_not_resolved: DiagnosticMessage;
    Resolving_with_primary_search_path_0: DiagnosticMessage;
    Root_directory_cannot_be_determined_skipping_primary_search_paths: DiagnosticMessage;
    Resolving_type_reference_directive_0_containing_file_1_root_directory_not_set: DiagnosticMessage;
    Type_declaration_files_to_be_included_in_compilation: DiagnosticMessage;
    Looking_up_in_node_modules_folder_initial_location_0: DiagnosticMessage;
    Containing_file_is_not_specified_and_root_directory_cannot_be_determined_skipping_lookup_in_node_modules_folder: DiagnosticMessage;
    Resolving_type_reference_directive_0_containing_file_not_set_root_directory_1: DiagnosticMessage;
    Resolving_type_reference_directive_0_containing_file_not_set_root_directory_not_set: DiagnosticMessage;
    Resolving_real_path_for_0_result_1: DiagnosticMessage;
    Cannot_compile_modules_using_option_0_unless_the_module_flag_is_amd_or_system: DiagnosticMessage;
    File_name_0_has_a_1_extension_stripping_it: DiagnosticMessage;
    _0_is_declared_but_its_value_is_never_read: DiagnosticMessage;
    Report_errors_on_unused_locals: DiagnosticMessage;
    Report_errors_on_unused_parameters: DiagnosticMessage;
    The_maximum_dependency_depth_to_search_under_node_modules_and_load_JavaScript_files: DiagnosticMessage;
    Cannot_import_type_declaration_files_Consider_importing_0_instead_of_1: DiagnosticMessage;
    Property_0_is_declared_but_its_value_is_never_read: DiagnosticMessage;
    Import_emit_helpers_from_tslib: DiagnosticMessage;
    Auto_discovery_for_typings_is_enabled_in_project_0_Running_extra_resolution_pass_for_module_1_using_cache_location_2: DiagnosticMessage;
    Parse_in_strict_mode_and_emit_use_strict_for_each_source_file: DiagnosticMessage;
    Module_0_was_resolved_to_1_but_jsx_is_not_set: DiagnosticMessage;
    Module_0_was_resolved_as_locally_declared_ambient_module_in_file_1: DiagnosticMessage;
    Module_0_was_resolved_as_ambient_module_declared_in_1_since_this_file_was_not_modified: DiagnosticMessage;
    Specify_the_JSX_factory_function_to_use_when_targeting_react_JSX_emit_e_g_React_createElement_or_h: DiagnosticMessage;
    Resolution_for_module_0_was_found_in_cache_from_location_1: DiagnosticMessage;
    Directory_0_does_not_exist_skipping_all_lookups_in_it: DiagnosticMessage;
    Show_diagnostic_information: DiagnosticMessage;
    Show_verbose_diagnostic_information: DiagnosticMessage;
    Emit_a_single_file_with_source_maps_instead_of_having_a_separate_file: DiagnosticMessage;
    Emit_the_source_alongside_the_sourcemaps_within_a_single_file_requires_inlineSourceMap_or_sourceMap_to_be_set: DiagnosticMessage;
    Transpile_each_file_as_a_separate_module_similar_to_ts_transpileModule: DiagnosticMessage;
    Print_names_of_generated_files_part_of_the_compilation: DiagnosticMessage;
    Print_names_of_files_part_of_the_compilation: DiagnosticMessage;
    The_locale_used_when_displaying_messages_to_the_user_e_g_en_us: DiagnosticMessage;
    Do_not_generate_custom_helper_functions_like_extends_in_compiled_output: DiagnosticMessage;
    Do_not_include_the_default_library_file_lib_d_ts: DiagnosticMessage;
    Do_not_add_triple_slash_references_or_imported_modules_to_the_list_of_compiled_files: DiagnosticMessage;
    Deprecated_Use_skipLibCheck_instead_Skip_type_checking_of_default_library_declaration_files: DiagnosticMessage;
    List_of_folders_to_include_type_definitions_from: DiagnosticMessage;
    Disable_size_limitations_on_JavaScript_projects: DiagnosticMessage;
    The_character_set_of_the_input_files: DiagnosticMessage;
    Emit_a_UTF_8_Byte_Order_Mark_BOM_in_the_beginning_of_output_files: DiagnosticMessage;
    Do_not_truncate_error_messages: DiagnosticMessage;
    Output_directory_for_generated_declaration_files: DiagnosticMessage;
    A_series_of_entries_which_re_map_imports_to_lookup_locations_relative_to_the_baseUrl: DiagnosticMessage;
    List_of_root_folders_whose_combined_content_represents_the_structure_of_the_project_at_runtime: DiagnosticMessage;
    Show_all_compiler_options: DiagnosticMessage;
    Deprecated_Use_outFile_instead_Concatenate_and_emit_output_to_single_file: DiagnosticMessage;
    Command_line_Options: DiagnosticMessage;
    Basic_Options: DiagnosticMessage;
    Strict_Type_Checking_Options: DiagnosticMessage;
    Module_Resolution_Options: DiagnosticMessage;
    Source_Map_Options: DiagnosticMessage;
    Additional_Checks: DiagnosticMessage;
    Experimental_Options: DiagnosticMessage;
    Advanced_Options: DiagnosticMessage;
    Provide_full_support_for_iterables_in_for_of_spread_and_destructuring_when_targeting_ES5_or_ES3: DiagnosticMessage;
    Enable_all_strict_type_checking_options: DiagnosticMessage;
    List_of_language_service_plugins: DiagnosticMessage;
    Scoped_package_detected_looking_in_0: DiagnosticMessage;
    Reusing_resolution_of_module_0_to_file_1_from_old_program: DiagnosticMessage;
    Reusing_module_resolutions_originating_in_0_since_resolutions_are_unchanged_from_old_program: DiagnosticMessage;
    Disable_strict_checking_of_generic_signatures_in_function_types: DiagnosticMessage;
    Enable_strict_checking_of_function_types: DiagnosticMessage;
    Enable_strict_checking_of_property_initialization_in_classes: DiagnosticMessage;
    Numeric_separators_are_not_allowed_here: DiagnosticMessage;
    Multiple_consecutive_numeric_separators_are_not_permitted: DiagnosticMessage;
    Whether_to_keep_outdated_console_output_in_watch_mode_instead_of_clearing_the_screen: DiagnosticMessage;
    All_imports_in_import_declaration_are_unused: DiagnosticMessage;
    Found_1_error_Watching_for_file_changes: DiagnosticMessage;
    Found_0_errors_Watching_for_file_changes: DiagnosticMessage;
    Resolve_keyof_to_string_valued_property_names_only_no_numbers_or_symbols: DiagnosticMessage;
    _0_is_declared_but_never_used: DiagnosticMessage;
    Include_modules_imported_with_json_extension: DiagnosticMessage;
    All_destructured_elements_are_unused: DiagnosticMessage;
    All_variables_are_unused: DiagnosticMessage;
    Definitions_of_the_following_identifiers_conflict_with_those_in_another_file_Colon_0: DiagnosticMessage;
    Conflicts_are_in_this_file: DiagnosticMessage;
    _0_was_also_declared_here: DiagnosticMessage;
    and_here: DiagnosticMessage;
    All_type_parameters_are_unused: DiagnosticMessage;
    package_json_has_a_typesVersions_field_with_version_specific_path_mappings: DiagnosticMessage;
    package_json_does_not_have_a_typesVersions_entry_that_matches_version_0: DiagnosticMessage;
    package_json_has_a_typesVersions_entry_0_that_matches_compiler_version_1_looking_for_a_pattern_to_match_module_name_2: DiagnosticMessage;
    package_json_has_a_typesVersions_entry_0_that_is_not_a_valid_semver_range: DiagnosticMessage;
    An_argument_for_0_was_not_provided: DiagnosticMessage;
    An_argument_matching_this_binding_pattern_was_not_provided: DiagnosticMessage;
    Did_you_mean_to_call_this_expression: DiagnosticMessage;
    Did_you_mean_to_use_new_with_this_expression: DiagnosticMessage;
    Enable_strict_bind_call_and_apply_methods_on_functions: DiagnosticMessage;
    Using_compiler_options_of_project_reference_redirect_0: DiagnosticMessage;
    Found_1_error: DiagnosticMessage;
    Found_0_errors: DiagnosticMessage;
    Module_name_0_was_successfully_resolved_to_1_with_Package_ID_2: DiagnosticMessage;
    Type_reference_directive_0_was_successfully_resolved_to_1_with_Package_ID_2_primary_Colon_3: DiagnosticMessage;
    package_json_had_a_falsy_0_field: DiagnosticMessage;
    Projects_to_reference: DiagnosticMessage;
    Enable_project_compilation: DiagnosticMessage;
    Project_references_may_not_form_a_circular_graph_Cycle_detected_Colon_0: DiagnosticMessage;
    Composite_projects_may_not_disable_declaration_emit: DiagnosticMessage;
    Output_file_0_has_not_been_built_from_source_file_1: DiagnosticMessage;
    Referenced_project_0_must_have_setting_composite_Colon_true: DiagnosticMessage;
    File_0_is_not_listed_within_the_file_list_of_project_1_Projects_must_list_all_files_or_use_an_include_pattern: DiagnosticMessage;
    Cannot_prepend_project_0_because_it_does_not_have_outFile_set: DiagnosticMessage;
    Output_file_0_from_project_1_does_not_exist: DiagnosticMessage;
    Project_0_is_out_of_date_because_oldest_output_1_is_older_than_newest_input_2: DiagnosticMessage;
    Project_0_is_up_to_date_because_newest_input_1_is_older_than_oldest_output_2: DiagnosticMessage;
    Project_0_is_out_of_date_because_output_file_1_does_not_exist: DiagnosticMessage;
    Project_0_is_out_of_date_because_its_dependency_1_is_out_of_date: DiagnosticMessage;
    Project_0_is_up_to_date_with_d_ts_files_from_its_dependencies: DiagnosticMessage;
    Projects_in_this_build_Colon_0: DiagnosticMessage;
    A_non_dry_build_would_delete_the_following_files_Colon_0: DiagnosticMessage;
    A_non_dry_build_would_build_project_0: DiagnosticMessage;
    Building_project_0: DiagnosticMessage;
    Updating_output_timestamps_of_project_0: DiagnosticMessage;
    delete_this_Project_0_is_up_to_date_because_it_was_previously_built: DiagnosticMessage;
    Project_0_is_up_to_date: DiagnosticMessage;
    Skipping_build_of_project_0_because_its_dependency_1_has_errors: DiagnosticMessage;
    Project_0_can_t_be_built_because_its_dependency_1_has_errors: DiagnosticMessage;
    Build_one_or_more_projects_and_their_dependencies_if_out_of_date: DiagnosticMessage;
    Delete_the_outputs_of_all_projects: DiagnosticMessage;
    Enable_verbose_logging: DiagnosticMessage;
    Show_what_would_be_built_or_deleted_if_specified_with_clean: DiagnosticMessage;
    Build_all_projects_including_those_that_appear_to_be_up_to_date: DiagnosticMessage;
    Option_build_must_be_the_first_command_line_argument: DiagnosticMessage;
    Options_0_and_1_cannot_be_combined: DiagnosticMessage;
    Updating_unchanged_output_timestamps_of_project_0: DiagnosticMessage;
    Project_0_is_out_of_date_because_output_of_its_dependency_1_has_changed: DiagnosticMessage;
    Updating_output_of_project_0: DiagnosticMessage;
    A_non_dry_build_would_update_timestamps_for_output_of_project_0: DiagnosticMessage;
    A_non_dry_build_would_update_output_of_project_0: DiagnosticMessage;
    Cannot_update_output_of_project_0_because_there_was_error_reading_file_1: DiagnosticMessage;
    Cannot_write_file_0_because_it_will_overwrite_tsbuildinfo_file_generated_by_referenced_project_1: DiagnosticMessage;
    Enable_incremental_compilation: DiagnosticMessage;
    Composite_projects_may_not_disable_incremental_compilation: DiagnosticMessage;
    Specify_file_to_store_incremental_compilation_information: DiagnosticMessage;
    Project_0_is_out_of_date_because_output_for_it_was_generated_with_version_1_that_differs_with_current_version_2: DiagnosticMessage;
    Skipping_build_of_project_0_because_its_dependency_1_was_not_built: DiagnosticMessage;
    Project_0_can_t_be_built_because_its_dependency_1_was_not_built: DiagnosticMessage;
    The_expected_type_comes_from_property_0_which_is_declared_here_on_type_1: DiagnosticMessage;
    The_expected_type_comes_from_this_index_signature: DiagnosticMessage;
    The_expected_type_comes_from_the_return_type_of_this_signature: DiagnosticMessage;
    Variable_0_implicitly_has_an_1_type: DiagnosticMessage;
    Parameter_0_implicitly_has_an_1_type: DiagnosticMessage;
    Member_0_implicitly_has_an_1_type: DiagnosticMessage;
    new_expression_whose_target_lacks_a_construct_signature_implicitly_has_an_any_type: DiagnosticMessage;
    _0_which_lacks_return_type_annotation_implicitly_has_an_1_return_type: DiagnosticMessage;
    Function_expression_which_lacks_return_type_annotation_implicitly_has_an_0_return_type: DiagnosticMessage;
    Construct_signature_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: DiagnosticMessage;
    Function_type_which_lacks_return_type_annotation_implicitly_has_an_0_return_type: DiagnosticMessage;
    Element_implicitly_has_an_any_type_because_index_expression_is_not_of_type_number: DiagnosticMessage;
    Could_not_find_a_declaration_file_for_module_0_1_implicitly_has_an_any_type: DiagnosticMessage;
    Element_implicitly_has_an_any_type_because_type_0_has_no_index_signature: DiagnosticMessage;
    Object_literal_s_property_0_implicitly_has_an_1_type: DiagnosticMessage;
    Rest_parameter_0_implicitly_has_an_any_type: DiagnosticMessage;
    Call_signature_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: DiagnosticMessage;
    _0_implicitly_has_type_any_because_it_does_not_have_a_type_annotation_and_is_referenced_directly_or_indirectly_in_its_own_initializer: DiagnosticMessage;
    _0_implicitly_has_return_type_any_because_it_does_not_have_a_return_type_annotation_and_is_referenced_directly_or_indirectly_in_one_of_its_return_expressions: DiagnosticMessage;
    Function_implicitly_has_return_type_any_because_it_does_not_have_a_return_type_annotation_and_is_referenced_directly_or_indirectly_in_one_of_its_return_expressions: DiagnosticMessage;
    Generator_implicitly_has_yield_type_0_because_it_does_not_yield_any_values_Consider_supplying_a_return_type_annotation: DiagnosticMessage;
    JSX_element_implicitly_has_type_any_because_no_interface_JSX_0_exists: DiagnosticMessage;
    Unreachable_code_detected: DiagnosticMessage;
    Unused_label: DiagnosticMessage;
    Fallthrough_case_in_switch: DiagnosticMessage;
    Not_all_code_paths_return_a_value: DiagnosticMessage;
    Binding_element_0_implicitly_has_an_1_type: DiagnosticMessage;
    Property_0_implicitly_has_type_any_because_its_set_accessor_lacks_a_parameter_type_annotation: DiagnosticMessage;
    Property_0_implicitly_has_type_any_because_its_get_accessor_lacks_a_return_type_annotation: DiagnosticMessage;
    Variable_0_implicitly_has_type_1_in_some_locations_where_its_type_cannot_be_determined: DiagnosticMessage;
    Try_npm_install_types_Slash_1_if_it_exists_or_add_a_new_declaration_d_ts_file_containing_declare_module_0: DiagnosticMessage;
    Dynamic_import_s_specifier_must_be_of_type_string_but_here_has_type_0: DiagnosticMessage;
    Enables_emit_interoperability_between_CommonJS_and_ES_Modules_via_creation_of_namespace_objects_for_all_imports_Implies_allowSyntheticDefaultImports: DiagnosticMessage;
    Type_originates_at_this_import_A_namespace_style_import_cannot_be_called_or_constructed_and_will_cause_a_failure_at_runtime_Consider_using_a_default_import_or_import_require_here_instead: DiagnosticMessage;
    Mapped_object_type_implicitly_has_an_any_template_type: DiagnosticMessage;
    If_the_0_package_actually_exposes_this_module_consider_sending_a_pull_request_to_amend_https_Colon_Slash_Slashgithub_com_SlashDefinitelyTyped_SlashDefinitelyTyped_Slashtree_Slashmaster_Slashtypes_Slash_1: DiagnosticMessage;
    The_containing_arrow_function_captures_the_global_value_of_this: DiagnosticMessage;
    Module_0_was_resolved_to_1_but_resolveJsonModule_is_not_used: DiagnosticMessage;
    Variable_0_implicitly_has_an_1_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
    Parameter_0_implicitly_has_an_1_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
    Member_0_implicitly_has_an_1_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
    Variable_0_implicitly_has_type_1_in_some_locations_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
    Rest_parameter_0_implicitly_has_an_any_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
    Property_0_implicitly_has_type_any_but_a_better_type_for_its_get_accessor_may_be_inferred_from_usage: DiagnosticMessage;
    Property_0_implicitly_has_type_any_but_a_better_type_for_its_set_accessor_may_be_inferred_from_usage: DiagnosticMessage;
    _0_implicitly_has_an_1_return_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
    Parameter_has_a_name_but_no_type_Did_you_mean_0_Colon_1: DiagnosticMessage;
    Element_implicitly_has_an_any_type_because_type_0_has_no_index_signature_Did_you_mean_to_call_1: DiagnosticMessage;
    Element_implicitly_has_an_any_type_because_expression_of_type_0_can_t_be_used_to_index_type_1: DiagnosticMessage;
    No_index_signature_with_a_parameter_of_type_0_was_found_on_type_1: DiagnosticMessage;
    _0_which_lacks_return_type_annotation_implicitly_has_an_1_yield_type: DiagnosticMessage;
    You_cannot_rename_this_element: DiagnosticMessage;
    You_cannot_rename_elements_that_are_defined_in_the_standard_TypeScript_library: DiagnosticMessage;
    import_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    export_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    type_parameter_declarations_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    implements_clauses_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    interface_declarations_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    module_declarations_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    type_aliases_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    _0_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    types_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    type_arguments_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    parameter_modifiers_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    non_null_assertions_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    enum_declarations_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    type_assertion_expressions_can_only_be_used_in_a_ts_file: DiagnosticMessage;
    Octal_literal_types_must_use_ES2015_syntax_Use_the_syntax_0: DiagnosticMessage;
    Octal_literals_are_not_allowed_in_enums_members_initializer_Use_the_syntax_0: DiagnosticMessage;
    Report_errors_in_js_files: DiagnosticMessage;
    JSDoc_types_can_only_be_used_inside_documentation_comments: DiagnosticMessage;
    JSDoc_typedef_tag_should_either_have_a_type_annotation_or_be_followed_by_property_or_member_tags: DiagnosticMessage;
    JSDoc_0_is_not_attached_to_a_class: DiagnosticMessage;
    JSDoc_0_1_does_not_match_the_extends_2_clause: DiagnosticMessage;
    JSDoc_param_tag_has_name_0_but_there_is_no_parameter_with_that_name: DiagnosticMessage;
    Class_declarations_cannot_have_more_than_one_augments_or_extends_tag: DiagnosticMessage;
    Expected_0_type_arguments_provide_these_with_an_extends_tag: DiagnosticMessage;
    Expected_0_1_type_arguments_provide_these_with_an_extends_tag: DiagnosticMessage;
    JSDoc_may_only_appear_in_the_last_parameter_of_a_signature: DiagnosticMessage;
    JSDoc_param_tag_has_name_0_but_there_is_no_parameter_with_that_name_It_would_match_arguments_if_it_had_an_array_type: DiagnosticMessage;
    The_type_of_a_function_declaration_must_match_the_function_s_signature: DiagnosticMessage;
    You_cannot_rename_a_module_via_a_global_import: DiagnosticMessage;
    Qualified_name_0_is_not_allowed_without_a_leading_param_object_1: DiagnosticMessage;
    Only_identifiers_Slashqualified_names_with_optional_type_arguments_are_currently_supported_in_a_class_extends_clause: DiagnosticMessage;
    class_expressions_are_not_currently_supported: DiagnosticMessage;
    Language_service_is_disabled: DiagnosticMessage;
    JSX_attributes_must_only_be_assigned_a_non_empty_expression: DiagnosticMessage;
    JSX_elements_cannot_have_multiple_attributes_with_the_same_name: DiagnosticMessage;
    Expected_corresponding_JSX_closing_tag_for_0: DiagnosticMessage;
    JSX_attribute_expected: DiagnosticMessage;
    Cannot_use_JSX_unless_the_jsx_flag_is_provided: DiagnosticMessage;
    A_constructor_cannot_contain_a_super_call_when_its_class_extends_null: DiagnosticMessage;
    An_unary_expression_with_the_0_operator_is_not_allowed_in_the_left_hand_side_of_an_exponentiation_expression_Consider_enclosing_the_expression_in_parentheses: DiagnosticMessage;
    A_type_assertion_expression_is_not_allowed_in_the_left_hand_side_of_an_exponentiation_expression_Consider_enclosing_the_expression_in_parentheses: DiagnosticMessage;
    JSX_element_0_has_no_corresponding_closing_tag: DiagnosticMessage;
    super_must_be_called_before_accessing_this_in_the_constructor_of_a_derived_class: DiagnosticMessage;
    Unknown_type_acquisition_option_0: DiagnosticMessage;
    super_must_be_called_before_accessing_a_property_of_super_in_the_constructor_of_a_derived_class: DiagnosticMessage;
    _0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2: DiagnosticMessage;
    Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constructor: DiagnosticMessage;
    JSX_fragment_has_no_corresponding_closing_tag: DiagnosticMessage;
    Expected_corresponding_closing_tag_for_JSX_fragment: DiagnosticMessage;
    JSX_fragment_is_not_supported_when_using_jsxFactory: DiagnosticMessage;
    JSX_fragment_is_not_supported_when_using_an_inline_JSX_factory_pragma: DiagnosticMessage;
    Circularity_detected_while_resolving_configuration_Colon_0: DiagnosticMessage;
    A_path_in_an_extends_option_must_be_relative_or_rooted_but_0_is_not: DiagnosticMessage;
    The_files_list_in_config_file_0_is_empty: DiagnosticMessage;
    No_inputs_were_found_in_config_file_0_Specified_include_paths_were_1_and_exclude_paths_were_2: DiagnosticMessage;
    File_is_a_CommonJS_module_it_may_be_converted_to_an_ES6_module: DiagnosticMessage;
    This_constructor_function_may_be_converted_to_a_class_declaration: DiagnosticMessage;
    Import_may_be_converted_to_a_default_import: DiagnosticMessage;
    JSDoc_types_may_be_moved_to_TypeScript_types: DiagnosticMessage;
    require_call_may_be_converted_to_an_import: DiagnosticMessage;
    This_may_be_converted_to_an_async_function: DiagnosticMessage;
    await_has_no_effect_on_the_type_of_this_expression: DiagnosticMessage;
    Add_missing_super_call: DiagnosticMessage;
    Make_super_call_the_first_statement_in_the_constructor: DiagnosticMessage;
    Change_extends_to_implements: DiagnosticMessage;
    Remove_declaration_for_Colon_0: DiagnosticMessage;
    Remove_import_from_0: DiagnosticMessage;
    Implement_interface_0: DiagnosticMessage;
    Implement_inherited_abstract_class: DiagnosticMessage;
    Add_0_to_unresolved_variable: DiagnosticMessage;
    Remove_destructuring: DiagnosticMessage;
    Remove_variable_statement: DiagnosticMessage;
    Remove_template_tag: DiagnosticMessage;
    Remove_type_parameters: DiagnosticMessage;
    Import_0_from_module_1: DiagnosticMessage;
    Change_0_to_1: DiagnosticMessage;
    Add_0_to_existing_import_declaration_from_1: DiagnosticMessage;
    Declare_property_0: DiagnosticMessage;
    Add_index_signature_for_property_0: DiagnosticMessage;
    Disable_checking_for_this_file: DiagnosticMessage;
    Ignore_this_error_message: DiagnosticMessage;
    Initialize_property_0_in_the_constructor: DiagnosticMessage;
    Initialize_static_property_0: DiagnosticMessage;
    Change_spelling_to_0: DiagnosticMessage;
    Declare_method_0: DiagnosticMessage;
    Declare_static_method_0: DiagnosticMessage;
    Prefix_0_with_an_underscore: DiagnosticMessage;
    Rewrite_as_the_indexed_access_type_0: DiagnosticMessage;
    Declare_static_property_0: DiagnosticMessage;
    Call_decorator_expression: DiagnosticMessage;
    Add_async_modifier_to_containing_function: DiagnosticMessage;
    Replace_infer_0_with_unknown: DiagnosticMessage;
    Replace_all_unused_infer_with_unknown: DiagnosticMessage;
    Import_default_0_from_module_1: DiagnosticMessage;
    Add_default_import_0_to_existing_import_declaration_from_1: DiagnosticMessage;
    Add_parameter_name: DiagnosticMessage;
    Convert_function_to_an_ES2015_class: DiagnosticMessage;
    Convert_function_0_to_class: DiagnosticMessage;
    Extract_to_0_in_1: DiagnosticMessage;
    Extract_function: DiagnosticMessage;
    Extract_constant: DiagnosticMessage;
    Extract_to_0_in_enclosing_scope: DiagnosticMessage;
    Extract_to_0_in_1_scope: DiagnosticMessage;
    Annotate_with_type_from_JSDoc: DiagnosticMessage;
    Annotate_with_types_from_JSDoc: DiagnosticMessage;
    Infer_type_of_0_from_usage: DiagnosticMessage;
    Infer_parameter_types_from_usage: DiagnosticMessage;
    Convert_to_default_import: DiagnosticMessage;
    Install_0: DiagnosticMessage;
    Replace_import_with_0: DiagnosticMessage;
    Use_synthetic_default_member: DiagnosticMessage;
    Convert_to_ES6_module: DiagnosticMessage;
    Add_undefined_type_to_property_0: DiagnosticMessage;
    Add_initializer_to_property_0: DiagnosticMessage;
    Add_definite_assignment_assertion_to_property_0: DiagnosticMessage;
    Add_all_missing_members: DiagnosticMessage;
    Infer_all_types_from_usage: DiagnosticMessage;
    Delete_all_unused_declarations: DiagnosticMessage;
    Prefix_all_unused_declarations_with_where_possible: DiagnosticMessage;
    Fix_all_detected_spelling_errors: DiagnosticMessage;
    Add_initializers_to_all_uninitialized_properties: DiagnosticMessage;
    Add_definite_assignment_assertions_to_all_uninitialized_properties: DiagnosticMessage;
    Add_undefined_type_to_all_uninitialized_properties: DiagnosticMessage;
    Change_all_jsdoc_style_types_to_TypeScript: DiagnosticMessage;
    Change_all_jsdoc_style_types_to_TypeScript_and_add_undefined_to_nullable_types: DiagnosticMessage;
    Implement_all_unimplemented_interfaces: DiagnosticMessage;
    Install_all_missing_types_packages: DiagnosticMessage;
    Rewrite_all_as_indexed_access_types: DiagnosticMessage;
    Convert_all_to_default_imports: DiagnosticMessage;
    Make_all_super_calls_the_first_statement_in_their_constructor: DiagnosticMessage;
    Add_qualifier_to_all_unresolved_variables_matching_a_member_name: DiagnosticMessage;
    Change_all_extended_interfaces_to_implements: DiagnosticMessage;
    Add_all_missing_super_calls: DiagnosticMessage;
    Implement_all_inherited_abstract_classes: DiagnosticMessage;
    Add_all_missing_async_modifiers: DiagnosticMessage;
    Add_ts_ignore_to_all_error_messages: DiagnosticMessage;
    Annotate_everything_with_types_from_JSDoc: DiagnosticMessage;
    Add_to_all_uncalled_decorators: DiagnosticMessage;
    Convert_all_constructor_functions_to_classes: DiagnosticMessage;
    Generate_get_and_set_accessors: DiagnosticMessage;
    Convert_require_to_import: DiagnosticMessage;
    Convert_all_require_to_import: DiagnosticMessage;
    Move_to_a_new_file: DiagnosticMessage;
    Remove_unreachable_code: DiagnosticMessage;
    Remove_all_unreachable_code: DiagnosticMessage;
    Add_missing_typeof: DiagnosticMessage;
    Remove_unused_label: DiagnosticMessage;
    Remove_all_unused_labels: DiagnosticMessage;
    Convert_0_to_mapped_object_type: DiagnosticMessage;
    Convert_namespace_import_to_named_imports: DiagnosticMessage;
    Convert_named_imports_to_namespace_import: DiagnosticMessage;
    Add_or_remove_braces_in_an_arrow_function: DiagnosticMessage;
    Add_braces_to_arrow_function: DiagnosticMessage;
    Remove_braces_from_arrow_function: DiagnosticMessage;
    Convert_default_export_to_named_export: DiagnosticMessage;
    Convert_named_export_to_default_export: DiagnosticMessage;
    Add_missing_enum_member_0: DiagnosticMessage;
    Add_all_missing_imports: DiagnosticMessage;
    Convert_to_async_function: DiagnosticMessage;
    Convert_all_to_async_functions: DiagnosticMessage;
    Add_unknown_conversion_for_non_overlapping_types: DiagnosticMessage;
    Add_unknown_to_all_conversions_of_non_overlapping_types: DiagnosticMessage;
    Add_missing_new_operator_to_call: DiagnosticMessage;
    Add_missing_new_operator_to_all_calls: DiagnosticMessage;
    Add_names_to_all_parameters_without_names: DiagnosticMessage;
    Enable_the_experimentalDecorators_option_in_your_configuration_file: DiagnosticMessage;
    Convert_parameters_to_destructured_object: DiagnosticMessage;
    Allow_accessing_UMD_globals_from_modules: DiagnosticMessage;
    Extract_type: DiagnosticMessage;
    Extract_to_type_alias: DiagnosticMessage;
    Extract_to_typedef: DiagnosticMessage;
    Infer_this_type_of_0_from_usage: DiagnosticMessage;
    Add_const_to_unresolved_variable: DiagnosticMessage;
    Add_const_to_all_unresolved_variables: DiagnosticMessage;
    Add_await: DiagnosticMessage;
    Add_await_to_initializer_for_0: DiagnosticMessage;
    Fix_all_expressions_possibly_missing_await: DiagnosticMessage;
    Remove_unnecessary_await: DiagnosticMessage;
    Remove_all_unnecessary_uses_of_await: DiagnosticMessage;
    Enable_the_jsx_flag_in_your_configuration_file: DiagnosticMessage;
    Add_await_to_initializers: DiagnosticMessage;
    No_value_exists_in_scope_for_the_shorthand_property_0_Either_declare_one_or_provide_an_initializer: DiagnosticMessage;
    Classes_may_not_have_a_field_named_constructor: DiagnosticMessage;
    JSX_expressions_may_not_use_the_comma_operator_Did_you_mean_to_write_an_array: DiagnosticMessage;
  };
}
declare namespace ts {
  type ErrorCallback = (message: DiagnosticMessage, length: number) => void;
  function tokenIsIdentifierOrKeyword(token: SyntaxKind): boolean;
  function tokenIsIdentifierOrKeywordOrGreaterThan(token: SyntaxKind): boolean;
  interface Scanner {
    getStartPos(): number;
    getToken(): SyntaxKind;
    getTextPos(): number;
    getTokenPos(): number;
    getTokenText(): string;
    getTokenValue(): string;
    hasUnicodeEscape(): boolean;
    hasExtendedUnicodeEscape(): boolean;
    hasPrecedingLineBreak(): boolean;
    isIdentifier(): boolean;
    isReservedWord(): boolean;
    isUnterminated(): boolean;
    getTokenFlags(): TokenFlags;
    reScanGreaterToken(): SyntaxKind;
    reScanSlashToken(): SyntaxKind;
    reScanTemplateToken(): SyntaxKind;
    scanJsxIdentifier(): SyntaxKind;
    scanJsxAttributeValue(): SyntaxKind;
    reScanJsxToken(): JsxTokenSyntaxKind;
    reScanLessThanToken(): SyntaxKind;
    scanJsxToken(): JsxTokenSyntaxKind;
    scanJsDocToken(): JSDocSyntaxKind;
    scan(): SyntaxKind;
    getText(): string;
    setText(text: string | undefined, start?: number, length?: number): void;
    setOnError(onError: ErrorCallback | undefined): void;
    setScriptTarget(scriptTarget: ScriptTarget): void;
    setLanguageVariant(variant: LanguageVariant): void;
    setTextPos(textPos: number): void;
    setInJSDocType(inType: boolean): void;
    lookAhead<T>(callback: () => T): T;
    scanRange<T>(start: number, length: number, callback: () => T): T;
    tryScan<T>(callback: () => T): T;
  }
  function isUnicodeIdentifierStart(code: number, languageVersion: ScriptTarget | undefined): boolean;
  function tokenToString(t: SyntaxKind): string | undefined;
  function stringToToken(s: string): SyntaxKind | undefined;
  function computeLineStarts(text: string): number[];
  function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number): number;
  function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number, allowEdits?: true): number;
  function computePositionOfLineAndCharacter(lineStarts: ReadonlyArray<number>, line: number, character: number, debugText?: string, allowEdits?: true): number;
  function getLineStarts(sourceFile: SourceFileLike): ReadonlyArray<number>;
  /**
   * We assume the first line starts at position 0 and 'position' is non-negative.
   */
  function computeLineAndCharacterOfPosition(lineStarts: ReadonlyArray<number>, position: number): LineAndCharacter;
  function getLineAndCharacterOfPosition(sourceFile: SourceFileLike, position: number): LineAndCharacter;
  function isWhiteSpaceLike(ch: number): boolean;
  /** Does not include line breaks. For that, see isWhiteSpaceLike. */
  function isWhiteSpaceSingleLine(ch: number): boolean;
  function isLineBreak(ch: number): boolean;
  function isOctalDigit(ch: number): boolean;
  function couldStartTrivia(text: string, pos: number): boolean;
  function skipTrivia(text: string, pos: number, stopAfterLineBreak?: boolean, stopAtComments?: boolean): number;
  function isShebangTrivia(text: string, pos: number): boolean;
  function scanShebangTrivia(text: string, pos: number): number;
  function forEachLeadingCommentRange<U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean) => U): U | undefined;
  function forEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T): U | undefined;
  function forEachTrailingCommentRange<U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean) => U): U | undefined;
  function forEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T): U | undefined;
  function reduceEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T, memo: U) => U, state: T, initial: U): U | undefined;
  function reduceEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T, memo: U) => U, state: T, initial: U): U | undefined;
  function getLeadingCommentRanges(text: string, pos: number): CommentRange[] | undefined;
  function getTrailingCommentRanges(text: string, pos: number): CommentRange[] | undefined;
  /** Optionally, get the shebang */
  function getShebang(text: string): string | undefined;
  function isIdentifierStart(ch: number, languageVersion: ScriptTarget | undefined): boolean;
  function isIdentifierPart(ch: number, languageVersion: ScriptTarget | undefined): boolean;
  function isIdentifierText(name: string, languageVersion: ScriptTarget | undefined): boolean;
  function createScanner(languageVersion: ScriptTarget, skipTrivia: boolean, languageVariant?: LanguageVariant, textInitial?: string, onError?: ErrorCallback, start?: number, length?: number): Scanner;
}
declare namespace ts {
  function isExternalModuleNameRelative(moduleName: string): boolean;
  function sortAndDeduplicateDiagnostics<T extends Diagnostic>(diagnostics: ReadonlyArray<T>): SortedReadonlyArray<T>;
}
declare namespace ts {
  const resolvingEmptyArray: never[];
  const emptyMap: ReadonlyMap<never> & ReadonlyPragmaMap;
  const emptyUnderscoreEscapedMap: ReadonlyUnderscoreEscapedMap<never>;
  const externalHelpersModuleNameText = "tslib";
  const defaultMaximumTruncationLength = 160;
  function getDeclarationOfKind<T extends Declaration>(symbol: Symbol, kind: T["kind"]): T | undefined;
  /** Create a new escaped identifier map. */
  function createUnderscoreEscapedMap<T>(): UnderscoreEscapedMap<T>;
  function hasEntries(map: ReadonlyUnderscoreEscapedMap<any> | undefined): map is ReadonlyUnderscoreEscapedMap<any>;
  function createSymbolTable(symbols?: ReadonlyArray<Symbol>): SymbolTable;
  function toPath(fileName: string, basePath: string | undefined, getCanonicalFileName: (path: string) => string): Path;
  function changesAffectModuleResolution(oldOptions: CompilerOptions, newOptions: CompilerOptions): boolean;
  function optionsHaveModuleResolutionChanges(oldOptions: CompilerOptions, newOptions: CompilerOptions): boolean;
  /**
   * Iterates through the parent chain of a node and performs the callback on each parent until the callback
   * returns a truthy value, then returns that value.
   * If no such value is found, it applies the callback until the parent pointer is undefined or the callback returns "quit"
   * At that point findAncestor returns undefined.
   */
  function findAncestor<T extends Node>(node: Node | undefined, callback: (element: Node) => element is T): T | undefined;
  function findAncestor(node: Node | undefined, callback: (element: Node) => boolean | "quit"): Node | undefined;
  function forEachAncestor<T>(node: Node, callback: (n: Node) => T | undefined | "quit"): T | undefined;
  /**
   * Calls `callback` for each entry in the map, returning the first truthy result.
   * Use `map.forEach` instead for normal iteration.
   */
  function forEachEntry<T, U>(map: ReadonlyUnderscoreEscapedMap<T>, callback: (value: T, key: __String) => U | undefined): U | undefined;
  function forEachEntry<T, U>(map: ReadonlyMap<T>, callback: (value: T, key: string) => U | undefined): U | undefined;
  /** `forEachEntry` for just keys. */
  function forEachKey<T>(map: ReadonlyUnderscoreEscapedMap<{}>, callback: (key: __String) => T | undefined): T | undefined;
  function forEachKey<T>(map: ReadonlyMap<{}>, callback: (key: string) => T | undefined): T | undefined;
  /** Copy entries from `source` to `target`. */
  function copyEntries<T>(source: ReadonlyUnderscoreEscapedMap<T>, target: UnderscoreEscapedMap<T>): void;
  function copyEntries<T>(source: ReadonlyMap<T>, target: Map<T>): void;
  /**
   * Creates a set from the elements of an array.
   *
   * @param array the array of input elements.
   */
  function arrayToSet(array: ReadonlyArray<string>): Map<true>;
  function arrayToSet<T>(array: ReadonlyArray<T>, makeKey: (value: T) => string | undefined): Map<true>;
  function arrayToSet<T>(array: ReadonlyArray<T>, makeKey: (value: T) => __String | undefined): UnderscoreEscapedMap<true>;
  function cloneMap(map: SymbolTable): SymbolTable;
  function cloneMap<T>(map: ReadonlyMap<T>): Map<T>;
  function cloneMap<T>(map: ReadonlyUnderscoreEscapedMap<T>): UnderscoreEscapedMap<T>;
  function usingSingleLineStringWriter(action: (writer: EmitTextWriter) => void): string;
  function getFullWidth(node: Node): number;
  function getResolvedModule(sourceFile: SourceFile | undefined, moduleNameText: string): ResolvedModuleFull | undefined;
  function setResolvedModule(sourceFile: SourceFile, moduleNameText: string, resolvedModule: ResolvedModuleFull): void;
  function setResolvedTypeReferenceDirective(sourceFile: SourceFile, typeReferenceDirectiveName: string, resolvedTypeReferenceDirective?: ResolvedTypeReferenceDirective): void;
  function projectReferenceIsEqualTo(oldRef: ProjectReference, newRef: ProjectReference): boolean;
  function moduleResolutionIsEqualTo(oldResolution: ResolvedModuleFull, newResolution: ResolvedModuleFull): boolean;
  function packageIdToString({ name, subModuleName, version }: PackageId): string;
  function typeDirectiveIsEqualTo(oldResolution: ResolvedTypeReferenceDirective, newResolution: ResolvedTypeReferenceDirective): boolean;
  function hasChangesInResolutions<T>(names: ReadonlyArray<string>, newResolutions: ReadonlyArray<T>, oldResolutions: ReadonlyMap<T> | undefined, comparer: (oldResolution: T, newResolution: T) => boolean): boolean;
  function containsParseError(node: Node): boolean;
  function getSourceFileOfNode(node: Node): SourceFile;
  function getSourceFileOfNode(node: Node | undefined): SourceFile | undefined;
  function isStatementWithLocals(node: Node): boolean;
  function getStartPositionOfLine(line: number, sourceFile: SourceFileLike): number;
  function nodePosToString(node: Node): string;
  function getEndLinePosition(line: number, sourceFile: SourceFileLike): number;
  /**
   * Returns a value indicating whether a name is unique globally or within the current file.
   * Note: This does not consider whether a name appears as a free identifier or not, so at the expression `x.y` this includes both `x` and `y`.
   */
  function isFileLevelUniqueName(sourceFile: SourceFile, name: string, hasGlobalName?: PrintHandlers["hasGlobalName"]): boolean;
  function nodeIsMissing(node: Node | undefined): boolean;
  function nodeIsPresent(node: Node | undefined): boolean;
  /**
   * Prepends statements to an array while taking care of prologue directives.
   */
  function insertStatementsAfterStandardPrologue<T extends Statement>(to: T[], from: ReadonlyArray<T> | undefined): T[];
  function insertStatementsAfterCustomPrologue<T extends Statement>(to: T[], from: ReadonlyArray<T> | undefined): T[];
  /**
   * Prepends statements to an array while taking care of prologue directives.
   */
  function insertStatementAfterStandardPrologue<T extends Statement>(to: T[], statement: T | undefined): T[];
  function insertStatementAfterCustomPrologue<T extends Statement>(to: T[], statement: T | undefined): T[];
  /**
   * Determine if the given comment is a triple-slash
   *
   * @return true if the comment is a triple-slash comment else false
   */
  function isRecognizedTripleSlashComment(text: string, commentPos: number, commentEnd: number): boolean;
  function isPinnedComment(text: string, start: number): boolean;
  function getTokenPosOfNode(node: Node, sourceFile?: SourceFileLike, includeJsDoc?: boolean): number;
  function getNonDecoratorTokenPosOfNode(node: Node, sourceFile?: SourceFileLike): number;
  function getSourceTextOfNodeFromSourceFile(sourceFile: SourceFile, node: Node, includeTrivia?: boolean): string;
  function getTextOfNodeFromSourceText(sourceText: string, node: Node, includeTrivia?: boolean): string;
  function getTextOfNode(node: Node, includeTrivia?: boolean): string;
  /**
   * Note: it is expected that the `nodeArray` and the `node` are within the same file.
   * For example, searching for a `SourceFile` in a `SourceFile[]` wouldn't work.
   */
  function indexOfNode(nodeArray: ReadonlyArray<Node>, node: Node): number;
  /**
   * Gets flags that control emit behavior of a node.
   */
  function getEmitFlags(node: Node): EmitFlags;
  function getLiteralText(node: LiteralLikeNode, sourceFile: SourceFile, neverAsciiEscape: boolean | undefined): string;
  function getTextOfConstantValue(value: string | number): string;
  function makeIdentifierFromModuleName(moduleName: string): string;
  function isBlockOrCatchScoped(declaration: Declaration): boolean;
  function isCatchClauseVariableDeclarationOrBindingElement(declaration: Declaration): boolean;
  function isAmbientModule(node: Node): node is AmbientModuleDeclaration;
  function isModuleWithStringLiteralName(node: Node): node is ModuleDeclaration;
  function isNonGlobalAmbientModule(node: Node): node is ModuleDeclaration & {
    name: StringLiteral;
  };
  /**
   * An effective module (namespace) declaration is either
   * 1. An actual declaration: namespace X { ... }
   * 2. A Javascript declaration, which is:
   *    An identifier in a nested property access expression: Y in `X.Y.Z = { ... }`
   */
  function isEffectiveModuleDeclaration(node: Node): boolean;
  /** Given a symbol for a module, checks that it is a shorthand ambient module. */
  function isShorthandAmbientModuleSymbol(moduleSymbol: Symbol): boolean;
  function isBlockScopedContainerTopLevel(node: Node): boolean;
  function isGlobalScopeAugmentation(module: ModuleDeclaration): boolean;
  function isExternalModuleAugmentation(node: Node): node is AmbientModuleDeclaration;
  function isModuleAugmentationExternal(node: AmbientModuleDeclaration): boolean;
  function getNonAugmentationDeclaration(symbol: Symbol): Declaration | undefined;
  function isEffectiveExternalModule(node: SourceFile, compilerOptions: CompilerOptions): boolean;
  /**
   * Returns whether the source file will be treated as if it were in strict mode at runtime.
   */
  function isEffectiveStrictModeSourceFile(node: SourceFile, compilerOptions: CompilerOptions): boolean;
  function isBlockScope(node: Node, parentNode: Node): boolean;
  function isDeclarationWithTypeParameters(node: Node): node is DeclarationWithTypeParameters;
  function isDeclarationWithTypeParameterChildren(node: Node): node is DeclarationWithTypeParameterChildren;
  function isAnyImportSyntax(node: Node): node is AnyImportSyntax;
  function isLateVisibilityPaintedStatement(node: Node): node is LateVisibilityPaintedStatement;
  function isAnyImportOrReExport(node: Node): node is AnyImportOrReExport;
  function getEnclosingBlockScopeContainer(node: Node): Node;
  function declarationNameToString(name: DeclarationName | QualifiedName | undefined): string;
  function getNameFromIndexInfo(info: IndexInfo): string | undefined;
  function getTextOfPropertyName(name: PropertyName | NoSubstitutionTemplateLiteral): __String;
  function entityNameToString(name: EntityNameOrEntityNameExpression): string;
  function createDiagnosticForNode(node: Node, message: DiagnosticMessage, arg0?: string | number, arg1?: string | number, arg2?: string | number, arg3?: string | number): DiagnosticWithLocation;
  function createDiagnosticForNodeArray(sourceFile: SourceFile, nodes: NodeArray<Node>, message: DiagnosticMessage, arg0?: string | number, arg1?: string | number, arg2?: string | number, arg3?: string | number): DiagnosticWithLocation;
  function createDiagnosticForNodeInSourceFile(sourceFile: SourceFile, node: Node, message: DiagnosticMessage, arg0?: string | number, arg1?: string | number, arg2?: string | number, arg3?: string | number): DiagnosticWithLocation;
  function createDiagnosticForNodeFromMessageChain(node: Node, messageChain: DiagnosticMessageChain, relatedInformation?: DiagnosticRelatedInformation[]): DiagnosticWithLocation;
  function getSpanOfTokenAtPosition(sourceFile: SourceFile, pos: number): TextSpan;
  function getErrorSpanForNode(sourceFile: SourceFile, node: Node): TextSpan;
  function isExternalOrCommonJsModule(file: SourceFile): boolean;
  function isJsonSourceFile(file: SourceFile): file is JsonSourceFile;
  function isEnumConst(node: EnumDeclaration): boolean;
  function isDeclarationReadonly(declaration: Declaration): boolean;
  function isVarConst(node: VariableDeclaration | VariableDeclarationList): boolean;
  function isLet(node: Node): boolean;
  function isSuperCall(n: Node): n is SuperCall;
  function isImportCall(n: Node): n is ImportCall;
  function isImportMeta(n: Node): n is ImportMetaProperty;
  function isLiteralImportTypeNode(n: Node): n is LiteralImportTypeNode;
  function isPrologueDirective(node: Node): node is PrologueDirective;
  function getLeadingCommentRangesOfNode(node: Node, sourceFileOfNode: SourceFile): CommentRange[] | undefined;
  function getJSDocCommentRanges(node: Node, text: string): CommentRange[] | undefined;
  const fullTripleSlashReferencePathRegEx: RegExp;
  const fullTripleSlashAMDReferencePathRegEx: RegExp;
  function isPartOfTypeNode(node: Node): boolean;
  function isChildOfNodeWithKind(node: Node, kind: SyntaxKind): boolean;
  function forEachReturnStatement<T>(body: Block, visitor: (stmt: ReturnStatement) => T): T | undefined;
  function forEachYieldExpression(body: Block, visitor: (expr: YieldExpression) => void): void;
  /**
   * Gets the most likely element type for a TypeNode. This is not an exhaustive test
   * as it assumes a rest argument can only be an array type (either T[], or Array<T>).
   *
   * @param node The type node.
   */
  function getRestParameterElementType(node: TypeNode | undefined): TypeNode | undefined;
  function getMembersOfDeclaration(node: Declaration): NodeArray<ClassElement | TypeElement | ObjectLiteralElement> | undefined;
  function isVariableLike(node: Node): node is VariableLikeDeclaration;
  function isVariableLikeOrAccessor(node: Node): node is AccessorDeclaration | VariableLikeDeclaration;
  function isVariableDeclarationInVariableStatement(node: VariableDeclaration): boolean;
  function isValidESSymbolDeclaration(node: Node): node is VariableDeclaration | PropertyDeclaration | SignatureDeclaration;
  function introducesArgumentsExoticObject(node: Node): boolean;
  function unwrapInnermostStatementOfLabel(node: LabeledStatement, beforeUnwrapLabelCallback?: (node: LabeledStatement) => void): Statement;
  function isFunctionBlock(node: Node): boolean;
  function isObjectLiteralMethod(node: Node): node is MethodDeclaration;
  function isObjectLiteralOrClassExpressionMethod(node: Node): node is MethodDeclaration;
  function isIdentifierTypePredicate(predicate: TypePredicate): predicate is IdentifierTypePredicate;
  function isThisTypePredicate(predicate: TypePredicate): predicate is ThisTypePredicate;
  function getPropertyAssignment(objectLiteral: ObjectLiteralExpression, key: string, key2?: string): ReadonlyArray<PropertyAssignment>;
  function getTsConfigObjectLiteralExpression(tsConfigSourceFile: TsConfigSourceFile | undefined): ObjectLiteralExpression | undefined;
  function getTsConfigPropArrayElementValue(tsConfigSourceFile: TsConfigSourceFile | undefined, propKey: string, elementValue: string): StringLiteral | undefined;
  function getTsConfigPropArray(tsConfigSourceFile: TsConfigSourceFile | undefined, propKey: string): ReadonlyArray<PropertyAssignment>;
  function getContainingFunction(node: Node): SignatureDeclaration | undefined;
  function getContainingFunctionDeclaration(node: Node): FunctionLikeDeclaration | undefined;
  function getContainingClass(node: Node): ClassLikeDeclaration | undefined;
  function getThisContainer(node: Node, includeArrowFunctions: boolean): Node;
  function getNewTargetContainer(node: Node): Node | undefined;
  /**
   * Given an super call/property node, returns the closest node where
   * - a super call/property access is legal in the node and not legal in the parent node the node.
   *   i.e. super call is legal in constructor but not legal in the class body.
   * - the container is an arrow function (so caller might need to call getSuperContainer again in case it needs to climb higher)
   * - a super call/property is definitely illegal in the container (but might be legal in some subnode)
   *   i.e. super property access is illegal in function declaration but can be legal in the statement list
   */
  function getSuperContainer(node: Node, stopOnFunctions: boolean): Node;
  function getImmediatelyInvokedFunctionExpression(func: Node): CallExpression | undefined;
  function isSuperOrSuperProperty(node: Node): node is SuperExpression | SuperProperty;
  /**
   * Determines whether a node is a property or element access expression for `super`.
   */
  function isSuperProperty(node: Node): node is SuperProperty;
  /**
   * Determines whether a node is a property or element access expression for `this`.
   */
  function isThisProperty(node: Node): boolean;
  function getEntityNameFromTypeNode(node: TypeNode): EntityNameOrEntityNameExpression | undefined;
  function getInvokedExpression(node: CallLikeExpression): Expression;
  function nodeCanBeDecorated(node: ClassDeclaration): true;
  function nodeCanBeDecorated(node: ClassElement, parent: Node): boolean;
  function nodeCanBeDecorated(node: Node, parent: Node, grandparent: Node): boolean;
  function nodeIsDecorated(node: ClassDeclaration): boolean;
  function nodeIsDecorated(node: ClassElement, parent: Node): boolean;
  function nodeIsDecorated(node: Node, parent: Node, grandparent: Node): boolean;
  function nodeOrChildIsDecorated(node: ClassDeclaration): boolean;
  function nodeOrChildIsDecorated(node: ClassElement, parent: Node): boolean;
  function nodeOrChildIsDecorated(node: Node, parent: Node, grandparent: Node): boolean;
  function childIsDecorated(node: ClassDeclaration): boolean;
  function childIsDecorated(node: Node, parent: Node): boolean;
  function isJSXTagName(node: Node): boolean;
  function isExpressionNode(node: Node): boolean;
  function isInExpressionContext(node: Node): boolean;
  function isExternalModuleImportEqualsDeclaration(node: Node): boolean;
  function getExternalModuleImportEqualsDeclarationExpression(node: Node): Expression;
  function isInternalModuleImportEqualsDeclaration(node: Node): node is ImportEqualsDeclaration;
  function isSourceFileJS(file: SourceFile): boolean;
  function isSourceFileNotJS(file: SourceFile): boolean;
  function isInJSFile(node: Node | undefined): boolean;
  function isInJsonFile(node: Node | undefined): boolean;
  function isInJSDoc(node: Node | undefined): boolean;
  function isJSDocIndexSignature(node: TypeReferenceNode | ExpressionWithTypeArguments): boolean | undefined;
  /**
   * Returns true if the node is a CallExpression to the identifier 'require' with
   * exactly one argument (of the form 'require("name")').
   * This function does not test if the node is in a JavaScript file or not.
   */
  function isRequireCall(callExpression: Node, checkArgumentIsStringLiteralLike: true): callExpression is RequireOrImportCall & {
    expression: Identifier;
    arguments: [StringLiteralLike];
  };
  function isRequireCall(callExpression: Node, checkArgumentIsStringLiteralLike: boolean): callExpression is CallExpression;
  function isSingleOrDoubleQuote(charCode: number): boolean;
  function isStringDoubleQuoted(str: StringLiteralLike, sourceFile: SourceFile): boolean;
  function getDeclarationOfExpando(node: Node): Node | undefined;
  function isAssignmentDeclaration(decl: Declaration): boolean;
  /** Get the initializer, taking into account defaulted Javascript initializers */
  function getEffectiveInitializer(node: HasExpressionInitializer): Expression | undefined;
  /** Get the declaration initializer when it is container-like (See getExpandoInitializer). */
  function getDeclaredExpandoInitializer(node: HasExpressionInitializer): Expression | undefined;
  /**
   * Get the assignment 'initializer' -- the righthand side-- when the initializer is container-like (See getExpandoInitializer).
   * We treat the right hand side of assignments with container-like initalizers as declarations.
   */
  function getAssignedExpandoInitializer(node: Node | undefined): Expression | undefined;
  /**
   * Recognized expando initializers are:
   * 1. (function() {})() -- IIFEs
   * 2. function() { } -- Function expressions
   * 3. class { } -- Class expressions
   * 4. {} -- Empty object literals
   * 5. { ... } -- Non-empty object literals, when used to initialize a prototype, like `C.prototype = { m() { } }`
   *
   * This function returns the provided initializer, or undefined if it is not valid.
   */
  function getExpandoInitializer(initializer: Node, isPrototypeAssignment: boolean): Expression | undefined;
  function isDefaultedExpandoInitializer(node: BinaryExpression): boolean | undefined;
  /** Given an expando initializer, return its declaration name, or the left-hand side of the assignment if it's part of an assignment declaration. */
  function getNameOfExpando(node: Declaration): DeclarationName | undefined;
  function getRightMostAssignedExpression(node: Expression): Expression;
  function isExportsIdentifier(node: Node): boolean;
  function isModuleExportsPropertyAccessExpression(node: Node): boolean;
  function getAssignmentDeclarationKind(expr: BinaryExpression | CallExpression): AssignmentDeclarationKind;
  function isBindableObjectDefinePropertyCall(expr: CallExpression): expr is BindableObjectDefinePropertyCall;
  function getAssignmentDeclarationPropertyAccessKind(lhs: PropertyAccessExpression): AssignmentDeclarationKind;
  function getInitializerOfBinaryExpression(expr: BinaryExpression): Expression;
  function isPrototypePropertyAssignment(node: Node): boolean;
  function isSpecialPropertyDeclaration(expr: PropertyAccessExpression): boolean;
  function isFunctionSymbol(symbol: Symbol | undefined): boolean | undefined;
  function importFromModuleSpecifier(node: StringLiteralLike): AnyValidImportOrReExport;
  function tryGetImportFromModuleSpecifier(node: StringLiteralLike): AnyValidImportOrReExport | undefined;
  function getExternalModuleName(node: AnyImportOrReExport | ImportTypeNode): Expression | undefined;
  function getNamespaceDeclarationNode(node: ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration): ImportEqualsDeclaration | NamespaceImport | undefined;
  function isDefaultImport(node: ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration): boolean;
  function hasQuestionToken(node: Node): boolean;
  function isJSDocConstructSignature(node: Node): boolean;
  function isJSDocTypeAlias(node: Node): node is JSDocTypedefTag | JSDocCallbackTag | JSDocEnumTag;
  function isTypeAlias(node: Node): node is JSDocTypedefTag | JSDocCallbackTag | JSDocEnumTag | TypeAliasDeclaration;
  function getSingleInitializerOfVariableStatementOrPropertyDeclaration(node: Node): Expression | undefined;
  function getJSDocCommentsAndTags(hostNode: Node): ReadonlyArray<JSDoc | JSDocTag>;
  /** Does the opposite of `getJSDocParameterTags`: given a JSDoc parameter, finds the parameter corresponding to it. */
  function getParameterSymbolFromJSDoc(node: JSDocParameterTag): Symbol | undefined;
  function getHostSignatureFromJSDoc(node: Node): SignatureDeclaration | undefined;
  function getHostSignatureFromJSDocHost(host: HasJSDoc): SignatureDeclaration | undefined;
  function getJSDocHost(node: Node): HasJSDoc;
  function getTypeParameterFromJsDoc(node: TypeParameterDeclaration & {
    parent: JSDocTemplateTag;
  }): TypeParameterDeclaration | undefined;
  function hasRestParameter(s: SignatureDeclaration | JSDocSignature): boolean;
  function isRestParameter(node: ParameterDeclaration | JSDocParameterTag): boolean;
  enum AssignmentKind {
    None = 0,
    Definite = 1,
    Compound = 2
  }
  function getAssignmentTargetKind(node: Node): AssignmentKind;
  function isAssignmentTarget(node: Node): boolean;
  type NodeWithPossibleHoistedDeclaration = Block | VariableStatement | WithStatement | IfStatement | SwitchStatement | CaseBlock | CaseClause | DefaultClause | LabeledStatement | ForStatement | ForInStatement | ForOfStatement | DoStatement | WhileStatement | TryStatement | CatchClause;
  /**
   * Indicates whether a node could contain a `var` VariableDeclarationList that contributes to
   * the same `var` declaration scope as the node's parent.
   */
  function isNodeWithPossibleHoistedDeclaration(node: Node): node is NodeWithPossibleHoistedDeclaration;
  type ValueSignatureDeclaration = FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | AccessorDeclaration | FunctionExpression | ArrowFunction;
  function isValueSignatureDeclaration(node: Node): node is ValueSignatureDeclaration;
  function walkUpParenthesizedTypes(node: Node): Node;
  function walkUpParenthesizedExpressions(node: Node): Node;
  function skipParentheses(node: Expression): Expression;
  function skipParentheses(node: Node): Node;
  function isDeleteTarget(node: Node): boolean;
  function isNodeDescendantOf(node: Node, ancestor: Node | undefined): boolean;
  function isDeclarationName(name: Node): boolean;
  function getDeclarationFromName(name: Node): Declaration | undefined;
  function isLiteralComputedPropertyDeclarationName(node: Node): boolean;
  function isIdentifierName(node: Identifier): boolean;
  function isAliasSymbolDeclaration(node: Node): boolean;
  function exportAssignmentIsAlias(node: ExportAssignment | BinaryExpression): boolean;
  function getEffectiveBaseTypeNode(node: ClassLikeDeclaration | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
  function getClassExtendsHeritageElement(node: ClassLikeDeclaration | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
  function getClassImplementsHeritageClauseElements(node: ClassLikeDeclaration): NodeArray<ExpressionWithTypeArguments> | undefined;
  /** Returns the node in an `extends` or `implements` clause of a class or interface. */
  function getAllSuperTypeNodes(node: Node): ReadonlyArray<TypeNode>;
  function getInterfaceBaseTypeNodes(node: InterfaceDeclaration): NodeArray<ExpressionWithTypeArguments> | undefined;
  function getHeritageClause(clauses: NodeArray<HeritageClause> | undefined, kind: SyntaxKind): HeritageClause | undefined;
  function getAncestor(node: Node | undefined, kind: SyntaxKind): Node | undefined;
  function isKeyword(token: SyntaxKind): boolean;
  function isContextualKeyword(token: SyntaxKind): boolean;
  function isNonContextualKeyword(token: SyntaxKind): boolean;
  function isFutureReservedKeyword(token: SyntaxKind): boolean;
  function isStringANonContextualKeyword(name: string): boolean;
  function isIdentifierANonContextualKeyword({ originalKeywordKind }: Identifier): boolean;
  type TriviaKind = SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia | SyntaxKind.NewLineTrivia | SyntaxKind.WhitespaceTrivia | SyntaxKind.ShebangTrivia | SyntaxKind.ConflictMarkerTrivia;
  function isTrivia(token: SyntaxKind): token is TriviaKind;
  enum FunctionFlags {
    Normal = 0,
    Generator = 1,
    Async = 2,
    Invalid = 4,
    AsyncGenerator = 3
  }
  function getFunctionFlags(node: SignatureDeclaration | undefined): FunctionFlags;
  function isAsyncFunction(node: Node): boolean;
  function isStringOrNumericLiteralLike(node: Node): node is StringLiteralLike | NumericLiteral;
  function isSignedNumericLiteral(node: Node): node is PrefixUnaryExpression & {
    operand: NumericLiteral;
  };
  /**
   * A declaration has a dynamic name if all of the following are true:
   *   1. The declaration has a computed property name.
   *   2. The computed name is *not* expressed as a StringLiteral.
   *   3. The computed name is *not* expressed as a NumericLiteral.
   *   4. The computed name is *not* expressed as a PlusToken or MinusToken
   *      immediately followed by a NumericLiteral.
   *   5. The computed name is *not* expressed as `Symbol.<name>`, where `<name>`
   *      is a property of the Symbol constructor that denotes a built-in
   *      Symbol.
   */
  function hasDynamicName(declaration: Declaration): declaration is DynamicNamedDeclaration;
  function isDynamicName(name: DeclarationName): boolean;
  /**
   * Checks if the expression is of the form:
   *    Symbol.name
   * where Symbol is literally the word "Symbol", and name is any identifierName
   */
  function isWellKnownSymbolSyntactically(node: Expression): boolean;
  function getPropertyNameForPropertyNameNode(name: PropertyName): __String | undefined;
  type PropertyNameLiteral = Identifier | StringLiteralLike | NumericLiteral;
  function isPropertyNameLiteral(node: Node): node is PropertyNameLiteral;
  function getTextOfIdentifierOrLiteral(node: PropertyNameLiteral): string;
  function getEscapedTextOfIdentifierOrLiteral(node: PropertyNameLiteral): __String;
  function getPropertyNameForKnownSymbolName(symbolName: string): __String;
  function isKnownSymbol(symbol: Symbol): boolean;
  /**
   * Includes the word "Symbol" with unicode escapes
   */
  function isESSymbolIdentifier(node: Node): boolean;
  function isPushOrUnshiftIdentifier(node: Identifier): boolean;
  function isParameterDeclaration(node: VariableLikeDeclaration): boolean;
  function getRootDeclaration(node: Node): Node;
  function nodeStartsNewLexicalEnvironment(node: Node): boolean;
  function nodeIsSynthesized(range: TextRange): boolean;
  function getOriginalSourceFile(sourceFile: SourceFile): SourceFile;
  enum Associativity {
    Left = 0,
    Right = 1
  }
  function getExpressionAssociativity(expression: Expression): Associativity;
  function getOperatorAssociativity(kind: SyntaxKind, operator: SyntaxKind, hasArguments?: boolean): Associativity;
  function getExpressionPrecedence(expression: Expression): number;
  function getOperator(expression: Expression): SyntaxKind;
  function getOperatorPrecedence(nodeKind: SyntaxKind, operatorKind: SyntaxKind, hasArguments?: boolean): number;
  function getBinaryOperatorPrecedence(kind: SyntaxKind): number;
  function createDiagnosticCollection(): DiagnosticCollection;
  /**
   * Based heavily on the abstract 'Quote'/'QuoteJSONString' operation from ECMA-262 (24.3.2.2),
   * but augmented for a few select characters (e.g. lineSeparator, paragraphSeparator, nextLine)
   * Note that this doesn't actually wrap the input in double quotes.
   */
  function escapeString(s: string, quoteChar?: CharacterCodes.doubleQuote | CharacterCodes.singleQuote | CharacterCodes.backtick): string;
  /**
   * Strip off existed single quotes or double quotes from a given string
   *
   * @return non-quoted string
   */
  function stripQuotes(name: string): string;
  function startsWithQuote(name: string): boolean;
  function isIntrinsicJsxName(name: __String | string): boolean;
  function escapeNonAsciiString(s: string, quoteChar?: CharacterCodes.doubleQuote | CharacterCodes.singleQuote | CharacterCodes.backtick): string;
  function getIndentString(level: number): string;
  function getIndentSize(): number;
  function createTextWriter(newLine: string): EmitTextWriter;
  function getTrailingSemicolonOmittingWriter(writer: EmitTextWriter): EmitTextWriter;
  function getResolvedExternalModuleName(host: EmitHost, file: SourceFile, referenceFile?: SourceFile): string;
  function getExternalModuleNameFromDeclaration(host: EmitHost, resolver: EmitResolver, declaration: ImportEqualsDeclaration | ImportDeclaration | ExportDeclaration | ModuleDeclaration | ImportTypeNode): string | undefined;
  /**
   * Resolves a local path to a path which is absolute to the base of the emit
   */
  function getExternalModuleNameFromPath(host: EmitHost, fileName: string, referencePath?: string): string;
  function getOwnEmitOutputFilePath(fileName: string, host: EmitHost, extension: string): string;
  function getDeclarationEmitOutputFilePath(fileName: string, host: EmitHost): string;
  function getDeclarationEmitOutputFilePathWorker(fileName: string, options: CompilerOptions, currentDirectory: string, commonSourceDirectory: string, getCanonicalFileName: GetCanonicalFileName): string;
  interface EmitFileNames {
    jsFilePath?: string | undefined;
    sourceMapFilePath?: string | undefined;
    declarationFilePath?: string | undefined;
    declarationMapPath?: string | undefined;
    buildInfoPath?: string | undefined;
  }
  /**
   * Gets the source files that are expected to have an emit output.
   *
   * Originally part of `forEachExpectedEmitFile`, this functionality was extracted to support
   * transformations.
   *
   * @param host An EmitHost.
   * @param targetSourceFile An optional target source file to emit.
   */
  function getSourceFilesToEmit(host: EmitHost, targetSourceFile?: SourceFile): ReadonlyArray<SourceFile>;
  /** Don't call this for `--outFile`, just for `--outDir` or plain emit. `--outFile` needs additional checks. */
  function sourceFileMayBeEmitted(sourceFile: SourceFile, options: CompilerOptions, isSourceFileFromExternalLibrary: (file: SourceFile) => boolean, getResolvedProjectReferenceToRedirect: (fileName: string) => ResolvedProjectReference | undefined): boolean;
  function getSourceFilePathInNewDir(fileName: string, host: EmitHost, newDirPath: string): string;
  function getSourceFilePathInNewDirWorker(fileName: string, newDirPath: string, currentDirectory: string, commonSourceDirectory: string, getCanonicalFileName: GetCanonicalFileName): string;
  function writeFile(host: {
    writeFile: WriteFileCallback;
  }, diagnostics: DiagnosticCollection, fileName: string, data: string, writeByteOrderMark: boolean, sourceFiles?: ReadonlyArray<SourceFile>): void;
  function getLineOfLocalPosition(currentSourceFile: SourceFile, pos: number): number;
  function getLineOfLocalPositionFromLineMap(lineMap: ReadonlyArray<number>, pos: number): number;
  function getFirstConstructorWithBody(node: ClassLikeDeclaration): ConstructorDeclaration & {
    body: FunctionBody;
  } | undefined;
  function getSetAccessorValueParameter(accessor: SetAccessorDeclaration): ParameterDeclaration | undefined;
  /** Get the type annotation for the value parameter. */
  function getSetAccessorTypeAnnotationNode(accessor: SetAccessorDeclaration): TypeNode | undefined;
  function getThisParameter(signature: SignatureDeclaration | JSDocSignature): ParameterDeclaration | undefined;
  function parameterIsThisKeyword(parameter: ParameterDeclaration): boolean;
  function isThisIdentifier(node: Node | undefined): boolean;
  function identifierIsThisKeyword(id: Identifier): boolean;
  function getAllAccessorDeclarations(declarations: readonly Declaration[], accessor: AccessorDeclaration): AllAccessorDeclarations;
  /**
   * Gets the effective type annotation of a variable, parameter, or property. If the node was
   * parsed in a JavaScript file, gets the type annotation from JSDoc.
   */
  function getEffectiveTypeAnnotationNode(node: Node): TypeNode | undefined;
  function getTypeAnnotationNode(node: Node): TypeNode | undefined;
  /**
   * Gets the effective return type annotation of a signature. If the node was parsed in a
   * JavaScript file, gets the return type annotation from JSDoc.
   */
  function getEffectiveReturnTypeNode(node: SignatureDeclaration | JSDocSignature): TypeNode | undefined;
  function getJSDocTypeParameterDeclarations(node: DeclarationWithTypeParameters): ReadonlyArray<TypeParameterDeclaration>;
  /**
   * Gets the effective type annotation of the value parameter of a set accessor. If the node
   * was parsed in a JavaScript file, gets the type annotation from JSDoc.
   */
  function getEffectiveSetAccessorTypeAnnotationNode(node: SetAccessorDeclaration): TypeNode | undefined;
  function emitNewLineBeforeLeadingComments(lineMap: ReadonlyArray<number>, writer: EmitTextWriter, node: TextRange, leadingComments: ReadonlyArray<CommentRange> | undefined): void;
  function emitNewLineBeforeLeadingCommentsOfPosition(lineMap: ReadonlyArray<number>, writer: EmitTextWriter, pos: number, leadingComments: ReadonlyArray<CommentRange> | undefined): void;
  function emitNewLineBeforeLeadingCommentOfPosition(lineMap: ReadonlyArray<number>, writer: EmitTextWriter, pos: number, commentPos: number): void;
  function emitComments(text: string, lineMap: ReadonlyArray<number>, writer: EmitTextWriter, comments: ReadonlyArray<CommentRange> | undefined, leadingSeparator: boolean, trailingSeparator: boolean, newLine: string, writeComment: (text: string, lineMap: ReadonlyArray<number>, writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string) => void): void;
  /**
   * Detached comment is a comment at the top of file or function body that is separated from
   * the next statement by space.
   */
  function emitDetachedComments(text: string, lineMap: ReadonlyArray<number>, writer: EmitTextWriter, writeComment: (text: string, lineMap: ReadonlyArray<number>, writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string) => void, node: TextRange, newLine: string, removeComments: boolean): {
    nodePos: number;
    detachedCommentEndPos: number;
  } | undefined;
  function writeCommentRange(text: string, lineMap: ReadonlyArray<number>, writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string): void;
  function hasModifiers(node: Node): boolean;
  function hasModifier(node: Node, flags: ModifierFlags): boolean;
  function hasStaticModifier(node: Node): boolean;
  function hasReadonlyModifier(node: Node): boolean;
  function getSelectedModifierFlags(node: Node, flags: ModifierFlags): ModifierFlags;
  function getModifierFlags(node: Node): ModifierFlags;
  function getModifierFlagsNoCache(node: Node): ModifierFlags;
  function modifierToFlag(token: SyntaxKind): ModifierFlags;
  function isLogicalOperator(token: SyntaxKind): boolean;
  function isAssignmentOperator(token: SyntaxKind): boolean;
  /** Get `C` given `N` if `N` is in the position `class C extends N` where `N` is an ExpressionWithTypeArguments. */
  function tryGetClassExtendingExpressionWithTypeArguments(node: Node): ClassLikeDeclaration | undefined;
  interface ClassImplementingOrExtendingExpressionWithTypeArguments {
    readonly class: ClassLikeDeclaration;
    readonly isImplements: boolean;
  }
  function tryGetClassImplementingOrExtendingExpressionWithTypeArguments(node: Node): ClassImplementingOrExtendingExpressionWithTypeArguments | undefined;
  function isAssignmentExpression(node: Node, excludeCompoundAssignment: true): node is AssignmentExpression<EqualsToken>;
  function isAssignmentExpression(node: Node, excludeCompoundAssignment?: false): node is AssignmentExpression<AssignmentOperatorToken>;
  function isDestructuringAssignment(node: Node): node is DestructuringAssignment;
  function isExpressionWithTypeArgumentsInClassExtendsClause(node: Node): node is ExpressionWithTypeArguments;
  function isEntityNameExpression(node: Node): node is EntityNameExpression;
  function isPropertyAccessEntityNameExpression(node: Node): node is PropertyAccessEntityNameExpression;
  function tryGetPropertyAccessOrIdentifierToString(expr: Expression): string | undefined;
  function isPrototypeAccess(node: Node): node is PropertyAccessExpression;
  function isRightSideOfQualifiedNameOrPropertyAccess(node: Node): boolean;
  function isEmptyObjectLiteral(expression: Node): boolean;
  function isEmptyArrayLiteral(expression: Node): boolean;
  function getLocalSymbolForExportDefault(symbol: Symbol): Symbol | undefined;
  /** Return ".ts", ".d.ts", or ".tsx", if that is the extension. */
  function tryExtractTSExtension(fileName: string): string | undefined;
  /**
   * Converts a string to a base-64 encoded ASCII string.
   */
  function convertToBase64(input: string): string;
  function base64encode(host: {
    base64encode?(input: string): string;
  } | undefined, input: string): string;
  function base64decode(host: {
    base64decode?(input: string): string;
  } | undefined, input: string): string;
  function readJson(path: string, host: {
    readFile(fileName: string): string | undefined;
  }): object;
  function directoryProbablyExists(directoryName: string, host: {
    directoryExists?: (directoryName: string) => boolean;
  }): boolean;
  function getNewLineCharacter(options: CompilerOptions | PrinterOptions, getNewLine?: () => string): string;
  /**
   * Creates a new TextRange from the provided pos and end.
   *
   * @param pos The start position.
   * @param end The end position.
   */
  function createRange(pos: number, end?: number): TextRange;
  /**
   * Creates a new TextRange from a provided range with a new end position.
   *
   * @param range A TextRange.
   * @param end The new end position.
   */
  function moveRangeEnd(range: TextRange, end: number): TextRange;
  /**
   * Creates a new TextRange from a provided range with a new start position.
   *
   * @param range A TextRange.
   * @param pos The new Start position.
   */
  function moveRangePos(range: TextRange, pos: number): TextRange;
  /**
   * Moves the start position of a range past any decorators.
   */
  function moveRangePastDecorators(node: Node): TextRange;
  /**
   * Moves the start position of a range past any decorators or modifiers.
   */
  function moveRangePastModifiers(node: Node): TextRange;
  /**
   * Determines whether a TextRange has the same start and end positions.
   *
   * @param range A TextRange.
   */
  function isCollapsedRange(range: TextRange): boolean;
  /**
   * Creates a new TextRange for a token at the provides start position.
   *
   * @param pos The start position.
   * @param token The token.
   */
  function createTokenRange(pos: number, token: SyntaxKind): TextRange;
  function rangeIsOnSingleLine(range: TextRange, sourceFile: SourceFile): boolean;
  function rangeStartPositionsAreOnSameLine(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
  function rangeEndPositionsAreOnSameLine(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
  function rangeStartIsOnSameLineAsRangeEnd(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
  function rangeEndIsOnSameLineAsRangeStart(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
  function isNodeArrayMultiLine(list: NodeArray<Node>, sourceFile: SourceFile): boolean;
  function positionsAreOnSameLine(pos1: number, pos2: number, sourceFile: SourceFile): boolean;
  function getStartPositionOfRange(range: TextRange, sourceFile: SourceFile): number;
  /**
   * Determines whether a name was originally the declaration name of an enum or namespace
   * declaration.
   */
  function isDeclarationNameOfEnumOrNamespace(node: Identifier): boolean;
  function getInitializedVariables(node: VariableDeclarationList): readonly VariableDeclaration[];
  function isWatchSet(options: CompilerOptions): boolean | undefined;
  function closeFileWatcher(watcher: FileWatcher): void;
  function getCheckFlags(symbol: Symbol): CheckFlags;
  function getDeclarationModifierFlagsFromSymbol(s: Symbol): ModifierFlags;
  function skipAlias(symbol: Symbol, checker: TypeChecker): Symbol;
  /** See comment on `declareModuleMember` in `binder.ts`. */
  function getCombinedLocalAndExportSymbolFlags(symbol: Symbol): SymbolFlags;
  function isWriteOnlyAccess(node: Node): boolean;
  function isWriteAccess(node: Node): boolean;
  function compareDataObjects(dst: any, src: any): boolean;
  /**
   * clears already present map by calling onDeleteExistingValue callback before deleting that key/value
   */
  function clearMap<T>(map: {
    forEach: Map<T>["forEach"];
    clear: Map<T>["clear"];
  }, onDeleteValue: (valueInMap: T, key: string) => void): void;
  interface MutateMapSkippingNewValuesOptions<T, U> {
    onDeleteValue(existingValue: T, key: string): void;
    /**
     * If present this is called with the key when there is value for that key both in new map as well as existing map provided
     * Caller can then decide to update or remove this key.
     * If the key is removed, caller will get callback of createNewValue for that key.
     * If this callback is not provided, the value of such keys is not updated.
     */
    onExistingValue?(existingValue: T, valueInNewMap: U, key: string): void;
  }
  /**
   * Mutates the map with newMap such that keys in map will be same as newMap.
   */
  function mutateMapSkippingNewValues<T, U>(map: Map<T>, newMap: ReadonlyMap<U>, options: MutateMapSkippingNewValuesOptions<T, U>): void;
  interface MutateMapOptions<T, U> extends MutateMapSkippingNewValuesOptions<T, U> {
    createNewValue(key: string, valueInNewMap: U): T;
  }
  /**
   * Mutates the map with newMap such that keys in map will be same as newMap.
   */
  function mutateMap<T, U>(map: Map<T>, newMap: ReadonlyMap<U>, options: MutateMapOptions<T, U>): void;
  /** Calls `callback` on `directory` and every ancestor directory it has, returning the first defined result. */
  function forEachAncestorDirectory<T>(directory: string, callback: (directory: string) => T | undefined): T | undefined;
  function isAbstractConstructorType(type: Type): boolean;
  function isAbstractConstructorSymbol(symbol: Symbol): boolean;
  function getClassLikeDeclarationOfSymbol(symbol: Symbol): ClassLikeDeclaration | undefined;
  function getObjectFlags(type: Type): ObjectFlags;
  function typeHasCallOrConstructSignatures(type: Type, checker: TypeChecker): boolean;
  function forSomeAncestorDirectory(directory: string, callback: (directory: string) => boolean): boolean;
  function isUMDExportSymbol(symbol: Symbol | undefined): boolean;
  function showModuleSpecifier({ moduleSpecifier }: ImportDeclaration): string;
  function getLastChild(node: Node): Node | undefined;
  /** Add a value to a set, and return true if it wasn't already present. */
  function addToSeen(seen: Map<true>, key: string | number): boolean;
  function addToSeen<T>(seen: Map<T>, key: string | number, value: T): boolean;
  function isObjectTypeDeclaration(node: Node): node is ObjectTypeDeclaration;
  function isTypeNodeKind(kind: SyntaxKind): boolean;
  function isAccessExpression(node: Node): node is AccessExpression;
  function isBundleFileTextLike(section: BundleFileSection): section is BundleFileTextLike;
}
declare namespace ts {
  function getDefaultLibFileName(options: CompilerOptions): string;
  function textSpanEnd(span: TextSpan): number;
  function textSpanIsEmpty(span: TextSpan): boolean;
  function textSpanContainsPosition(span: TextSpan, position: number): boolean;
  function textRangeContainsPositionInclusive(span: TextRange, position: number): boolean;
  function textSpanContainsTextSpan(span: TextSpan, other: TextSpan): boolean;
  function textSpanOverlapsWith(span: TextSpan, other: TextSpan): boolean;
  function textSpanOverlap(span1: TextSpan, span2: TextSpan): TextSpan | undefined;
  function textSpanIntersectsWithTextSpan(span: TextSpan, other: TextSpan): boolean;
  function textSpanIntersectsWith(span: TextSpan, start: number, length: number): boolean;
  function decodedTextSpanIntersectsWith(start1: number, length1: number, start2: number, length2: number): boolean;
  function textSpanIntersectsWithPosition(span: TextSpan, position: number): boolean;
  function textSpanIntersection(span1: TextSpan, span2: TextSpan): TextSpan | undefined;
  function createTextSpan(start: number, length: number): TextSpan;
  function createTextSpanFromBounds(start: number, end: number): TextSpan;
  function textChangeRangeNewSpan(range: TextChangeRange): TextSpan;
  function textChangeRangeIsUnchanged(range: TextChangeRange): boolean;
  function createTextChangeRange(span: TextSpan, newLength: number): TextChangeRange;
  let unchangedTextChangeRange: TextChangeRange;
  /**
   * Called to merge all the changes that occurred across several versions of a script snapshot
   * into a single change.  i.e. if a user keeps making successive edits to a script we will
   * have a text change from V1 to V2, V2 to V3, ..., Vn.
   *
   * This function will then merge those changes into a single change range valid between V1 and
   * Vn.
   */
  function collapseTextChangeRangesAcrossMultipleVersions(changes: ReadonlyArray<TextChangeRange>): TextChangeRange;
  function getTypeParameterOwner(d: Declaration): Declaration | undefined;
  type ParameterPropertyDeclaration = ParameterDeclaration & {
    parent: ConstructorDeclaration;
    name: Identifier;
  };
  function isParameterPropertyDeclaration(node: Node): node is ParameterPropertyDeclaration;
  function isEmptyBindingPattern(node: BindingName): node is BindingPattern;
  function isEmptyBindingElement(node: BindingElement): boolean;
  function walkUpBindingElementsAndPatterns(binding: BindingElement): VariableDeclaration | ParameterDeclaration;
  function getCombinedModifierFlags(node: Declaration): ModifierFlags;
  function getCombinedNodeFlags(node: Node): NodeFlags;
  /**
   * Checks to see if the locale is in the appropriate format,
   * and if it is, attempts to set the appropriate language.
   */
  function validateLocaleAndSetLanguage(locale: string, sys: {
    getExecutingFilePath(): string;
    resolvePath(path: string): string;
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string | undefined;
  }, errors?: Push<Diagnostic>): void;
  function getOriginalNode(node: Node): Node;
  function getOriginalNode<T extends Node>(node: Node, nodeTest: (node: Node) => node is T): T;
  function getOriginalNode(node: Node | undefined): Node | undefined;
  function getOriginalNode<T extends Node>(node: Node | undefined, nodeTest: (node: Node | undefined) => node is T): T | undefined;
  /**
   * Gets a value indicating whether a node originated in the parse tree.
   *
   * @param node The node to test.
   */
  function isParseTreeNode(node: Node): boolean;
  /**
   * Gets the original parse tree node for a node.
   *
   * @param node The original node.
   * @returns The original parse tree node if found; otherwise, undefined.
   */
  function getParseTreeNode(node: Node): Node;
  /**
   * Gets the original parse tree node for a node.
   *
   * @param node The original node.
   * @param nodeTest A callback used to ensure the correct type of parse tree node is returned.
   * @returns The original parse tree node if found; otherwise, undefined.
   */
  function getParseTreeNode<T extends Node>(node: Node | undefined, nodeTest?: (node: Node) => node is T): T | undefined;
  /** Add an extra underscore to identifiers that start with two underscores to avoid issues with magic names like '__proto__' */
  function escapeLeadingUnderscores(identifier: string): __String;
  /**
   * Remove extra underscore from escaped identifier text content.
   *
   * @param identifier The escaped identifier text.
   * @returns The unescaped identifier text.
   */
  function unescapeLeadingUnderscores(identifier: __String): string;
  function idText(identifier: Identifier): string;
  function symbolName(symbol: Symbol): string;
  function getNameOfJSDocTypedef(declaration: JSDocTypedefTag): Identifier | undefined;
  /** @internal */
  function isNamedDeclaration(node: Node): node is NamedDeclaration & {
    name: DeclarationName;
  };
  /** @internal */
  function getNonAssignedNameOfDeclaration(declaration: Declaration | Expression): DeclarationName | undefined;
  function getNameOfDeclaration(declaration: Declaration | Expression): DeclarationName | undefined;
  /**
   * Gets the JSDoc parameter tags for the node if present.
   *
   * @remarks Returns any JSDoc param tag whose name matches the provided
   * parameter, whether a param tag on a containing function
   * expression, or a param tag on a variable declaration whose
   * initializer is the containing function. The tags closest to the
   * node are returned first, so in the previous example, the param
   * tag on the containing function expression would be first.
   *
   * For binding patterns, parameter tags are matched by position.
   */
  function getJSDocParameterTags(param: ParameterDeclaration): ReadonlyArray<JSDocParameterTag>;
  /**
   * Gets the JSDoc type parameter tags for the node if present.
   *
   * @remarks Returns any JSDoc template tag whose names match the provided
   * parameter, whether a template tag on a containing function
   * expression, or a template tag on a variable declaration whose
   * initializer is the containing function. The tags closest to the
   * node are returned first, so in the previous example, the template
   * tag on the containing function expression would be first.
   */
  function getJSDocTypeParameterTags(param: TypeParameterDeclaration): ReadonlyArray<JSDocTemplateTag>;
  /**
   * Return true if the node has JSDoc parameter tags.
   *
   * @remarks Includes parameter tags that are not directly on the node,
   * for example on a variable declaration whose initializer is a function expression.
   */
  function hasJSDocParameterTags(node: FunctionLikeDeclaration | SignatureDeclaration): boolean;
  /** Gets the JSDoc augments tag for the node if present */
  function getJSDocAugmentsTag(node: Node): JSDocAugmentsTag | undefined;
  /** Gets the JSDoc class tag for the node if present */
  function getJSDocClassTag(node: Node): JSDocClassTag | undefined;
  /** Gets the JSDoc enum tag for the node if present */
  function getJSDocEnumTag(node: Node): JSDocEnumTag | undefined;
  /** Gets the JSDoc this tag for the node if present */
  function getJSDocThisTag(node: Node): JSDocThisTag | undefined;
  /** Gets the JSDoc return tag for the node if present */
  function getJSDocReturnTag(node: Node): JSDocReturnTag | undefined;
  /** Gets the JSDoc template tag for the node if present */
  function getJSDocTemplateTag(node: Node): JSDocTemplateTag | undefined;
  /** Gets the JSDoc type tag for the node if present and valid */
  function getJSDocTypeTag(node: Node): JSDocTypeTag | undefined;
  /**
   * Gets the type node for the node if provided via JSDoc.
   *
   * @remarks The search includes any JSDoc param tag that relates
   * to the provided parameter, for example a type tag on the
   * parameter itself, or a param tag on a containing function
   * expression, or a param tag on a variable declaration whose
   * initializer is the containing function. The tags closest to the
   * node are examined first, so in the previous example, the type
   * tag directly on the node would be returned.
   */
  function getJSDocType(node: Node): TypeNode | undefined;
  /**
   * Gets the return type node for the node if provided via JSDoc return tag or type tag.
   *
   * @remarks `getJSDocReturnTag` just gets the whole JSDoc tag. This function
   * gets the type from inside the braces, after the fat arrow, etc.
   */
  function getJSDocReturnType(node: Node): TypeNode | undefined;
  /** Get all JSDoc tags related to a node, including those on parent nodes. */
  function getJSDocTags(node: Node): ReadonlyArray<JSDocTag>;
  /** Gets all JSDoc tags of a specified kind, or undefined if not present. */
  function getAllJSDocTagsOfKind(node: Node, kind: SyntaxKind): ReadonlyArray<JSDocTag>;
  /**
   * Gets the effective type parameters. If the node was parsed in a
   * JavaScript file, gets the type parameters from the `@template` tag from JSDoc.
   */
  function getEffectiveTypeParameterDeclarations(node: DeclarationWithTypeParameters): ReadonlyArray<TypeParameterDeclaration>;
  function getEffectiveConstraintOfTypeParameter(node: TypeParameterDeclaration): TypeNode | undefined;
}
declare namespace ts {
  function isNumericLiteral(node: Node): node is NumericLiteral;
  function isBigIntLiteral(node: Node): node is BigIntLiteral;
  function isStringLiteral(node: Node): node is StringLiteral;
  function isJsxText(node: Node): node is JsxText;
  function isRegularExpressionLiteral(node: Node): node is RegularExpressionLiteral;
  function isNoSubstitutionTemplateLiteral(node: Node): node is NoSubstitutionTemplateLiteral;
  function isTemplateHead(node: Node): node is TemplateHead;
  function isTemplateMiddle(node: Node): node is TemplateMiddle;
  function isTemplateTail(node: Node): node is TemplateTail;
  function isIdentifier(node: Node): node is Identifier;
  function isQualifiedName(node: Node): node is QualifiedName;
  function isComputedPropertyName(node: Node): node is ComputedPropertyName;
  function isTypeParameterDeclaration(node: Node): node is TypeParameterDeclaration;
  function isParameter(node: Node): node is ParameterDeclaration;
  function isDecorator(node: Node): node is Decorator;
  function isPropertySignature(node: Node): node is PropertySignature;
  function isPropertyDeclaration(node: Node): node is PropertyDeclaration;
  function isMethodSignature(node: Node): node is MethodSignature;
  function isMethodDeclaration(node: Node): node is MethodDeclaration;
  function isConstructorDeclaration(node: Node): node is ConstructorDeclaration;
  function isGetAccessorDeclaration(node: Node): node is GetAccessorDeclaration;
  function isSetAccessorDeclaration(node: Node): node is SetAccessorDeclaration;
  function isCallSignatureDeclaration(node: Node): node is CallSignatureDeclaration;
  function isConstructSignatureDeclaration(node: Node): node is ConstructSignatureDeclaration;
  function isIndexSignatureDeclaration(node: Node): node is IndexSignatureDeclaration;
  function isGetOrSetAccessorDeclaration(node: Node): node is AccessorDeclaration;
  function isTypePredicateNode(node: Node): node is TypePredicateNode;
  function isTypeReferenceNode(node: Node): node is TypeReferenceNode;
  function isFunctionTypeNode(node: Node): node is FunctionTypeNode;
  function isConstructorTypeNode(node: Node): node is ConstructorTypeNode;
  function isTypeQueryNode(node: Node): node is TypeQueryNode;
  function isTypeLiteralNode(node: Node): node is TypeLiteralNode;
  function isArrayTypeNode(node: Node): node is ArrayTypeNode;
  function isTupleTypeNode(node: Node): node is TupleTypeNode;
  function isUnionTypeNode(node: Node): node is UnionTypeNode;
  function isIntersectionTypeNode(node: Node): node is IntersectionTypeNode;
  function isConditionalTypeNode(node: Node): node is ConditionalTypeNode;
  function isInferTypeNode(node: Node): node is InferTypeNode;
  function isParenthesizedTypeNode(node: Node): node is ParenthesizedTypeNode;
  function isThisTypeNode(node: Node): node is ThisTypeNode;
  function isTypeOperatorNode(node: Node): node is TypeOperatorNode;
  function isIndexedAccessTypeNode(node: Node): node is IndexedAccessTypeNode;
  function isMappedTypeNode(node: Node): node is MappedTypeNode;
  function isLiteralTypeNode(node: Node): node is LiteralTypeNode;
  function isImportTypeNode(node: Node): node is ImportTypeNode;
  function isObjectBindingPattern(node: Node): node is ObjectBindingPattern;
  function isArrayBindingPattern(node: Node): node is ArrayBindingPattern;
  function isBindingElement(node: Node): node is BindingElement;
  function isArrayLiteralExpression(node: Node): node is ArrayLiteralExpression;
  function isObjectLiteralExpression(node: Node): node is ObjectLiteralExpression;
  function isPropertyAccessExpression(node: Node): node is PropertyAccessExpression;
  function isElementAccessExpression(node: Node): node is ElementAccessExpression;
  function isCallExpression(node: Node): node is CallExpression;
  function isNewExpression(node: Node): node is NewExpression;
  function isTaggedTemplateExpression(node: Node): node is TaggedTemplateExpression;
  function isTypeAssertion(node: Node): node is TypeAssertion;
  function isConstTypeReference(node: Node): boolean;
  function isParenthesizedExpression(node: Node): node is ParenthesizedExpression;
  function skipPartiallyEmittedExpressions(node: Expression): Expression;
  function skipPartiallyEmittedExpressions(node: Node): Node;
  function isFunctionExpression(node: Node): node is FunctionExpression;
  function isArrowFunction(node: Node): node is ArrowFunction;
  function isDeleteExpression(node: Node): node is DeleteExpression;
  function isTypeOfExpression(node: Node): node is TypeOfExpression;
  function isVoidExpression(node: Node): node is VoidExpression;
  function isAwaitExpression(node: Node): node is AwaitExpression;
  function isPrefixUnaryExpression(node: Node): node is PrefixUnaryExpression;
  function isPostfixUnaryExpression(node: Node): node is PostfixUnaryExpression;
  function isBinaryExpression(node: Node): node is BinaryExpression;
  function isConditionalExpression(node: Node): node is ConditionalExpression;
  function isTemplateExpression(node: Node): node is TemplateExpression;
  function isYieldExpression(node: Node): node is YieldExpression;
  function isSpreadElement(node: Node): node is SpreadElement;
  function isClassExpression(node: Node): node is ClassExpression;
  function isOmittedExpression(node: Node): node is OmittedExpression;
  function isExpressionWithTypeArguments(node: Node): node is ExpressionWithTypeArguments;
  function isAsExpression(node: Node): node is AsExpression;
  function isNonNullExpression(node: Node): node is NonNullExpression;
  function isMetaProperty(node: Node): node is MetaProperty;
  function isTemplateSpan(node: Node): node is TemplateSpan;
  function isSemicolonClassElement(node: Node): node is SemicolonClassElement;
  function isBlock(node: Node): node is Block;
  function isVariableStatement(node: Node): node is VariableStatement;
  function isEmptyStatement(node: Node): node is EmptyStatement;
  function isExpressionStatement(node: Node): node is ExpressionStatement;
  function isIfStatement(node: Node): node is IfStatement;
  function isDoStatement(node: Node): node is DoStatement;
  function isWhileStatement(node: Node): node is WhileStatement;
  function isForStatement(node: Node): node is ForStatement;
  function isForInStatement(node: Node): node is ForInStatement;
  function isForOfStatement(node: Node): node is ForOfStatement;
  function isContinueStatement(node: Node): node is ContinueStatement;
  function isBreakStatement(node: Node): node is BreakStatement;
  function isBreakOrContinueStatement(node: Node): node is BreakOrContinueStatement;
  function isReturnStatement(node: Node): node is ReturnStatement;
  function isWithStatement(node: Node): node is WithStatement;
  function isSwitchStatement(node: Node): node is SwitchStatement;
  function isLabeledStatement(node: Node): node is LabeledStatement;
  function isThrowStatement(node: Node): node is ThrowStatement;
  function isTryStatement(node: Node): node is TryStatement;
  function isDebuggerStatement(node: Node): node is DebuggerStatement;
  function isVariableDeclaration(node: Node): node is VariableDeclaration;
  function isVariableDeclarationList(node: Node): node is VariableDeclarationList;
  function isFunctionDeclaration(node: Node): node is FunctionDeclaration;
  function isClassDeclaration(node: Node): node is ClassDeclaration;
  function isInterfaceDeclaration(node: Node): node is InterfaceDeclaration;
  function isTypeAliasDeclaration(node: Node): node is TypeAliasDeclaration;
  function isEnumDeclaration(node: Node): node is EnumDeclaration;
  function isModuleDeclaration(node: Node): node is ModuleDeclaration;
  function isModuleBlock(node: Node): node is ModuleBlock;
  function isCaseBlock(node: Node): node is CaseBlock;
  function isNamespaceExportDeclaration(node: Node): node is NamespaceExportDeclaration;
  function isImportEqualsDeclaration(node: Node): node is ImportEqualsDeclaration;
  function isImportDeclaration(node: Node): node is ImportDeclaration;
  function isImportClause(node: Node): node is ImportClause;
  function isNamespaceImport(node: Node): node is NamespaceImport;
  function isNamedImports(node: Node): node is NamedImports;
  function isImportSpecifier(node: Node): node is ImportSpecifier;
  function isExportAssignment(node: Node): node is ExportAssignment;
  function isExportDeclaration(node: Node): node is ExportDeclaration;
  function isNamedExports(node: Node): node is NamedExports;
  function isExportSpecifier(node: Node): node is ExportSpecifier;
  function isMissingDeclaration(node: Node): node is MissingDeclaration;
  function isExternalModuleReference(node: Node): node is ExternalModuleReference;
  function isJsxElement(node: Node): node is JsxElement;
  function isJsxSelfClosingElement(node: Node): node is JsxSelfClosingElement;
  function isJsxOpeningElement(node: Node): node is JsxOpeningElement;
  function isJsxClosingElement(node: Node): node is JsxClosingElement;
  function isJsxFragment(node: Node): node is JsxFragment;
  function isJsxOpeningFragment(node: Node): node is JsxOpeningFragment;
  function isJsxClosingFragment(node: Node): node is JsxClosingFragment;
  function isJsxAttribute(node: Node): node is JsxAttribute;
  function isJsxAttributes(node: Node): node is JsxAttributes;
  function isJsxSpreadAttribute(node: Node): node is JsxSpreadAttribute;
  function isJsxExpression(node: Node): node is JsxExpression;
  function isCaseClause(node: Node): node is CaseClause;
  function isDefaultClause(node: Node): node is DefaultClause;
  function isHeritageClause(node: Node): node is HeritageClause;
  function isCatchClause(node: Node): node is CatchClause;
  function isPropertyAssignment(node: Node): node is PropertyAssignment;
  function isShorthandPropertyAssignment(node: Node): node is ShorthandPropertyAssignment;
  function isSpreadAssignment(node: Node): node is SpreadAssignment;
  function isEnumMember(node: Node): node is EnumMember;
  function isSourceFile(node: Node): node is SourceFile;
  function isBundle(node: Node): node is Bundle;
  function isUnparsedSource(node: Node): node is UnparsedSource;
  function isUnparsedPrepend(node: Node): node is UnparsedPrepend;
  function isUnparsedTextLike(node: Node): node is UnparsedTextLike;
  function isUnparsedNode(node: Node): node is UnparsedNode;
  function isJSDocTypeExpression(node: Node): node is JSDocTypeExpression;
  function isJSDocAllType(node: JSDocAllType): node is JSDocAllType;
  function isJSDocUnknownType(node: Node): node is JSDocUnknownType;
  function isJSDocNullableType(node: Node): node is JSDocNullableType;
  function isJSDocNonNullableType(node: Node): node is JSDocNonNullableType;
  function isJSDocOptionalType(node: Node): node is JSDocOptionalType;
  function isJSDocFunctionType(node: Node): node is JSDocFunctionType;
  function isJSDocVariadicType(node: Node): node is JSDocVariadicType;
  function isJSDoc(node: Node): node is JSDoc;
  function isJSDocAuthorTag(node: Node): node is JSDocAuthorTag;
  function isJSDocAugmentsTag(node: Node): node is JSDocAugmentsTag;
  function isJSDocClassTag(node: Node): node is JSDocClassTag;
  function isJSDocEnumTag(node: Node): node is JSDocEnumTag;
  function isJSDocThisTag(node: Node): node is JSDocThisTag;
  function isJSDocParameterTag(node: Node): node is JSDocParameterTag;
  function isJSDocReturnTag(node: Node): node is JSDocReturnTag;
  function isJSDocTypeTag(node: Node): node is JSDocTypeTag;
  function isJSDocTemplateTag(node: Node): node is JSDocTemplateTag;
  function isJSDocTypedefTag(node: Node): node is JSDocTypedefTag;
  function isJSDocPropertyTag(node: Node): node is JSDocPropertyTag;
  function isJSDocPropertyLikeTag(node: Node): node is JSDocPropertyLikeTag;
  function isJSDocTypeLiteral(node: Node): node is JSDocTypeLiteral;
  function isJSDocCallbackTag(node: Node): node is JSDocCallbackTag;
  function isJSDocSignature(node: Node): node is JSDocSignature;
}
declare namespace ts {
  function isSyntaxList(n: Node): n is SyntaxList;
  function isNode(node: Node): boolean;
  function isNodeKind(kind: SyntaxKind): boolean;
  /**
   * True if node is of some token syntax kind.
   * For example, this is true for an IfKeyword but not for an IfStatement.
   * Literals are considered tokens, except TemplateLiteral, but does include TemplateHead/Middle/Tail.
   */
  function isToken(n: Node): boolean;
  function isNodeArray<T extends Node>(array: ReadonlyArray<T>): array is NodeArray<T>;
  function isLiteralKind(kind: SyntaxKind): boolean;
  function isLiteralExpression(node: Node): node is LiteralExpression;
  function isTemplateLiteralKind(kind: SyntaxKind): boolean;
  type TemplateLiteralToken = NoSubstitutionTemplateLiteral | TemplateHead | TemplateMiddle | TemplateTail;
  function isTemplateLiteralToken(node: Node): node is TemplateLiteralToken;
  function isTemplateMiddleOrTemplateTail(node: Node): node is TemplateMiddle | TemplateTail;
  function isImportOrExportSpecifier(node: Node): node is ImportSpecifier | ExportSpecifier;
  function isStringTextContainingNode(node: Node): node is StringLiteral | TemplateLiteralToken;
  function isGeneratedIdentifier(node: Node): node is GeneratedIdentifier;
  function isModifierKind(token: SyntaxKind): token is Modifier["kind"];
  function isParameterPropertyModifier(kind: SyntaxKind): boolean;
  function isClassMemberModifier(idToken: SyntaxKind): boolean;
  function isModifier(node: Node): node is Modifier;
  function isEntityName(node: Node): node is EntityName;
  function isPropertyName(node: Node): node is PropertyName;
  function isBindingName(node: Node): node is BindingName;
  function isFunctionLike(node: Node): node is SignatureDeclaration;
  function isFunctionLikeDeclaration(node: Node): node is FunctionLikeDeclaration;
  function isFunctionLikeKind(kind: SyntaxKind): boolean;
  function isFunctionOrModuleBlock(node: Node): boolean;
  function isClassElement(node: Node): node is ClassElement;
  function isClassLike(node: Node): node is ClassLikeDeclaration;
  function isAccessor(node: Node): node is AccessorDeclaration;
  function isMethodOrAccessor(node: Node): node is MethodDeclaration | AccessorDeclaration;
  function isTypeElement(node: Node): node is TypeElement;
  function isClassOrTypeElement(node: Node): node is ClassElement | TypeElement;
  function isObjectLiteralElementLike(node: Node): node is ObjectLiteralElementLike;
  /**
   * Node test that determines whether a node is a valid type node.
   * This differs from the `isPartOfTypeNode` function which determines whether a node is *part*
   * of a TypeNode.
   */
  function isTypeNode(node: Node): node is TypeNode;
  function isFunctionOrConstructorTypeNode(node: Node): node is FunctionTypeNode | ConstructorTypeNode;
  function isBindingPattern(node: Node | undefined): node is BindingPattern;
  function isAssignmentPattern(node: Node): node is AssignmentPattern;
  function isArrayBindingElement(node: Node): node is ArrayBindingElement;
  /**
   * Determines whether the BindingOrAssignmentElement is a BindingElement-like declaration
   */
  function isDeclarationBindingElement(bindingElement: BindingOrAssignmentElement): bindingElement is VariableDeclaration | ParameterDeclaration | BindingElement;
  /**
   * Determines whether a node is a BindingOrAssignmentPattern
   */
  function isBindingOrAssignmentPattern(node: BindingOrAssignmentElementTarget): node is BindingOrAssignmentPattern;
  /**
   * Determines whether a node is an ObjectBindingOrAssignmentPattern
   */
  function isObjectBindingOrAssignmentPattern(node: BindingOrAssignmentElementTarget): node is ObjectBindingOrAssignmentPattern;
  /**
   * Determines whether a node is an ArrayBindingOrAssignmentPattern
   */
  function isArrayBindingOrAssignmentPattern(node: BindingOrAssignmentElementTarget): node is ArrayBindingOrAssignmentPattern;
  function isPropertyAccessOrQualifiedNameOrImportTypeNode(node: Node): node is PropertyAccessExpression | QualifiedName | ImportTypeNode;
  function isPropertyAccessOrQualifiedName(node: Node): node is PropertyAccessExpression | QualifiedName;
  function isCallLikeExpression(node: Node): node is CallLikeExpression;
  function isCallOrNewExpression(node: Node): node is CallExpression | NewExpression;
  function isTemplateLiteral(node: Node): node is TemplateLiteral;
  function isLeftHandSideExpression(node: Node): node is LeftHandSideExpression;
  function isUnaryExpression(node: Node): node is UnaryExpression;
  function isUnaryExpressionWithWrite(expr: Node): expr is PrefixUnaryExpression | PostfixUnaryExpression;
  /**
   * Determines whether a node is an expression based only on its kind.
   * Use `isExpressionNode` if not in transforms.
   */
  function isExpression(node: Node): node is Expression;
  function isAssertionExpression(node: Node): node is AssertionExpression;
  function isPartiallyEmittedExpression(node: Node): node is PartiallyEmittedExpression;
  function isNotEmittedStatement(node: Node): node is NotEmittedStatement;
  function isNotEmittedOrPartiallyEmittedNode(node: Node): node is NotEmittedStatement | PartiallyEmittedExpression;
  function isIterationStatement(node: Node, lookInLabeledStatements: false): node is IterationStatement;
  function isIterationStatement(node: Node, lookInLabeledStatements: boolean): node is IterationStatement | LabeledStatement;
  function isForInOrOfStatement(node: Node): node is ForInOrOfStatement;
  function isConciseBody(node: Node): node is ConciseBody;
  function isFunctionBody(node: Node): node is FunctionBody;
  function isForInitializer(node: Node): node is ForInitializer;
  function isModuleBody(node: Node): node is ModuleBody;
  function isNamespaceBody(node: Node): node is NamespaceBody;
  function isJSDocNamespaceBody(node: Node): node is JSDocNamespaceBody;
  function isNamedImportBindings(node: Node): node is NamedImportBindings;
  function isModuleOrEnumDeclaration(node: Node): node is ModuleDeclaration | EnumDeclaration;
  function isDeclaration(node: Node): node is NamedDeclaration;
  function isDeclarationStatement(node: Node): node is DeclarationStatement;
  /**
   * Determines whether the node is a statement that is not also a declaration
   */
  function isStatementButNotDeclaration(node: Node): node is Statement;
  function isStatement(node: Node): node is Statement;
  function isModuleReference(node: Node): node is ModuleReference;
  function isJsxTagNameExpression(node: Node): node is JsxTagNameExpression;
  function isJsxChild(node: Node): node is JsxChild;
  function isJsxAttributeLike(node: Node): node is JsxAttributeLike;
  function isStringLiteralOrJsxExpression(node: Node): node is StringLiteral | JsxExpression;
  function isJsxOpeningLikeElement(node: Node): node is JsxOpeningLikeElement;
  function isCaseOrDefaultClause(node: Node): node is CaseOrDefaultClause;
  /** True if node is of some JSDoc syntax kind. */
  function isJSDocNode(node: Node): boolean;
  /** True if node is of a kind that may contain comment text. */
  function isJSDocCommentContainingNode(node: Node): boolean;
  function isJSDocTag(node: Node): node is JSDocTag;
  function isSetAccessor(node: Node): node is SetAccessorDeclaration;
  function isGetAccessor(node: Node): node is GetAccessorDeclaration;
  /** True if has jsdoc nodes attached to it. */
  function hasJSDocNodes(node: Node): node is HasJSDoc;
  /** True if has type node attached to it. */
  function hasType(node: Node): node is HasType;
  /** True if has initializer node attached to it. */
  function hasInitializer(node: Node): node is HasInitializer;
  /** True if has initializer node attached to it. */
  function hasOnlyExpressionInitializer(node: Node): node is HasExpressionInitializer;
  function isObjectLiteralElement(node: Node): node is ObjectLiteralElement;
  function isTypeReferenceType(node: Node): node is TypeReferenceType;
  function guessIndentation(lines: string[]): number | undefined;
  function isStringLiteralLike(node: Node): node is StringLiteralLike;
}
declare namespace ts {
  function isNamedImportsOrExports(node: Node): node is NamedImportsOrExports;
  interface ObjectAllocator {
    getNodeConstructor(): new (kind: SyntaxKind, pos?: number, end?: number) => Node;
    getTokenConstructor(): new <TKind extends SyntaxKind>(kind: TKind, pos?: number, end?: number) => Token<TKind>;
    getIdentifierConstructor(): new (kind: SyntaxKind.Identifier, pos?: number, end?: number) => Identifier;
    getSourceFileConstructor(): new (kind: SyntaxKind.SourceFile, pos?: number, end?: number) => SourceFile;
    getSymbolConstructor(): new (flags: SymbolFlags, name: __String) => Symbol;
    getTypeConstructor(): new (checker: TypeChecker, flags: TypeFlags) => Type;
    getSignatureConstructor(): new (checker: TypeChecker) => Signature;
    getSourceMapSourceConstructor(): new (fileName: string, text: string, skipTrivia?: (pos: number) => number) => SourceMapSource;
  }
  let objectAllocator: ObjectAllocator;
  function formatStringFromArgs(text: string, args: ArrayLike<string | number>, baseIndex?: number): string;
  let localizedDiagnosticMessages: MapLike<string> | undefined;
  function getLocaleSpecificMessage(message: DiagnosticMessage): string;
  function createFileDiagnostic(file: SourceFile, start: number, length: number, message: DiagnosticMessage, ...args: (string | number | undefined)[]): DiagnosticWithLocation;
  function formatMessage(_dummy: any, message: DiagnosticMessage, ...args: (string | number | undefined)[]): string;
  function createCompilerDiagnostic(message: DiagnosticMessage, ...args: (string | number | undefined)[]): Diagnostic;
  function createCompilerDiagnosticFromMessageChain(chain: DiagnosticMessageChain): Diagnostic;
  function chainDiagnosticMessages(details: DiagnosticMessageChain | DiagnosticMessageChain[] | undefined, message: DiagnosticMessage, ...args: (string | number | undefined)[]): DiagnosticMessageChain;
  function concatenateDiagnosticMessageChains(headChain: DiagnosticMessageChain, tailChain: DiagnosticMessageChain): void;
  function compareDiagnostics(d1: Diagnostic, d2: Diagnostic): Comparison;
  function compareDiagnosticsSkipRelatedInformation(d1: Diagnostic, d2: Diagnostic): Comparison;
  function getEmitScriptTarget(compilerOptions: CompilerOptions): ScriptTarget;
  function getEmitModuleKind(compilerOptions: {
    module?: CompilerOptions["module"];
    target?: CompilerOptions["target"];
  }): ModuleKind.None | ModuleKind.CommonJS | ModuleKind;
  function getEmitModuleResolutionKind(compilerOptions: CompilerOptions): ModuleResolutionKind;
  function hasJsonModuleEmitEnabled(options: CompilerOptions): boolean;
  function unreachableCodeIsError(options: CompilerOptions): boolean;
  function unusedLabelIsError(options: CompilerOptions): boolean;
  function getAreDeclarationMapsEnabled(options: CompilerOptions): boolean;
  function getAllowSyntheticDefaultImports(compilerOptions: CompilerOptions): boolean;
  function getEmitDeclarations(compilerOptions: CompilerOptions): boolean;
  function isIncrementalCompilation(options: CompilerOptions): boolean;
  type StrictOptionName = "noImplicitAny" | "noImplicitThis" | "strictNullChecks" | "strictFunctionTypes" | "strictBindCallApply" | "strictPropertyInitialization" | "alwaysStrict";
  function getStrictOptionValue(compilerOptions: CompilerOptions, flag: StrictOptionName): boolean;
  function compilerOptionsAffectSemanticDiagnostics(newOptions: CompilerOptions, oldOptions: CompilerOptions): boolean;
  function compilerOptionsAffectEmit(newOptions: CompilerOptions, oldOptions: CompilerOptions): boolean;
  function getCompilerOptionValue(options: CompilerOptions, option: CommandLineOption): unknown;
  function hasZeroOrOneAsteriskCharacter(str: string): boolean;
  /**
   * Internally, we represent paths as strings with '/' as the directory separator.
   * When we make system calls (eg: LanguageServiceHost.getDirectory()),
   * we expect the host to correctly handle paths in our specified format.
   */
  const directorySeparator = "/";
  /**
   * Normalize path separators.
   */
  function normalizeSlashes(path: string): string;
  /**
   * Returns length of the root part of a path or URL (i.e. length of "/", "x:/", "//server/share/, file:///user/files").
   *
   * For example:
   * ```ts
   * getRootLength("a") === 0                   // ""
   * getRootLength("/") === 1                   // "/"
   * getRootLength("c:") === 2                  // "c:"
   * getRootLength("c:d") === 0                 // ""
   * getRootLength("c:/") === 3                 // "c:/"
   * getRootLength("c:\\") === 3                // "c:\\"
   * getRootLength("//server") === 7            // "//server"
   * getRootLength("//server/share") === 8      // "//server/"
   * getRootLength("\\\\server") === 7          // "\\\\server"
   * getRootLength("\\\\server\\share") === 8   // "\\\\server\\"
   * getRootLength("file:///path") === 8        // "file:///"
   * getRootLength("file:///c:") === 10         // "file:///c:"
   * getRootLength("file:///c:d") === 8         // "file:///"
   * getRootLength("file:///c:/path") === 11    // "file:///c:/"
   * getRootLength("file://server") === 13      // "file://server"
   * getRootLength("file://server/path") === 14 // "file://server/"
   * getRootLength("http://server") === 13      // "http://server"
   * getRootLength("http://server/path") === 14 // "http://server/"
   * ```
   */
  function getRootLength(path: string): number;
  function normalizePath(path: string): string;
  function normalizePathAndParts(path: string): {
    path: string;
    parts: string[];
  };
  /**
   * Returns the path except for its basename. Semantics align with NodeJS's `path.dirname`
   * except that we support URL's as well.
   *
   * ```ts
   * getDirectoryPath("/path/to/file.ext") === "/path/to"
   * getDirectoryPath("/path/to/") === "/path"
   * getDirectoryPath("/") === "/"
   * ```
   */
  function getDirectoryPath(path: Path): Path;
  /**
   * Returns the path except for its basename. Semantics align with NodeJS's `path.dirname`
   * except that we support URL's as well.
   *
   * ```ts
   * getDirectoryPath("/path/to/file.ext") === "/path/to"
   * getDirectoryPath("/path/to/") === "/path"
   * getDirectoryPath("/") === "/"
   * ```
   */
  function getDirectoryPath(path: string): string;
  function startsWithDirectory(fileName: string, directoryName: string, getCanonicalFileName: GetCanonicalFileName): boolean;
  function isUrl(path: string): boolean;
  function pathIsRelative(path: string): boolean;
  /**
   * Determines whether a path is an absolute path (e.g. starts with `/`, or a dos path
   * like `c:`, `c:\` or `c:/`).
   */
  function isRootedDiskPath(path: string): boolean;
  /**
   * Determines whether a path consists only of a path root.
   */
  function isDiskPathRoot(path: string): boolean;
  function convertToRelativePath(absoluteOrRelativePath: string, basePath: string, getCanonicalFileName: (path: string) => string): string;
  /**
   * Parse a path into an array containing a root component (at index 0) and zero or more path
   * components (at indices > 0). The result is not normalized.
   * If the path is relative, the root component is `""`.
   * If the path is absolute, the root component includes the first path separator (`/`).
   */
  function getPathComponents(path: string, currentDirectory?: string): string[];
  /**
   * Reduce an array of path components to a more simplified path by navigating any
   * `"."` or `".."` entries in the path.
   */
  function reducePathComponents(components: ReadonlyArray<string>): string[];
  /**
   * Parse a path into an array containing a root component (at index 0) and zero or more path
   * components (at indices > 0). The result is normalized.
   * If the path is relative, the root component is `""`.
   * If the path is absolute, the root component includes the first path separator (`/`).
   */
  function getNormalizedPathComponents(path: string, currentDirectory: string | undefined): string[];
  function getNormalizedAbsolutePath(fileName: string, currentDirectory: string | undefined): string;
  /**
   * Formats a parsed path consisting of a root component (at index 0) and zero or more path
   * segments (at indices > 0).
   */
  function getPathFromPathComponents(pathComponents: ReadonlyArray<string>): string;
  function getNormalizedAbsolutePathWithoutRoot(fileName: string, currentDirectory: string | undefined): string;
}
declare namespace ts {
  function getPathComponentsRelativeTo(from: string, to: string, stringEqualityComparer: (a: string, b: string) => boolean, getCanonicalFileName: GetCanonicalFileName): string[];
  function getRelativePathFromFile(from: string, to: string, getCanonicalFileName: GetCanonicalFileName): string;
  /**
   * Gets a relative path that can be used to traverse between `from` and `to`.
   */
  function getRelativePathFromDirectory(from: string, to: string, ignoreCase: boolean): string;
  /**
   * Gets a relative path that can be used to traverse between `from` and `to`.
   */
  function getRelativePathFromDirectory(fromDirectory: string, to: string, getCanonicalFileName: GetCanonicalFileName): string;
  function getRelativePathToDirectoryOrUrl(directoryPathOrUrl: string, relativeOrAbsolutePath: string, currentDirectory: string, getCanonicalFileName: GetCanonicalFileName, isAbsolutePathAnUrl: boolean): string;
  /**
   * Ensures a path is either absolute (prefixed with `/` or `c:`) or dot-relative (prefixed
   * with `./` or `../`) so as not to be confused with an unprefixed module name.
   */
  function ensurePathIsNonModuleName(path: string): string;
  /**
   * Returns the path except for its containing directory name.
   * Semantics align with NodeJS's `path.basename` except that we support URL's as well.
   *
   * ```ts
   * getBaseFileName("/path/to/file.ext") === "file.ext"
   * getBaseFileName("/path/to/") === "to"
   * getBaseFileName("/") === ""
   * ```
   */
  function getBaseFileName(path: string): string;
  /**
   * Gets the portion of a path following the last (non-terminal) separator (`/`).
   * Semantics align with NodeJS's `path.basename` except that we support URL's as well.
   * If the base name has any one of the provided extensions, it is removed.
   *
   * ```ts
   * getBaseFileName("/path/to/file.ext", ".ext", true) === "file"
   * getBaseFileName("/path/to/file.js", ".ext", true) === "file.js"
   * ```
   */
  function getBaseFileName(path: string, extensions: string | ReadonlyArray<string>, ignoreCase: boolean): string;
  /**
   * Combines paths. If a path is absolute, it replaces any previous path.
   */
  function combinePaths(path: string, ...paths: (string | undefined)[]): string;
  /**
   * Combines and resolves paths. If a path is absolute, it replaces any previous path. Any
   * `.` and `..` path components are resolved.
   */
  function resolvePath(path: string, ...paths: (string | undefined)[]): string;
  /**
   * Determines whether a path has a trailing separator (`/` or `\\`).
   */
  function hasTrailingDirectorySeparator(path: string): boolean;
  /**
   * Removes a trailing directory separator from a path.
   * @param path The path.
   */
  function removeTrailingDirectorySeparator(path: Path): Path;
  function removeTrailingDirectorySeparator(path: string): string;
  /**
   * Adds a trailing directory separator to a path, if it does not already have one.
   * @param path The path.
   */
  function ensureTrailingDirectorySeparator(path: Path): Path;
  function ensureTrailingDirectorySeparator(path: string): string;
  /**
   * Performs a case-sensitive comparison of two paths.
   */
  function comparePathsCaseSensitive(a: string, b: string): Comparison.LessThan | Comparison.LessThan | Comparison | Comparison.GreaterThan;
  /**
   * Performs a case-insensitive comparison of two paths.
   */
  function comparePathsCaseInsensitive(a: string, b: string): Comparison.LessThan | Comparison.LessThan | Comparison | Comparison.GreaterThan;
  function comparePaths(a: string, b: string, ignoreCase?: boolean): Comparison;
  function comparePaths(a: string, b: string, currentDirectory: string, ignoreCase?: boolean): Comparison;
  function containsPath(parent: string, child: string, ignoreCase?: boolean): boolean;
  function containsPath(parent: string, child: string, currentDirectory: string, ignoreCase?: boolean): boolean;
  function tryRemoveDirectoryPrefix(path: string, dirPath: string, getCanonicalFileName: GetCanonicalFileName): string | undefined;
  function regExpEscape(text: string): string;
  function hasExtension(fileName: string): boolean;
  const commonPackageFolders: ReadonlyArray<string>;
  function getRegularExpressionForWildcard(specs: ReadonlyArray<string> | undefined, basePath: string, usage: "files" | "directories" | "exclude"): string | undefined;
  function getRegularExpressionsForWildcards(specs: ReadonlyArray<string> | undefined, basePath: string, usage: "files" | "directories" | "exclude"): ReadonlyArray<string> | undefined;
  /**
   * An "includes" path "foo" is implicitly a glob "foo/** /*" (without the space) if its last component has no extension,
   * and does not contain any glob characters itself.
   */
  function isImplicitGlob(lastPathComponent: string): boolean;
  interface FileSystemEntries {
    readonly files: ReadonlyArray<string>;
    readonly directories: ReadonlyArray<string>;
  }
  interface FileMatcherPatterns {
    /** One pattern for each "include" spec. */
    includeFilePatterns: ReadonlyArray<string> | undefined;
    /** One pattern matching one of any of the "include" specs. */
    includeFilePattern: string | undefined;
    includeDirectoryPattern: string | undefined;
    excludePattern: string | undefined;
    basePaths: ReadonlyArray<string>;
  }
  /** @param path directory of the tsconfig.json */
  function getFileMatcherPatterns(path: string, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string> | undefined, useCaseSensitiveFileNames: boolean, currentDirectory: string): FileMatcherPatterns;
  function getRegexFromPattern(pattern: string, useCaseSensitiveFileNames: boolean): RegExp;
  /** @param path directory of the tsconfig.json */
  function matchFiles(path: string, extensions: ReadonlyArray<string> | undefined, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string> | undefined, useCaseSensitiveFileNames: boolean, currentDirectory: string, depth: number | undefined, getFileSystemEntries: (path: string) => FileSystemEntries, realpath: (path: string) => string): string[];
  function ensureScriptKind(fileName: string, scriptKind: ScriptKind | undefined): ScriptKind;
  function getScriptKindFromFileName(fileName: string): ScriptKind;
  /**
   *  List of supported extensions in order of file resolution precedence.
   */
  const supportedTSExtensions: ReadonlyArray<Extension>;
  const supportedTSExtensionsWithJson: ReadonlyArray<Extension>;
  /** Must have ".d.ts" first because if ".ts" goes first, that will be detected as the extension instead of ".d.ts". */
  const supportedTSExtensionsForExtractExtension: ReadonlyArray<Extension>;
  const supportedJSExtensions: ReadonlyArray<Extension>;
  const supportedJSAndJsonExtensions: ReadonlyArray<Extension>;
  function getSupportedExtensions(options?: CompilerOptions): ReadonlyArray<Extension>;
  function getSupportedExtensions(options?: CompilerOptions, extraFileExtensions?: ReadonlyArray<FileExtensionInfo>): ReadonlyArray<string>;
  function getSuppoertedExtensionsWithJsonIfResolveJsonModule(options: CompilerOptions | undefined, supportedExtensions: ReadonlyArray<string>): ReadonlyArray<string>;
  function hasJSFileExtension(fileName: string): boolean;
  function hasJSOrJsonFileExtension(fileName: string): boolean;
  function hasTSFileExtension(fileName: string): boolean;
  function isSupportedSourceFileName(fileName: string, compilerOptions?: CompilerOptions, extraFileExtensions?: ReadonlyArray<FileExtensionInfo>): boolean;
  /**
   * Extension boundaries by priority. Lower numbers indicate higher priorities, and are
   * aligned to the offset of the highest priority extension in the
   * allSupportedExtensions array.
   */
  enum ExtensionPriority {
    TypeScriptFiles = 0,
    DeclarationAndJavaScriptFiles = 2,
    Highest = 0,
    Lowest = 2
  }
  function getExtensionPriority(path: string, supportedExtensions: ReadonlyArray<string>): ExtensionPriority;
  /**
   * Adjusts an extension priority to be the highest priority within the same range.
   */
  function adjustExtensionPriority(extensionPriority: ExtensionPriority, supportedExtensions: ReadonlyArray<string>): ExtensionPriority;
  /**
   * Gets the next lowest extension priority for a given priority.
   */
  function getNextLowestExtensionPriority(extensionPriority: ExtensionPriority, supportedExtensions: ReadonlyArray<string>): ExtensionPriority;
  function removeFileExtension(path: string): string;
  function tryRemoveExtension(path: string, extension: string): string | undefined;
  function removeExtension(path: string, extension: string): string;
  function changeExtension<T extends string | Path>(path: T, newExtension: string): T;
  function changeAnyExtension(path: string, ext: string): string;
  function changeAnyExtension(path: string, ext: string, extensions: string | ReadonlyArray<string>, ignoreCase: boolean): string;
  function tryParsePattern(pattern: string): Pattern | undefined;
  function positionIsSynthesized(pos: number): boolean;
  /** True if an extension is one of the supported TypeScript extensions. */
  function extensionIsTS(ext: Extension): boolean;
  function resolutionExtensionIsTSOrJson(ext: Extension): boolean;
  /**
   * Gets the extension from a path.
   * Path must have a valid extension.
   */
  function extensionFromPath(path: string): Extension;
  function isAnySupportedFileExtension(path: string): boolean;
  function tryGetExtensionFromPath(path: string): Extension | undefined;
  /**
   * Gets the file extension for a path.
   */
  function getAnyExtensionFromPath(path: string): string;
  /**
   * Gets the file extension for a path, provided it is one of the provided extensions.
   */
  function getAnyExtensionFromPath(path: string, extensions: string | ReadonlyArray<string>, ignoreCase: boolean): string;
  function isCheckJsEnabledForFile(sourceFile: SourceFile, compilerOptions: CompilerOptions): boolean | undefined;
  const emptyFileSystemEntries: FileSystemEntries;
  /**
   * patternStrings contains both pattern strings (containing "*") and regular strings.
   * Return an exact match if possible, or a pattern match, or undefined.
   * (These are verified by verifyCompilerOptions to have 0 or 1 "*" characters.)
   */
  function matchPatternOrExact(patternStrings: ReadonlyArray<string>, candidate: string): string | Pattern | undefined;
  type Mutable<T extends object> = {
    -readonly [K in keyof T]: T[K];
  };
  function sliceAfter<T>(arr: ReadonlyArray<T>, value: T): ReadonlyArray<T>;
  function addRelatedInfo<T extends Diagnostic>(diagnostic: T, ...relatedInformation: DiagnosticRelatedInformation[]): T;
  function minAndMax<T>(arr: ReadonlyArray<T>, getValue: (value: T) => number): {
    readonly min: number;
    readonly max: number;
  };
  interface ReadonlyNodeSet<TNode extends Node> {
    has(node: TNode): boolean;
    forEach(cb: (node: TNode) => void): void;
    some(pred: (node: TNode) => boolean): boolean;
  }
  class NodeSet<TNode extends Node> implements ReadonlyNodeSet<TNode> {
    private map;
    add(node: TNode): void;
    tryAdd(node: TNode): boolean;
    has(node: TNode): boolean;
    forEach(cb: (node: TNode) => void): void;
    some(pred: (node: TNode) => boolean): boolean;
  }
  interface ReadonlyNodeMap<TNode extends Node, TValue> {
    get(node: TNode): TValue | undefined;
    has(node: TNode): boolean;
  }
  class NodeMap<TNode extends Node, TValue> implements ReadonlyNodeMap<TNode, TValue> {
    private map;
    get(node: TNode): TValue | undefined;
    getOrUpdate(node: TNode, setValue: () => TValue): TValue;
    set(node: TNode, value: TValue): void;
    has(node: TNode): boolean;
    forEach(cb: (value: TValue, node: TNode) => void): void;
  }
  function rangeOfNode(node: Node): TextRange;
  function rangeOfTypeParameters(typeParameters: NodeArray<TypeParameterDeclaration>): TextRange;
  function skipTypeChecking(sourceFile: SourceFile, options: CompilerOptions): boolean | undefined;
  function isJsonEqual(a: unknown, b: unknown): boolean;
  function getOrUpdate<T>(map: Map<T>, key: string, getDefault: () => T): T;
  /**
   * Converts a bigint literal string, e.g. `0x1234n`,
   * to its decimal string representation, e.g. `4660`.
   */
  function parsePseudoBigInt(stringValue: string): string;
  function pseudoBigIntToString({ negative, base10Value }: PseudoBigInt): string;
}
declare namespace ts {
  function createNode(kind: SyntaxKind, pos?: number, end?: number): Node;
  function isJSDocLikeText(text: string, start: number): boolean;
  /**
   * Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
   * stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
   * embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
   * a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
   *
   * @param node a given node to visit its children
   * @param cbNode a callback to be invoked for all child nodes
   * @param cbNodes a callback to be invoked for embedded array
   *
   * @remarks `forEachChild` must visit the children of a node in the order
   * that they appear in the source code. The language service depends on this property to locate nodes by position.
   */
  function forEachChild<T>(node: Node, cbNode: (node: Node) => T | undefined, cbNodes?: (nodes: NodeArray<Node>) => T | undefined): T | undefined;
  function createSourceFile(fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes?: boolean, scriptKind?: ScriptKind): SourceFile;
  function parseIsolatedEntityName(text: string, languageVersion: ScriptTarget): EntityName | undefined;
  /**
   * Parse json text into SyntaxTree and return node and parse errors if any
   * @param fileName
   * @param sourceText
   */
  function parseJsonText(fileName: string, sourceText: string): JsonSourceFile;
  function isExternalModule(file: SourceFile): boolean;
  function updateSourceFile(sourceFile: SourceFile, newText: string, textChangeRange: TextChangeRange, aggressiveChecks?: boolean): SourceFile;
  function parseIsolatedJSDocComment(content: string, start?: number, length?: number): {
    jsDoc: JSDoc;
    diagnostics: Diagnostic[];
  } | undefined;
  function parseJSDocTypeExpressionForTests(content: string, start?: number, length?: number): {
    jsDocTypeExpression: JSDocTypeExpression;
    diagnostics: Diagnostic[];
  } | undefined;
  /** @internal */
  function isDeclarationFileName(fileName: string): boolean;
  interface PragmaContext {
    languageVersion: ScriptTarget;
    pragmas?: PragmaMap;
    checkJsDirective?: CheckJsDirective;
    referencedFiles: FileReference[];
    typeReferenceDirectives: FileReference[];
    libReferenceDirectives: FileReference[];
    amdDependencies: AmdDependency[];
    hasNoDefaultLib?: boolean;
    moduleName?: string;
  }
  function processCommentPragmas(context: PragmaContext, sourceText: string): void;
  type PragmaDiagnosticReporter = (pos: number, length: number, message: DiagnosticMessage) => void;
  function processPragmasIntoFields(context: PragmaContext, reportDiagnostic: PragmaDiagnosticReporter): void;
  /** @internal */
  function tagNamesAreEquivalent(lhs: JsxTagNameExpression, rhs: JsxTagNameExpression): boolean;
}
declare namespace ts {
  export const compileOnSaveCommandLineOption: CommandLineOption;
  /**
   * An array of supported "lib" reference file names used to determine the order for inclusion
   * when referenced, as well as for spelling suggestions. This ensures the correct ordering for
   * overload resolution when a type declared in one lib is extended by another.
   */
  export const libs: string[];
  /**
   * A map of lib names to lib files. This map is used both for parsing the "lib" command line
   * option as well as for resolving lib reference directives.
   */
  export const libMap: Map<string>;
  export const commonOptionsWithBuild: CommandLineOption[];
  export const optionDeclarations: CommandLineOption[];
  export const semanticDiagnosticsOptionDeclarations: ReadonlyArray<CommandLineOption>;
  export const affectsEmitOptionDeclarations: ReadonlyArray<CommandLineOption>;
  export const moduleResolutionOptionDeclarations: ReadonlyArray<CommandLineOption>;
  export const sourceFileAffectingCompilerOptions: ReadonlyArray<CommandLineOption>;
  export const buildOpts: CommandLineOption[];
  export const typeAcquisitionDeclarations: CommandLineOption[];
  export interface OptionNameMap {
    optionNameMap: Map<CommandLineOption>;
    shortOptionNames: Map<string>;
  }
  export const defaultInitCompilerOptions: CompilerOptions;
  export function convertEnableAutoDiscoveryToEnable(typeAcquisition: TypeAcquisition): TypeAcquisition;
  export function getOptionNameMap(): OptionNameMap;
  export function createOptionNameMap(optionDeclarations: ReadonlyArray<CommandLineOption>): OptionNameMap;
  export function createCompilerDiagnosticForInvalidCustomType(opt: CommandLineOptionOfCustomType): Diagnostic;
  export function parseCustomTypeOption(opt: CommandLineOptionOfCustomType, value: string, errors: Push<Diagnostic>): string | number | undefined;
  export function parseListTypeOption(opt: CommandLineOptionOfListType, value: string | undefined, errors: Push<Diagnostic>): (string | number)[] | undefined;
  export function parseCommandLine(commandLine: ReadonlyArray<string>, readFile?: (path: string) => string | undefined): ParsedCommandLine;
  /** @internal */
  export function getOptionFromName(optionName: string, allowShort?: boolean): CommandLineOption | undefined;
  export interface ParsedBuildCommand {
    buildOptions: BuildOptions;
    projects: string[];
    errors: Diagnostic[];
  }
  export function parseBuildCommand(args: string[]): ParsedBuildCommand;
  export function printVersion(): void;
  export function printHelp(optionsList: ReadonlyArray<CommandLineOption>, syntaxPrefix?: string): void;
  export type DiagnosticReporter = (diagnostic: Diagnostic) => void;
  /**
   * Reports config file diagnostics
   */
  export interface ConfigFileDiagnosticsReporter {
    /**
     * Reports unrecoverable error when parsing config file
     */
    onUnRecoverableConfigFileDiagnostic: DiagnosticReporter;
  }
  /**
   * Interface extending ParseConfigHost to support ParseConfigFile that reads config file and reports errors
   */
  export interface ParseConfigFileHost extends ParseConfigHost, ConfigFileDiagnosticsReporter {
    getCurrentDirectory(): string;
  }
  /**
   * Reads the config file, reports errors if any and exits if the config file cannot be found
   */
  export function getParsedCommandLineOfConfigFile(configFileName: string, optionsToExtend: CompilerOptions, host: ParseConfigFileHost, extendedConfigCache?: Map<ExtendedConfigCacheEntry>): ParsedCommandLine | undefined;
  /**
   * Read tsconfig.json file
   * @param fileName The path to the config file
   */
  export function readConfigFile(fileName: string, readFile: (path: string) => string | undefined): {
    config?: any;
    error?: Diagnostic;
  };
  /**
   * Parse the text of the tsconfig.json file
   * @param fileName The path to the config file
   * @param jsonText The text of the config file
   */
  export function parseConfigFileTextToJson(fileName: string, jsonText: string): {
    config?: any;
    error?: Diagnostic;
  };
  /**
   * Read tsconfig.json file
   * @param fileName The path to the config file
   */
  export function readJsonConfigFile(fileName: string, readFile: (path: string) => string | undefined): TsConfigSourceFile;
  interface JsonConversionNotifier {
    /**
     * Notifies parent option object is being set with the optionKey and a valid optionValue
     * Currently it notifies only if there is element with type object (parentOption) and
     * has element's option declarations map associated with it
     * @param parentOption parent option name in which the option and value are being set
     * @param option option declaration which is being set with the value
     * @param value value of the option
     */
    onSetValidOptionKeyValueInParent(parentOption: string, option: CommandLineOption, value: CompilerOptionsValue): void;
    /**
     * Notify when valid root key value option is being set
     * @param key option key
     * @param keyNode node corresponding to node in the source file
     * @param value computed value of the key
     * @param ValueNode node corresponding to value in the source file
     */
    onSetValidOptionKeyValueInRoot(key: string, keyNode: PropertyName, value: CompilerOptionsValue, valueNode: Expression): void;
    /**
     * Notify when unknown root key value option is being set
     * @param key option key
     * @param keyNode node corresponding to node in the source file
     * @param value computed value of the key
     * @param ValueNode node corresponding to value in the source file
     */
    onSetUnknownOptionKeyValueInRoot(key: string, keyNode: PropertyName, value: CompilerOptionsValue, valueNode: Expression): void;
  }
  /**
   * Convert the json syntax tree into the json value
   */
  export function convertToObject(sourceFile: JsonSourceFile, errors: Push<Diagnostic>): any;
  /**
   * Convert the json syntax tree into the json value and report errors
   * This returns the json value (apart from checking errors) only if returnValue provided is true.
   * Otherwise it just checks the errors and returns undefined
   */
  export function convertToObjectWorker(sourceFile: JsonSourceFile, errors: Push<Diagnostic>, returnValue: boolean, knownRootOptions: CommandLineOption | undefined, jsonConversionNotifier: JsonConversionNotifier | undefined): any;
  /** @internal */
  export interface TSConfig {
    compilerOptions: CompilerOptions;
    compileOnSave: boolean | undefined;
    exclude?: ReadonlyArray<string>;
    files: ReadonlyArray<string> | undefined;
    include?: ReadonlyArray<string>;
    references: ReadonlyArray<ProjectReference> | undefined;
  }
  /**
   * Generate an uncommented, complete tsconfig for use with "--showConfig"
   * @param configParseResult options to be generated into tsconfig.json
   * @param configFileName name of the parsed config file - output paths will be generated relative to this
   * @param host provides current directory and case sensitivity services
   */
  /** @internal */
  export function convertToTSConfig(configParseResult: ParsedCommandLine, configFileName: string, host: {
    getCurrentDirectory(): string;
    useCaseSensitiveFileNames: boolean;
  }): TSConfig;
  /**
   * Generate tsconfig configuration when running command line "--init"
   * @param options commandlineOptions to be generated into tsconfig.json
   * @param fileNames array of filenames to be generated into tsconfig.json
   */
  export function generateTSConfig(options: CompilerOptions, fileNames: ReadonlyArray<string>, newLine: string): string;
  /**
   * Parse the contents of a config file (tsconfig.json).
   * @param json The contents of the config file to parse
   * @param host Instance of ParseConfigHost used to enumerate files in folder.
   * @param basePath A root directory to resolve relative path entries in the config
   *    file to. e.g. outDir
   */
  export function parseJsonConfigFileContent(json: any, host: ParseConfigHost, basePath: string, existingOptions?: CompilerOptions, configFileName?: string, resolutionStack?: Path[], extraFileExtensions?: ReadonlyArray<FileExtensionInfo>, extendedConfigCache?: Map<ExtendedConfigCacheEntry>): ParsedCommandLine;
  /**
   * Parse the contents of a config file (tsconfig.json).
   * @param jsonNode The contents of the config file to parse
   * @param host Instance of ParseConfigHost used to enumerate files in folder.
   * @param basePath A root directory to resolve relative path entries in the config
   *    file to. e.g. outDir
   */
  export function parseJsonSourceFileConfigFileContent(sourceFile: TsConfigSourceFile, host: ParseConfigHost, basePath: string, existingOptions?: CompilerOptions, configFileName?: string, resolutionStack?: Path[], extraFileExtensions?: ReadonlyArray<FileExtensionInfo>, extendedConfigCache?: Map<ExtendedConfigCacheEntry>): ParsedCommandLine;
  export function setConfigFileInOptions(options: CompilerOptions, configFile: TsConfigSourceFile | undefined): void;
  export function canJsonReportNoInutFiles(raw: any): boolean;
  export function updateErrorForNoInputFiles(result: ExpandResult, configFileName: string, configFileSpecs: ConfigFileSpecs, configParseDiagnostics: Diagnostic[], canJsonReportNoInutFiles: boolean): boolean;
  export interface ParsedTsconfig {
    raw: any;
    options?: CompilerOptions;
    typeAcquisition?: TypeAcquisition;
    /**
     * Note that the case of the config path has not yet been normalized, as no files have been imported into the project yet
     */
    extendedConfigPath?: string;
  }
  export interface ExtendedConfigCacheEntry {
    extendedResult: TsConfigSourceFile;
    extendedConfig: ParsedTsconfig | undefined;
  }
  export function convertCompilerOptionsFromJson(jsonOptions: any, basePath: string, configFileName?: string): {
    options: CompilerOptions;
    errors: Diagnostic[];
  };
  export function convertTypeAcquisitionFromJson(jsonOptions: any, basePath: string, configFileName?: string): {
    options: TypeAcquisition;
    errors: Diagnostic[];
  };
  /**
   * Gets the file names from the provided config file specs that contain, files, include, exclude and
   * other properties needed to resolve the file names
   * @param spec The config file specs extracted with file names to include, wildcards to include/exclude and other details
   * @param basePath The base path for any relative file specifications.
   * @param options Compiler options.
   * @param host The host used to resolve files and directories.
   * @param extraFileExtensions optionaly file extra file extension information from host
   */
  export function getFileNamesFromConfigSpecs(spec: ConfigFileSpecs, basePath: string, options: CompilerOptions, host: ParseConfigHost, extraFileExtensions?: ReadonlyArray<FileExtensionInfo>): ExpandResult;
  /**
   * Produces a cleaned version of compiler options with personally identifying info (aka, paths) removed.
   * Also converts enum values back to strings.
   */
  export function convertCompilerOptionsForTelemetry(opts: CompilerOptions): CompilerOptions;
  export {};
}
declare namespace ts {
  function trace(host: ModuleResolutionHost, message: DiagnosticMessage, ...args: any[]): void;
  function isTraceEnabled(compilerOptions: CompilerOptions, host: ModuleResolutionHost): boolean;
  /** Array that is only intended to be pushed to, never read. */
  interface Push<T> {
    push(value: T): void;
  }
  function getPackageJsonTypesVersionsPaths(typesVersions: MapLike<MapLike<string[]>>): {
    version: string;
    paths: MapLike<string[]>;
  } | undefined;
  function getEffectiveTypeRoots(options: CompilerOptions, host: GetEffectiveTypeRootsHost): string[] | undefined;
  /**
   * @param {string | undefined} containingFile - file that contains type reference directive, can be undefined if containing file is unknown.
   * This is possible in case if resolution is performed for directives specified via 'types' parameter. In this case initial path for secondary lookups
   * is assumed to be the same as root directory of the project.
   */
  function resolveTypeReferenceDirective(typeReferenceDirectiveName: string, containingFile: string | undefined, options: CompilerOptions, host: ModuleResolutionHost, redirectedReference?: ResolvedProjectReference): ResolvedTypeReferenceDirectiveWithFailedLookupLocations;
  /**
   * Given a set of options, returns the set of type directive names
   *   that should be included for this program automatically.
   * This list could either come from the config file,
   *   or from enumerating the types root + initial secondary types lookup location.
   * More type directives might appear in the program later as a result of loading actual source files;
   *   this list is only the set of defaults that are implicitly included.
   */
  function getAutomaticTypeDirectiveNames(options: CompilerOptions, host: ModuleResolutionHost): string[];
  /**
   * Cached module resolutions per containing directory.
   * This assumes that any module id will have the same resolution for sibling files located in the same folder.
   */
  interface ModuleResolutionCache extends NonRelativeModuleNameResolutionCache {
    getOrCreateCacheForDirectory(directoryName: string, redirectedReference?: ResolvedProjectReference): Map<ResolvedModuleWithFailedLookupLocations>;
    directoryToModuleNameMap: CacheWithRedirects<Map<ResolvedModuleWithFailedLookupLocations>>;
  }
  /**
   * Stored map from non-relative module name to a table: directory -> result of module lookup in this directory
   * We support only non-relative module names because resolution of relative module names is usually more deterministic and thus less expensive.
   */
  interface NonRelativeModuleNameResolutionCache {
    getOrCreateCacheForModuleName(nonRelativeModuleName: string, redirectedReference?: ResolvedProjectReference): PerModuleNameCache;
    moduleNameToDirectoryMap: CacheWithRedirects<PerModuleNameCache>;
  }
  interface PerModuleNameCache {
    get(directory: string): ResolvedModuleWithFailedLookupLocations | undefined;
    set(directory: string, result: ResolvedModuleWithFailedLookupLocations): void;
  }
  function createModuleResolutionCache(currentDirectory: string, getCanonicalFileName: (s: string) => string, options?: CompilerOptions): ModuleResolutionCache;
  interface CacheWithRedirects<T> {
    ownMap: Map<T>;
    redirectsMap: Map<Map<T>>;
    getOrCreateMapOfCacheRedirects(redirectedReference: ResolvedProjectReference | undefined): Map<T>;
    clear(): void;
    setOwnOptions(newOptions: CompilerOptions): void;
    setOwnMap(newOwnMap: Map<T>): void;
  }
  function createCacheWithRedirects<T>(options?: CompilerOptions): CacheWithRedirects<T>;
  function createModuleResolutionCacheWithMaps(directoryToModuleNameMap: CacheWithRedirects<Map<ResolvedModuleWithFailedLookupLocations>>, moduleNameToDirectoryMap: CacheWithRedirects<PerModuleNameCache>, currentDirectory: string, getCanonicalFileName: GetCanonicalFileName): ModuleResolutionCache;
  function resolveModuleNameFromCache(moduleName: string, containingFile: string, cache: ModuleResolutionCache): ResolvedModuleWithFailedLookupLocations | undefined;
  function resolveModuleName(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache, redirectedReference?: ResolvedProjectReference): ResolvedModuleWithFailedLookupLocations;
  /**
   * Expose resolution logic to allow us to use Node module resolution logic from arbitrary locations.
   * No way to do this with `require()`: https://github.com/nodejs/node/issues/5963
   * Throws an error if the module can't be resolved.
   */
  function resolveJSModule(moduleName: string, initialDir: string, host: ModuleResolutionHost): string;
  function tryResolveJSModule(moduleName: string, initialDir: string, host: ModuleResolutionHost): string | undefined;
  function nodeModuleNameResolver(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache, redirectedReference?: ResolvedProjectReference): ResolvedModuleWithFailedLookupLocations;
  function nodeModuleNameResolver(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache, redirectedReference?: ResolvedProjectReference, lookupConfig?: boolean): ResolvedModuleWithFailedLookupLocations;
  const nodeModulesPathPart = "/node_modules/";
  function pathContainsNodeModules(path: string): boolean;
  function parsePackageName(moduleName: string): {
    packageName: string;
    rest: string;
  };
  function getTypesPackageName(packageName: string): string;
  function mangleScopedPackageName(packageName: string): string;
  function getPackageNameFromTypesPackageName(mangledName: string): string;
  function unmangleScopedPackageName(typesPackageName: string): string;
  function classicNameResolver(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: NonRelativeModuleNameResolutionCache, redirectedReference?: ResolvedProjectReference): ResolvedModuleWithFailedLookupLocations;
  /**
   * A host may load a module from a global cache of typings.
   * This is the minumum code needed to expose that functionality; the rest is in the host.
   */
  function loadModuleFromGlobalCache(moduleName: string, projectName: string | undefined, compilerOptions: CompilerOptions, host: ModuleResolutionHost, globalCache: string): ResolvedModuleWithFailedLookupLocations;
}
declare namespace ts {
  enum ModuleInstanceState {
    NonInstantiated = 0,
    Instantiated = 1,
    ConstEnumOnly = 2
  }
  function getModuleInstanceState(node: ModuleDeclaration): ModuleInstanceState;
  function bindSourceFile(file: SourceFile, options: CompilerOptions): void;
  function isExportsOrModuleExportsOrAlias(sourceFile: SourceFile, node: Expression): boolean;
  /**
   * Computes the transform flags for a node, given the transform flags of its subtree
   *
   * @param node The node to analyze
   * @param subtreeFlags Transform flags computed for this node's subtree
   */
  function computeTransformFlagsForNode(node: Node, subtreeFlags: TransformFlags): TransformFlags;
  /**
   * Gets the transform flags to exclude when unioning the transform flags of a subtree.
   *
   * NOTE: This needs to be kept up-to-date with the exclusions used in `computeTransformFlagsForNode`.
   *       For performance reasons, `computeTransformFlagsForNode` uses local constant values rather
   *       than calling this function.
   */
  function getTransformFlagsSubtreeExclusions(kind: SyntaxKind): TransformFlags;
}
/** @internal */
declare namespace ts {
  function createGetSymbolWalker(getRestTypeOfSignature: (sig: Signature) => Type, getTypePredicateOfSignature: (sig: Signature) => TypePredicate | undefined, getReturnTypeOfSignature: (sig: Signature) => Type, getBaseTypes: (type: Type) => Type[], resolveStructuredTypeMembers: (type: ObjectType) => ResolvedType, getTypeOfSymbol: (sym: Symbol) => Type, getResolvedSymbol: (node: Node) => Symbol, getIndexTypeOfStructuredType: (type: Type, kind: IndexKind) => Type | undefined, getConstraintOfTypeParameter: (typeParameter: TypeParameter) => Type | undefined, getFirstIdentifier: (node: EntityNameOrEntityNameExpression) => Identifier): (accept?: (symbol: Symbol) => boolean) => SymbolWalker;
}
declare namespace ts {
  function getNodeId(node: Node): number;
  function getSymbolId(symbol: Symbol): number;
  function isInstantiatedModule(node: ModuleDeclaration, preserveConstEnums: boolean): boolean;
  function createTypeChecker(host: TypeCheckerHost, produceDiagnostics: boolean): TypeChecker;
}
declare namespace ts {
  function updateNode<T extends Node>(updated: T, original: T): T;
  function createNodeArray<T extends Node>(elements?: T[], hasTrailingComma?: boolean): MutableNodeArray<T>;
  function createNodeArray<T extends Node>(elements?: ReadonlyArray<T>, hasTrailingComma?: boolean): NodeArray<T>;
  /**
   * Creates a shallow, memberwise clone of a node with no source map location.
   */
  function getSynthesizedClone<T extends Node>(node: T): T;
  function createLiteral(value: string | StringLiteral | NoSubstitutionTemplateLiteral | NumericLiteral | Identifier, isSingleQuote: boolean): StringLiteral;
  /** If a node is passed, creates a string literal whose source text is read from a source node during emit. */
  function createLiteral(value: string | StringLiteral | NoSubstitutionTemplateLiteral | NumericLiteral | Identifier): StringLiteral;
  function createLiteral(value: number | PseudoBigInt): NumericLiteral;
  function createLiteral(value: boolean): BooleanLiteral;
  function createLiteral(value: string | number | PseudoBigInt | boolean): PrimaryExpression;
  function createNumericLiteral(value: string, numericLiteralFlags?: TokenFlags): NumericLiteral;
  function createBigIntLiteral(value: string): BigIntLiteral;
  function createStringLiteral(text: string): StringLiteral;
  function createRegularExpressionLiteral(text: string): RegularExpressionLiteral;
  function createIdentifier(text: string): Identifier;
  function createIdentifier(text: string, typeArguments: ReadonlyArray<TypeNode | TypeParameterDeclaration> | undefined): Identifier;
  function updateIdentifier(node: Identifier): Identifier;
  function updateIdentifier(node: Identifier, typeArguments: NodeArray<TypeNode | TypeParameterDeclaration> | undefined): Identifier;
  /** Create a unique temporary variable. */
  function createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined): Identifier;
  function createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined, reservedInNestedScopes: boolean): GeneratedIdentifier;
  /** Create a unique temporary variable for use in a loop. */
  function createLoopVariable(): Identifier;
  /** Create a unique name based on the supplied text. */
  function createUniqueName(text: string): Identifier;
  function createOptimisticUniqueName(text: string): GeneratedIdentifier;
  /** Create a unique name based on the supplied text. */
  function createOptimisticUniqueName(text: string): Identifier;
  /** Create a unique name based on the supplied text. This does not consider names injected by the transformer. */
  function createFileLevelUniqueName(text: string): Identifier;
  /** Create a unique name generated for a node. */
  function getGeneratedNameForNode(node: Node | undefined): Identifier;
  function getGeneratedNameForNode(node: Node | undefined, flags: GeneratedIdentifierFlags): Identifier;
  function createToken<TKind extends SyntaxKind>(token: TKind): Token<TKind>;
  function createSuper(): SuperExpression;
  function createThis(): ThisExpression & Token<SyntaxKind.ThisKeyword>;
  function createNull(): NullLiteral & Token<SyntaxKind.NullKeyword>;
  function createTrue(): BooleanLiteral & Token<SyntaxKind.TrueKeyword>;
  function createFalse(): BooleanLiteral & Token<SyntaxKind.FalseKeyword>;
  function createModifier<T extends Modifier["kind"]>(kind: T): Token<T>;
  function createModifiersFromModifierFlags(flags: ModifierFlags): Modifier[];
  function createQualifiedName(left: EntityName, right: string | Identifier): QualifiedName;
  function updateQualifiedName(node: QualifiedName, left: EntityName, right: Identifier): QualifiedName;
  function createComputedPropertyName(expression: Expression): ComputedPropertyName;
  function updateComputedPropertyName(node: ComputedPropertyName, expression: Expression): ComputedPropertyName;
  function createTypeParameterDeclaration(name: string | Identifier, constraint?: TypeNode, defaultType?: TypeNode): TypeParameterDeclaration;
  function updateTypeParameterDeclaration(node: TypeParameterDeclaration, name: Identifier, constraint: TypeNode | undefined, defaultType: TypeNode | undefined): TypeParameterDeclaration;
  function createParameter(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, dotDotDotToken: DotDotDotToken | undefined, name: string | BindingName, questionToken?: QuestionToken, type?: TypeNode, initializer?: Expression): ParameterDeclaration;
  function updateParameter(node: ParameterDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, dotDotDotToken: DotDotDotToken | undefined, name: string | BindingName, questionToken: QuestionToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): ParameterDeclaration;
  function createDecorator(expression: Expression): Decorator;
  function updateDecorator(node: Decorator, expression: Expression): Decorator;
  function createPropertySignature(modifiers: ReadonlyArray<Modifier> | undefined, name: PropertyName | string, questionToken: QuestionToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): PropertySignature;
  function updatePropertySignature(node: PropertySignature, modifiers: ReadonlyArray<Modifier> | undefined, name: PropertyName, questionToken: QuestionToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): PropertySignature;
  function createProperty(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | PropertyName, questionOrExclamationToken: QuestionToken | ExclamationToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): PropertyDeclaration;
  function updateProperty(node: PropertyDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | PropertyName, questionOrExclamationToken: QuestionToken | ExclamationToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): PropertyDeclaration;
  function createMethodSignature(typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, name: string | PropertyName, questionToken: QuestionToken | undefined): MethodSignature;
  function updateMethodSignature(node: MethodSignature, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined, name: PropertyName, questionToken: QuestionToken | undefined): MethodSignature;
  function createMethod(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, asteriskToken: AsteriskToken | undefined, name: string | PropertyName, questionToken: QuestionToken | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block | undefined): MethodDeclaration;
  function updateMethod(node: MethodDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, asteriskToken: AsteriskToken | undefined, name: PropertyName, questionToken: QuestionToken | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block | undefined): MethodDeclaration;
  function createConstructor(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, body: Block | undefined): ConstructorDeclaration;
  function updateConstructor(node: ConstructorDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, body: Block | undefined): ConstructorDeclaration;
  function createGetAccessor(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | PropertyName, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block | undefined): GetAccessorDeclaration;
  function updateGetAccessor(node: GetAccessorDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: PropertyName, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block | undefined): GetAccessorDeclaration;
  function createSetAccessor(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | PropertyName, parameters: ReadonlyArray<ParameterDeclaration>, body: Block | undefined): SetAccessorDeclaration;
  function updateSetAccessor(node: SetAccessorDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: PropertyName, parameters: ReadonlyArray<ParameterDeclaration>, body: Block | undefined): SetAccessorDeclaration;
  function createCallSignature(typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined): CallSignatureDeclaration;
  function updateCallSignature(node: CallSignatureDeclaration, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): CallSignatureDeclaration;
  function createConstructSignature(typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined): ConstructSignatureDeclaration;
  function updateConstructSignature(node: ConstructSignatureDeclaration, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): ConstructSignatureDeclaration;
  function createIndexSignature(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode): IndexSignatureDeclaration;
  function updateIndexSignature(node: IndexSignatureDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode): IndexSignatureDeclaration;
  function createSignatureDeclaration(kind: SyntaxKind, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, typeArguments?: ReadonlyArray<TypeNode> | undefined): SignatureDeclaration;
  function createKeywordTypeNode(kind: KeywordTypeNode["kind"]): KeywordTypeNode;
  function createTypePredicateNode(parameterName: Identifier | ThisTypeNode | string, type: TypeNode): TypePredicateNode;
  function updateTypePredicateNode(node: TypePredicateNode, parameterName: Identifier | ThisTypeNode, type: TypeNode): TypePredicateNode;
  function createTypeReferenceNode(typeName: string | EntityName, typeArguments: ReadonlyArray<TypeNode> | undefined): TypeReferenceNode;
  function updateTypeReferenceNode(node: TypeReferenceNode, typeName: EntityName, typeArguments: NodeArray<TypeNode> | undefined): TypeReferenceNode;
  function createFunctionTypeNode(typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined): FunctionTypeNode;
  function updateFunctionTypeNode(node: FunctionTypeNode, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): FunctionTypeNode;
  function createConstructorTypeNode(typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined): ConstructorTypeNode;
  function updateConstructorTypeNode(node: ConstructorTypeNode, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): ConstructorTypeNode;
  function createTypeQueryNode(exprName: EntityName): TypeQueryNode;
  function updateTypeQueryNode(node: TypeQueryNode, exprName: EntityName): TypeQueryNode;
  function createTypeLiteralNode(members: ReadonlyArray<TypeElement> | undefined): TypeLiteralNode;
  function updateTypeLiteralNode(node: TypeLiteralNode, members: NodeArray<TypeElement>): TypeLiteralNode;
  function createArrayTypeNode(elementType: TypeNode): ArrayTypeNode;
  function updateArrayTypeNode(node: ArrayTypeNode, elementType: TypeNode): ArrayTypeNode;
  function createTupleTypeNode(elementTypes: ReadonlyArray<TypeNode>): TupleTypeNode;
  function updateTupleTypeNode(node: TupleTypeNode, elementTypes: ReadonlyArray<TypeNode>): TupleTypeNode;
  function createOptionalTypeNode(type: TypeNode): OptionalTypeNode;
  function updateOptionalTypeNode(node: OptionalTypeNode, type: TypeNode): OptionalTypeNode;
  function createRestTypeNode(type: TypeNode): RestTypeNode;
  function updateRestTypeNode(node: RestTypeNode, type: TypeNode): RestTypeNode;
  function createUnionTypeNode(types: ReadonlyArray<TypeNode>): UnionTypeNode;
  function updateUnionTypeNode(node: UnionTypeNode, types: NodeArray<TypeNode>): UnionTypeNode;
  function createIntersectionTypeNode(types: ReadonlyArray<TypeNode>): IntersectionTypeNode;
  function updateIntersectionTypeNode(node: IntersectionTypeNode, types: NodeArray<TypeNode>): IntersectionTypeNode;
  function createUnionOrIntersectionTypeNode(kind: SyntaxKind.UnionType | SyntaxKind.IntersectionType, types: ReadonlyArray<TypeNode>): UnionOrIntersectionTypeNode;
  function createConditionalTypeNode(checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode): ConditionalTypeNode;
  function updateConditionalTypeNode(node: ConditionalTypeNode, checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode): ConditionalTypeNode;
  function createInferTypeNode(typeParameter: TypeParameterDeclaration): InferTypeNode;
  function updateInferTypeNode(node: InferTypeNode, typeParameter: TypeParameterDeclaration): InferTypeNode;
  function createImportTypeNode(argument: TypeNode, qualifier?: EntityName, typeArguments?: ReadonlyArray<TypeNode>, isTypeOf?: boolean): ImportTypeNode;
  function updateImportTypeNode(node: ImportTypeNode, argument: TypeNode, qualifier?: EntityName, typeArguments?: ReadonlyArray<TypeNode>, isTypeOf?: boolean): ImportTypeNode;
  function createParenthesizedType(type: TypeNode): ParenthesizedTypeNode;
  function updateParenthesizedType(node: ParenthesizedTypeNode, type: TypeNode): ParenthesizedTypeNode;
  function createThisTypeNode(): ThisTypeNode;
  function createTypeOperatorNode(type: TypeNode): TypeOperatorNode;
  function createTypeOperatorNode(operator: SyntaxKind.KeyOfKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.ReadonlyKeyword, type: TypeNode): TypeOperatorNode;
  function updateTypeOperatorNode(node: TypeOperatorNode, type: TypeNode): TypeOperatorNode;
  function createIndexedAccessTypeNode(objectType: TypeNode, indexType: TypeNode): IndexedAccessTypeNode;
  function updateIndexedAccessTypeNode(node: IndexedAccessTypeNode, objectType: TypeNode, indexType: TypeNode): IndexedAccessTypeNode;
  function createMappedTypeNode(readonlyToken: ReadonlyToken | PlusToken | MinusToken | undefined, typeParameter: TypeParameterDeclaration, questionToken: QuestionToken | PlusToken | MinusToken | undefined, type: TypeNode | undefined): MappedTypeNode;
  function updateMappedTypeNode(node: MappedTypeNode, readonlyToken: ReadonlyToken | PlusToken | MinusToken | undefined, typeParameter: TypeParameterDeclaration, questionToken: QuestionToken | PlusToken | MinusToken | undefined, type: TypeNode | undefined): MappedTypeNode;
  function createLiteralTypeNode(literal: LiteralTypeNode["literal"]): LiteralTypeNode;
  function updateLiteralTypeNode(node: LiteralTypeNode, literal: LiteralTypeNode["literal"]): LiteralTypeNode;
  function createObjectBindingPattern(elements: ReadonlyArray<BindingElement>): ObjectBindingPattern;
  function updateObjectBindingPattern(node: ObjectBindingPattern, elements: ReadonlyArray<BindingElement>): ObjectBindingPattern;
  function createArrayBindingPattern(elements: ReadonlyArray<ArrayBindingElement>): ArrayBindingPattern;
  function updateArrayBindingPattern(node: ArrayBindingPattern, elements: ReadonlyArray<ArrayBindingElement>): ArrayBindingPattern;
  function createBindingElement(dotDotDotToken: DotDotDotToken | undefined, propertyName: string | PropertyName | undefined, name: string | BindingName, initializer?: Expression): BindingElement;
  function updateBindingElement(node: BindingElement, dotDotDotToken: DotDotDotToken | undefined, propertyName: PropertyName | undefined, name: BindingName, initializer: Expression | undefined): BindingElement;
  function createArrayLiteral(elements?: ReadonlyArray<Expression>, multiLine?: boolean): ArrayLiteralExpression;
  function updateArrayLiteral(node: ArrayLiteralExpression, elements: ReadonlyArray<Expression>): ArrayLiteralExpression;
  function createObjectLiteral(properties?: ReadonlyArray<ObjectLiteralElementLike>, multiLine?: boolean): ObjectLiteralExpression;
  function updateObjectLiteral(node: ObjectLiteralExpression, properties: ReadonlyArray<ObjectLiteralElementLike>): ObjectLiteralExpression;
  function createPropertyAccess(expression: Expression, name: string | Identifier): PropertyAccessExpression;
  function updatePropertyAccess(node: PropertyAccessExpression, expression: Expression, name: Identifier): PropertyAccessExpression;
  function createElementAccess(expression: Expression, index: number | Expression): ElementAccessExpression;
  function updateElementAccess(node: ElementAccessExpression, expression: Expression, argumentExpression: Expression): ElementAccessExpression;
  function createCall(expression: Expression, typeArguments: ReadonlyArray<TypeNode> | undefined, argumentsArray: ReadonlyArray<Expression> | undefined): CallExpression;
  function updateCall(node: CallExpression, expression: Expression, typeArguments: ReadonlyArray<TypeNode> | undefined, argumentsArray: ReadonlyArray<Expression>): CallExpression;
  function createNew(expression: Expression, typeArguments: ReadonlyArray<TypeNode> | undefined, argumentsArray: ReadonlyArray<Expression> | undefined): NewExpression;
  function updateNew(node: NewExpression, expression: Expression, typeArguments: ReadonlyArray<TypeNode> | undefined, argumentsArray: ReadonlyArray<Expression> | undefined): NewExpression;
  /** @deprecated */ function createTaggedTemplate(tag: Expression, template: TemplateLiteral): TaggedTemplateExpression;
  function createTaggedTemplate(tag: Expression, typeArguments: ReadonlyArray<TypeNode> | undefined, template: TemplateLiteral): TaggedTemplateExpression;
  /** @internal */
  function createTaggedTemplate(tag: Expression, typeArgumentsOrTemplate: ReadonlyArray<TypeNode> | TemplateLiteral | undefined, template?: TemplateLiteral): TaggedTemplateExpression;
  /** @deprecated */ function updateTaggedTemplate(node: TaggedTemplateExpression, tag: Expression, template: TemplateLiteral): TaggedTemplateExpression;
  function updateTaggedTemplate(node: TaggedTemplateExpression, tag: Expression, typeArguments: ReadonlyArray<TypeNode> | undefined, template: TemplateLiteral): TaggedTemplateExpression;
  function createTypeAssertion(type: TypeNode, expression: Expression): TypeAssertion;
  function updateTypeAssertion(node: TypeAssertion, type: TypeNode, expression: Expression): TypeAssertion;
  function createParen(expression: Expression): ParenthesizedExpression;
  function updateParen(node: ParenthesizedExpression, expression: Expression): ParenthesizedExpression;
  function createFunctionExpression(modifiers: ReadonlyArray<Modifier> | undefined, asteriskToken: AsteriskToken | undefined, name: string | Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration> | undefined, type: TypeNode | undefined, body: Block): FunctionExpression;
  function updateFunctionExpression(node: FunctionExpression, modifiers: ReadonlyArray<Modifier> | undefined, asteriskToken: AsteriskToken | undefined, name: Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block): FunctionExpression;
  function createArrowFunction(modifiers: ReadonlyArray<Modifier> | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, equalsGreaterThanToken: EqualsGreaterThanToken | undefined, body: ConciseBody): ArrowFunction;
  function updateArrowFunction(node: ArrowFunction, modifiers: ReadonlyArray<Modifier> | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, equalsGreaterThanToken: Token<SyntaxKind.EqualsGreaterThanToken>, body: ConciseBody): ArrowFunction;
  function createDelete(expression: Expression): DeleteExpression;
  function updateDelete(node: DeleteExpression, expression: Expression): DeleteExpression;
  function createTypeOf(expression: Expression): TypeOfExpression;
  function updateTypeOf(node: TypeOfExpression, expression: Expression): TypeOfExpression;
  function createVoid(expression: Expression): VoidExpression;
  function updateVoid(node: VoidExpression, expression: Expression): VoidExpression;
  function createAwait(expression: Expression): AwaitExpression;
  function updateAwait(node: AwaitExpression, expression: Expression): AwaitExpression;
  function createPrefix(operator: PrefixUnaryOperator, operand: Expression): PrefixUnaryExpression;
  function updatePrefix(node: PrefixUnaryExpression, operand: Expression): PrefixUnaryExpression;
  function createPostfix(operand: Expression, operator: PostfixUnaryOperator): PostfixUnaryExpression;
  function updatePostfix(node: PostfixUnaryExpression, operand: Expression): PostfixUnaryExpression;
  function createBinary(left: Expression, operator: BinaryOperator | BinaryOperatorToken, right: Expression): BinaryExpression;
  function updateBinary(node: BinaryExpression, left: Expression, right: Expression, operator?: BinaryOperator | BinaryOperatorToken): BinaryExpression;
  /** @deprecated */ function createConditional(condition: Expression, whenTrue: Expression, whenFalse: Expression): ConditionalExpression;
  function createConditional(condition: Expression, questionToken: QuestionToken, whenTrue: Expression, colonToken: ColonToken, whenFalse: Expression): ConditionalExpression;
  function updateConditional(node: ConditionalExpression, condition: Expression, questionToken: Token<SyntaxKind.QuestionToken>, whenTrue: Expression, colonToken: Token<SyntaxKind.ColonToken>, whenFalse: Expression): ConditionalExpression;
  function createTemplateExpression(head: TemplateHead, templateSpans: ReadonlyArray<TemplateSpan>): TemplateExpression;
  function updateTemplateExpression(node: TemplateExpression, head: TemplateHead, templateSpans: ReadonlyArray<TemplateSpan>): TemplateExpression;
  function createTemplateHead(text: string, rawText?: string): TemplateHead;
  function createTemplateMiddle(text: string, rawText?: string): TemplateMiddle;
  function createTemplateTail(text: string, rawText?: string): TemplateTail;
  function createNoSubstitutionTemplateLiteral(text: string, rawText?: string): NoSubstitutionTemplateLiteral;
  function createYield(expression?: Expression): YieldExpression;
  function createYield(asteriskToken: AsteriskToken | undefined, expression: Expression): YieldExpression;
  function updateYield(node: YieldExpression, asteriskToken: AsteriskToken | undefined, expression: Expression): YieldExpression;
  function createSpread(expression: Expression): SpreadElement;
  function updateSpread(node: SpreadElement, expression: Expression): SpreadElement;
  function createClassExpression(modifiers: ReadonlyArray<Modifier> | undefined, name: string | Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, heritageClauses: ReadonlyArray<HeritageClause> | undefined, members: ReadonlyArray<ClassElement>): ClassExpression;
  function updateClassExpression(node: ClassExpression, modifiers: ReadonlyArray<Modifier> | undefined, name: Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, heritageClauses: ReadonlyArray<HeritageClause> | undefined, members: ReadonlyArray<ClassElement>): ClassExpression;
  function createOmittedExpression(): OmittedExpression;
  function createExpressionWithTypeArguments(typeArguments: ReadonlyArray<TypeNode> | undefined, expression: Expression): ExpressionWithTypeArguments;
  function updateExpressionWithTypeArguments(node: ExpressionWithTypeArguments, typeArguments: ReadonlyArray<TypeNode> | undefined, expression: Expression): ExpressionWithTypeArguments;
  function createAsExpression(expression: Expression, type: TypeNode): AsExpression;
  function updateAsExpression(node: AsExpression, expression: Expression, type: TypeNode): AsExpression;
  function createNonNullExpression(expression: Expression): NonNullExpression;
  function updateNonNullExpression(node: NonNullExpression, expression: Expression): NonNullExpression;
  function createMetaProperty(keywordToken: MetaProperty["keywordToken"], name: Identifier): MetaProperty;
  function updateMetaProperty(node: MetaProperty, name: Identifier): MetaProperty;
  function createTemplateSpan(expression: Expression, literal: TemplateMiddle | TemplateTail): TemplateSpan;
  function updateTemplateSpan(node: TemplateSpan, expression: Expression, literal: TemplateMiddle | TemplateTail): TemplateSpan;
  function createSemicolonClassElement(): SemicolonClassElement;
  function createBlock(statements: ReadonlyArray<Statement>, multiLine?: boolean): Block;
  function updateBlock(node: Block, statements: ReadonlyArray<Statement>): Block;
  function createVariableStatement(modifiers: ReadonlyArray<Modifier> | undefined, declarationList: VariableDeclarationList | ReadonlyArray<VariableDeclaration>): VariableStatement;
  function updateVariableStatement(node: VariableStatement, modifiers: ReadonlyArray<Modifier> | undefined, declarationList: VariableDeclarationList): VariableStatement;
  function createEmptyStatement(): EmptyStatement;
  function createExpressionStatement(expression: Expression): ExpressionStatement;
  function updateExpressionStatement(node: ExpressionStatement, expression: Expression): ExpressionStatement;
  /** @deprecated Use `createExpressionStatement` instead.  */
  const createStatement: typeof createExpressionStatement;
  /** @deprecated Use `updateExpressionStatement` instead.  */
  const updateStatement: typeof updateExpressionStatement;
  function createIf(expression: Expression, thenStatement: Statement, elseStatement?: Statement): IfStatement;
  function updateIf(node: IfStatement, expression: Expression, thenStatement: Statement, elseStatement: Statement | undefined): IfStatement;
  function createDo(statement: Statement, expression: Expression): DoStatement;
  function updateDo(node: DoStatement, statement: Statement, expression: Expression): DoStatement;
  function createWhile(expression: Expression, statement: Statement): WhileStatement;
  function updateWhile(node: WhileStatement, expression: Expression, statement: Statement): WhileStatement;
  function createFor(initializer: ForInitializer | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Statement): ForStatement;
  function updateFor(node: ForStatement, initializer: ForInitializer | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Statement): ForStatement;
  function createForIn(initializer: ForInitializer, expression: Expression, statement: Statement): ForInStatement;
  function updateForIn(node: ForInStatement, initializer: ForInitializer, expression: Expression, statement: Statement): ForInStatement;
  function createForOf(awaitModifier: AwaitKeywordToken | undefined, initializer: ForInitializer, expression: Expression, statement: Statement): ForOfStatement;
  function updateForOf(node: ForOfStatement, awaitModifier: AwaitKeywordToken | undefined, initializer: ForInitializer, expression: Expression, statement: Statement): ForOfStatement;
  function createContinue(label?: string | Identifier): ContinueStatement;
  function updateContinue(node: ContinueStatement, label: Identifier | undefined): ContinueStatement;
  function createBreak(label?: string | Identifier): BreakStatement;
  function updateBreak(node: BreakStatement, label: Identifier | undefined): BreakStatement;
  function createReturn(expression?: Expression): ReturnStatement;
  function updateReturn(node: ReturnStatement, expression: Expression | undefined): ReturnStatement;
  function createWith(expression: Expression, statement: Statement): WithStatement;
  function updateWith(node: WithStatement, expression: Expression, statement: Statement): WithStatement;
  function createSwitch(expression: Expression, caseBlock: CaseBlock): SwitchStatement;
  function updateSwitch(node: SwitchStatement, expression: Expression, caseBlock: CaseBlock): SwitchStatement;
  function createLabel(label: string | Identifier, statement: Statement): LabeledStatement;
  function updateLabel(node: LabeledStatement, label: Identifier, statement: Statement): LabeledStatement;
  function createThrow(expression: Expression): ThrowStatement;
  function updateThrow(node: ThrowStatement, expression: Expression): ThrowStatement;
  function createTry(tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined): TryStatement;
  function updateTry(node: TryStatement, tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined): TryStatement;
  function createDebuggerStatement(): DebuggerStatement;
  function createVariableDeclaration(name: string | BindingName, type?: TypeNode, initializer?: Expression): VariableDeclaration;
  function updateVariableDeclaration(node: VariableDeclaration, name: BindingName, type: TypeNode | undefined, initializer: Expression | undefined): VariableDeclaration;
  function createVariableDeclarationList(declarations: ReadonlyArray<VariableDeclaration>, flags?: NodeFlags): VariableDeclarationList;
  function updateVariableDeclarationList(node: VariableDeclarationList, declarations: ReadonlyArray<VariableDeclaration>): VariableDeclarationList;
  function createFunctionDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, asteriskToken: AsteriskToken | undefined, name: string | Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block | undefined): FunctionDeclaration;
  function updateFunctionDeclaration(node: FunctionDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, asteriskToken: AsteriskToken | undefined, name: Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, parameters: ReadonlyArray<ParameterDeclaration>, type: TypeNode | undefined, body: Block | undefined): FunctionDeclaration;
  function createClassDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, heritageClauses: ReadonlyArray<HeritageClause> | undefined, members: ReadonlyArray<ClassElement>): ClassDeclaration;
  function updateClassDeclaration(node: ClassDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: Identifier | undefined, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, heritageClauses: ReadonlyArray<HeritageClause> | undefined, members: ReadonlyArray<ClassElement>): ClassDeclaration;
  function createInterfaceDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | Identifier, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, heritageClauses: ReadonlyArray<HeritageClause> | undefined, members: ReadonlyArray<TypeElement>): InterfaceDeclaration;
  function updateInterfaceDeclaration(node: InterfaceDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: Identifier, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, heritageClauses: ReadonlyArray<HeritageClause> | undefined, members: ReadonlyArray<TypeElement>): InterfaceDeclaration;
  function createTypeAliasDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | Identifier, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, type: TypeNode): TypeAliasDeclaration;
  function updateTypeAliasDeclaration(node: TypeAliasDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: Identifier, typeParameters: ReadonlyArray<TypeParameterDeclaration> | undefined, type: TypeNode): TypeAliasDeclaration;
  function createEnumDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | Identifier, members: ReadonlyArray<EnumMember>): EnumDeclaration;
  function updateEnumDeclaration(node: EnumDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: Identifier, members: ReadonlyArray<EnumMember>): EnumDeclaration;
  function createModuleDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: ModuleName, body: ModuleBody | undefined, flags?: NodeFlags): ModuleDeclaration;
  function updateModuleDeclaration(node: ModuleDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: ModuleName, body: ModuleBody | undefined): ModuleDeclaration;
  function createModuleBlock(statements: ReadonlyArray<Statement>): ModuleBlock;
  function updateModuleBlock(node: ModuleBlock, statements: ReadonlyArray<Statement>): ModuleBlock;
  function createCaseBlock(clauses: ReadonlyArray<CaseOrDefaultClause>): CaseBlock;
  function updateCaseBlock(node: CaseBlock, clauses: ReadonlyArray<CaseOrDefaultClause>): CaseBlock;
  function createNamespaceExportDeclaration(name: string | Identifier): NamespaceExportDeclaration;
  function updateNamespaceExportDeclaration(node: NamespaceExportDeclaration, name: Identifier): NamespaceExportDeclaration;
  function createImportEqualsDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: string | Identifier, moduleReference: ModuleReference): ImportEqualsDeclaration;
  function updateImportEqualsDeclaration(node: ImportEqualsDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, name: Identifier, moduleReference: ModuleReference): ImportEqualsDeclaration;
  function createImportDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, importClause: ImportClause | undefined, moduleSpecifier: Expression): ImportDeclaration;
  function updateImportDeclaration(node: ImportDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, importClause: ImportClause | undefined, moduleSpecifier: Expression): ImportDeclaration;
  function createImportClause(name: Identifier | undefined, namedBindings: NamedImportBindings | undefined): ImportClause;
  function updateImportClause(node: ImportClause, name: Identifier | undefined, namedBindings: NamedImportBindings | undefined): ImportClause;
  function createNamespaceImport(name: Identifier): NamespaceImport;
  function updateNamespaceImport(node: NamespaceImport, name: Identifier): NamespaceImport;
  function createNamedImports(elements: ReadonlyArray<ImportSpecifier>): NamedImports;
  function updateNamedImports(node: NamedImports, elements: ReadonlyArray<ImportSpecifier>): NamedImports;
  function createImportSpecifier(propertyName: Identifier | undefined, name: Identifier): ImportSpecifier;
  function updateImportSpecifier(node: ImportSpecifier, propertyName: Identifier | undefined, name: Identifier): ImportSpecifier;
  function createExportAssignment(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, isExportEquals: boolean | undefined, expression: Expression): ExportAssignment;
  function updateExportAssignment(node: ExportAssignment, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, expression: Expression): ExportAssignment;
  function createExportDeclaration(decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, exportClause: NamedExports | undefined, moduleSpecifier?: Expression): ExportDeclaration;
  function updateExportDeclaration(node: ExportDeclaration, decorators: ReadonlyArray<Decorator> | undefined, modifiers: ReadonlyArray<Modifier> | undefined, exportClause: NamedExports | undefined, moduleSpecifier: Expression | undefined): ExportDeclaration;
  function createNamedExports(elements: ReadonlyArray<ExportSpecifier>): NamedExports;
  function updateNamedExports(node: NamedExports, elements: ReadonlyArray<ExportSpecifier>): NamedExports;
  function createExportSpecifier(propertyName: string | Identifier | undefined, name: string | Identifier): ExportSpecifier;
  function updateExportSpecifier(node: ExportSpecifier, propertyName: Identifier | undefined, name: Identifier): ExportSpecifier;
  function createExternalModuleReference(expression: Expression): ExternalModuleReference;
  function updateExternalModuleReference(node: ExternalModuleReference, expression: Expression): ExternalModuleReference;
  function createJSDocTypeExpression(type: TypeNode): JSDocTypeExpression;
  function createJSDocTypeTag(typeExpression: JSDocTypeExpression, comment?: string): JSDocTypeTag;
  function createJSDocReturnTag(typeExpression?: JSDocTypeExpression, comment?: string): JSDocReturnTag;
  /** @internal */
  function createJSDocThisTag(typeExpression?: JSDocTypeExpression): JSDocThisTag;
  function createJSDocParamTag(name: EntityName, isBracketed: boolean, typeExpression?: JSDocTypeExpression, comment?: string): JSDocParameterTag;
  function createJSDocComment(comment?: string | undefined, tags?: NodeArray<JSDocTag> | undefined): JSDoc;
  function createJsxElement(openingElement: JsxOpeningElement, children: ReadonlyArray<JsxChild>, closingElement: JsxClosingElement): JsxElement;
  function updateJsxElement(node: JsxElement, openingElement: JsxOpeningElement, children: ReadonlyArray<JsxChild>, closingElement: JsxClosingElement): JsxElement;
  function createJsxSelfClosingElement(tagName: JsxTagNameExpression, typeArguments: ReadonlyArray<TypeNode> | undefined, attributes: JsxAttributes): JsxSelfClosingElement;
  function updateJsxSelfClosingElement(node: JsxSelfClosingElement, tagName: JsxTagNameExpression, typeArguments: ReadonlyArray<TypeNode> | undefined, attributes: JsxAttributes): JsxSelfClosingElement;
  function createJsxOpeningElement(tagName: JsxTagNameExpression, typeArguments: ReadonlyArray<TypeNode> | undefined, attributes: JsxAttributes): JsxOpeningElement;
  function updateJsxOpeningElement(node: JsxOpeningElement, tagName: JsxTagNameExpression, typeArguments: ReadonlyArray<TypeNode> | undefined, attributes: JsxAttributes): JsxOpeningElement;
  function createJsxClosingElement(tagName: JsxTagNameExpression): JsxClosingElement;
  function updateJsxClosingElement(node: JsxClosingElement, tagName: JsxTagNameExpression): JsxClosingElement;
  function createJsxFragment(openingFragment: JsxOpeningFragment, children: ReadonlyArray<JsxChild>, closingFragment: JsxClosingFragment): JsxFragment;
  function createJsxText(text: string, containsOnlyTriviaWhiteSpaces?: boolean): JsxText;
  function updateJsxText(node: JsxText, text: string, containsOnlyTriviaWhiteSpaces?: boolean): JsxText;
  function createJsxOpeningFragment(): JsxOpeningFragment;
  function createJsxJsxClosingFragment(): JsxClosingFragment;
  function updateJsxFragment(node: JsxFragment, openingFragment: JsxOpeningFragment, children: ReadonlyArray<JsxChild>, closingFragment: JsxClosingFragment): JsxFragment;
  function createJsxAttribute(name: Identifier, initializer: StringLiteral | JsxExpression): JsxAttribute;
  function updateJsxAttribute(node: JsxAttribute, name: Identifier, initializer: StringLiteral | JsxExpression): JsxAttribute;
  function createJsxAttributes(properties: ReadonlyArray<JsxAttributeLike>): JsxAttributes;
  function updateJsxAttributes(node: JsxAttributes, properties: ReadonlyArray<JsxAttributeLike>): JsxAttributes;
  function createJsxSpreadAttribute(expression: Expression): JsxSpreadAttribute;
  function updateJsxSpreadAttribute(node: JsxSpreadAttribute, expression: Expression): JsxSpreadAttribute;
  function createJsxExpression(dotDotDotToken: DotDotDotToken | undefined, expression: Expression | undefined): JsxExpression;
  function updateJsxExpression(node: JsxExpression, expression: Expression | undefined): JsxExpression;
  function createCaseClause(expression: Expression, statements: ReadonlyArray<Statement>): CaseClause;
  function updateCaseClause(node: CaseClause, expression: Expression, statements: ReadonlyArray<Statement>): CaseClause;
  function createDefaultClause(statements: ReadonlyArray<Statement>): DefaultClause;
  function updateDefaultClause(node: DefaultClause, statements: ReadonlyArray<Statement>): DefaultClause;
  function createHeritageClause(token: HeritageClause["token"], types: ReadonlyArray<ExpressionWithTypeArguments>): HeritageClause;
  function updateHeritageClause(node: HeritageClause, types: ReadonlyArray<ExpressionWithTypeArguments>): HeritageClause;
  function createCatchClause(variableDeclaration: string | VariableDeclaration | undefined, block: Block): CatchClause;
  function updateCatchClause(node: CatchClause, variableDeclaration: VariableDeclaration | undefined, block: Block): CatchClause;
  function createPropertyAssignment(name: string | PropertyName, initializer: Expression): PropertyAssignment;
  function updatePropertyAssignment(node: PropertyAssignment, name: PropertyName, initializer: Expression): PropertyAssignment;
  function createShorthandPropertyAssignment(name: string | Identifier, objectAssignmentInitializer?: Expression): ShorthandPropertyAssignment;
  function updateShorthandPropertyAssignment(node: ShorthandPropertyAssignment, name: Identifier, objectAssignmentInitializer: Expression | undefined): ShorthandPropertyAssignment;
  function createSpreadAssignment(expression: Expression): SpreadAssignment;
  function updateSpreadAssignment(node: SpreadAssignment, expression: Expression): SpreadAssignment;
  function createEnumMember(name: string | PropertyName, initializer?: Expression): EnumMember;
  function updateEnumMember(node: EnumMember, name: PropertyName, initializer: Expression | undefined): EnumMember;
  function updateSourceFileNode(node: SourceFile, statements: ReadonlyArray<Statement>, isDeclarationFile?: boolean, referencedFiles?: SourceFile["referencedFiles"], typeReferences?: SourceFile["typeReferenceDirectives"], hasNoDefaultLib?: boolean, libReferences?: SourceFile["libReferenceDirectives"]): SourceFile;
  /**
   * Creates a shallow, memberwise clone of a node for mutation.
   */
  function getMutableClone<T extends Node>(node: T): T;
  /**
   * Creates a synthetic statement to act as a placeholder for a not-emitted statement in
   * order to preserve comments.
   *
   * @param original The original statement.
   */
  function createNotEmittedStatement(original: Node): NotEmittedStatement;
  /**
   * Creates a synthetic element to act as a placeholder for the end of an emitted declaration in
   * order to properly emit exports.
   */
  function createEndOfDeclarationMarker(original: Node): EndOfDeclarationMarker;
  /**
   * Creates a synthetic element to act as a placeholder for the beginning of a merged declaration in
   * order to properly emit exports.
   */
  function createMergeDeclarationMarker(original: Node): MergeDeclarationMarker;
  /**
   * Creates a synthetic expression to act as a placeholder for a not-emitted expression in
   * order to preserve comments or sourcemap positions.
   *
   * @param expression The inner expression to emit.
   * @param original The original outer expression.
   * @param location The location for the expression. Defaults to the positions from "original" if provided.
   */
  function createPartiallyEmittedExpression(expression: Expression, original?: Node): PartiallyEmittedExpression;
  function updatePartiallyEmittedExpression(node: PartiallyEmittedExpression, expression: Expression): PartiallyEmittedExpression;
  function createCommaList(elements: ReadonlyArray<Expression>): CommaListExpression;
  function updateCommaList(node: CommaListExpression, elements: ReadonlyArray<Expression>): CommaListExpression;
  function createBundle(sourceFiles: ReadonlyArray<SourceFile>, prepends?: ReadonlyArray<UnparsedSource | InputFiles>): Bundle;
  function createUnparsedSourceFile(text: string): UnparsedSource;
  function createUnparsedSourceFile(inputFile: InputFiles, type: "js" | "dts", stripInternal?: boolean): UnparsedSource;
  function createUnparsedSourceFile(text: string, mapPath: string | undefined, map: string | undefined): UnparsedSource;
  function createInputFiles(javascriptText: string, declarationText: string): InputFiles;
  function createInputFiles(readFileText: (path: string) => string | undefined, javascriptPath: string, javascriptMapPath: string | undefined, declarationPath: string, declarationMapPath: string | undefined, buildInfoPath: string | undefined): InputFiles;
  function createInputFiles(javascriptText: string, declarationText: string, javascriptMapPath: string | undefined, javascriptMapText: string | undefined, declarationMapPath: string | undefined, declarationMapText: string | undefined): InputFiles;
  function createInputFiles(javascriptText: string, declarationText: string, javascriptMapPath: string | undefined, javascriptMapText: string | undefined, declarationMapPath: string | undefined, declarationMapText: string | undefined, javascriptPath: string | undefined, declarationPath: string | undefined, buildInfoPath?: string | undefined, buildInfo?: BuildInfo, oldFileOfCurrentEmit?: boolean): InputFiles;
  function updateBundle(node: Bundle, sourceFiles: ReadonlyArray<SourceFile>, prepends?: ReadonlyArray<UnparsedSource | InputFiles>): Bundle;
  function createImmediatelyInvokedFunctionExpression(statements: ReadonlyArray<Statement>): CallExpression;
  function createImmediatelyInvokedFunctionExpression(statements: ReadonlyArray<Statement>, param: ParameterDeclaration, paramValue: Expression): CallExpression;
  function createImmediatelyInvokedArrowFunction(statements: ReadonlyArray<Statement>): CallExpression;
  function createImmediatelyInvokedArrowFunction(statements: ReadonlyArray<Statement>, param: ParameterDeclaration, paramValue: Expression): CallExpression;
  function createComma(left: Expression, right: Expression): Expression;
  function createLessThan(left: Expression, right: Expression): Expression;
  function createAssignment(left: ObjectLiteralExpression | ArrayLiteralExpression, right: Expression): DestructuringAssignment;
  function createAssignment(left: Expression, right: Expression): BinaryExpression;
  function createStrictEquality(left: Expression, right: Expression): BinaryExpression;
  function createStrictInequality(left: Expression, right: Expression): BinaryExpression;
  function createAdd(left: Expression, right: Expression): BinaryExpression;
  function createSubtract(left: Expression, right: Expression): BinaryExpression;
  function createPostfixIncrement(operand: Expression): PostfixUnaryExpression;
  function createLogicalAnd(left: Expression, right: Expression): BinaryExpression;
  function createLogicalOr(left: Expression, right: Expression): BinaryExpression;
  function createLogicalNot(operand: Expression): PrefixUnaryExpression;
  function createVoidZero(): VoidExpression;
  function createExportDefault(expression: Expression): ExportAssignment;
  function createExternalModuleExport(exportName: Identifier): ExportDeclaration;
  /**
   * Clears any EmitNode entries from parse-tree nodes.
   * @param sourceFile A source file.
   */
  function disposeEmitNodes(sourceFile: SourceFile): void;
  /**
   * Associates a node with the current transformation, initializing
   * various transient transformation properties.
   */
  function getOrCreateEmitNode(node: Node): EmitNode;
  /**
   * Sets `EmitFlags.NoComments` on a node and removes any leading and trailing synthetic comments.
   * @internal
   */
  function removeAllComments<T extends Node>(node: T): T;
  function setTextRange<T extends TextRange>(range: T, location: TextRange | undefined): T;
  /**
   * Sets flags that control emit behavior of a node.
   */
  function setEmitFlags<T extends Node>(node: T, emitFlags: EmitFlags): T;
  /**
   * Sets flags that control emit behavior of a node.
   */
  function addEmitFlags<T extends Node>(node: T, emitFlags: EmitFlags): T;
  /**
   * Gets a custom text range to use when emitting source maps.
   */
  function getSourceMapRange(node: Node): SourceMapRange;
  /**
   * Sets a custom text range to use when emitting source maps.
   */
  function setSourceMapRange<T extends Node>(node: T, range: SourceMapRange | undefined): T;
  /**
   * Create an external source map source file reference
   */
  function createSourceMapSource(fileName: string, text: string, skipTrivia?: (pos: number) => number): SourceMapSource;
  /**
   * Gets the TextRange to use for source maps for a token of a node.
   */
  function getTokenSourceMapRange(node: Node, token: SyntaxKind): SourceMapRange | undefined;
  /**
   * Sets the TextRange to use for source maps for a token of a node.
   */
  function setTokenSourceMapRange<T extends Node>(node: T, token: SyntaxKind, range: SourceMapRange | undefined): T;
  /**
   * Gets a custom text range to use when emitting comments.
   */
  function getStartsOnNewLine(node: Node): boolean | undefined;
  /**
   * Sets a custom text range to use when emitting comments.
   */
  function setStartsOnNewLine<T extends Node>(node: T, newLine: boolean): T;
  /**
   * Gets a custom text range to use when emitting comments.
   */
  function getCommentRange(node: Node): TextRange;
  /**
   * Sets a custom text range to use when emitting comments.
   */
  function setCommentRange<T extends Node>(node: T, range: TextRange): T;
  function getSyntheticLeadingComments(node: Node): SynthesizedComment[] | undefined;
  function setSyntheticLeadingComments<T extends Node>(node: T, comments: SynthesizedComment[] | undefined): T;
  function addSyntheticLeadingComment<T extends Node>(node: T, kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia, text: string, hasTrailingNewLine?: boolean): T;
  function getSyntheticTrailingComments(node: Node): SynthesizedComment[] | undefined;
  function setSyntheticTrailingComments<T extends Node>(node: T, comments: SynthesizedComment[] | undefined): T;
  function addSyntheticTrailingComment<T extends Node>(node: T, kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia, text: string, hasTrailingNewLine?: boolean): T;
  function moveSyntheticComments<T extends Node>(node: T, original: Node): T;
  /**
   * Gets the constant value to emit for an expression.
   */
  function getConstantValue(node: PropertyAccessExpression | ElementAccessExpression): string | number | undefined;
  /**
   * Sets the constant value to emit for an expression.
   */
  function setConstantValue(node: PropertyAccessExpression | ElementAccessExpression, value: string | number): PropertyAccessExpression | ElementAccessExpression;
  /**
   * Adds an EmitHelper to a node.
   */
  function addEmitHelper<T extends Node>(node: T, helper: EmitHelper): T;
  /**
   * Add EmitHelpers to a node.
   */
  function addEmitHelpers<T extends Node>(node: T, helpers: EmitHelper[] | undefined): T;
  /**
   * Removes an EmitHelper from a node.
   */
  function removeEmitHelper(node: Node, helper: EmitHelper): boolean;
  /**
   * Gets the EmitHelpers of a node.
   */
  function getEmitHelpers(node: Node): EmitHelper[] | undefined;
  /**
   * Moves matching emit helpers from a source node to a target node.
   */
  function moveEmitHelpers(source: Node, target: Node, predicate: (helper: EmitHelper) => boolean): void;
  function compareEmitHelpers(x: EmitHelper, y: EmitHelper): Comparison.LessThan | Comparison.LessThan | Comparison | Comparison.GreaterThan;
  function setOriginalNode<T extends Node>(node: T, original: Node | undefined): T;
}
declare namespace ts {
  const nullTransformationContext: TransformationContext;
  type TypeOfTag = "undefined" | "number" | "boolean" | "string" | "symbol" | "object" | "function";
  function createTypeCheck(value: Expression, tag: TypeOfTag): BinaryExpression;
  function createMemberAccessForPropertyName(target: Expression, memberName: PropertyName, location?: TextRange): MemberExpression;
  function createFunctionCall(func: Expression, thisArg: Expression, argumentsList: ReadonlyArray<Expression>, location?: TextRange): CallExpression;
  function createFunctionApply(func: Expression, thisArg: Expression, argumentsExpression: Expression, location?: TextRange): CallExpression;
  function createArraySlice(array: Expression, start?: number | Expression): CallExpression;
  function createArrayConcat(array: Expression, values: ReadonlyArray<Expression>): CallExpression;
  function createMathPow(left: Expression, right: Expression, location?: TextRange): CallExpression;
  function createExpressionForJsxElement(jsxFactoryEntity: EntityName | undefined, reactNamespace: string, tagName: Expression, props: Expression, children: ReadonlyArray<Expression>, parentElement: JsxOpeningLikeElement, location: TextRange): LeftHandSideExpression;
  function createExpressionForJsxFragment(jsxFactoryEntity: EntityName | undefined, reactNamespace: string, children: ReadonlyArray<Expression>, parentElement: JsxOpeningFragment, location: TextRange): LeftHandSideExpression;
  /**
   * Gets an identifier for the name of an *unscoped* emit helper.
   */
  function getUnscopedHelperName(name: string): Identifier;
  const valuesHelper: UnscopedEmitHelper;
  function createValuesHelper(context: TransformationContext, expression: Expression, location?: TextRange): CallExpression;
  const readHelper: UnscopedEmitHelper;
  function createReadHelper(context: TransformationContext, iteratorRecord: Expression, count: number | undefined, location?: TextRange): CallExpression;
  const spreadHelper: UnscopedEmitHelper;
  function createSpreadHelper(context: TransformationContext, argumentList: ReadonlyArray<Expression>, location?: TextRange): CallExpression;
  const spreadArraysHelper: UnscopedEmitHelper;
  function createSpreadArraysHelper(context: TransformationContext, argumentList: ReadonlyArray<Expression>, location?: TextRange): CallExpression;
  function createForOfBindingStatement(node: ForInitializer, boundValue: Expression): Statement;
  function insertLeadingStatement(dest: Statement, source: Statement): Block;
  function restoreEnclosingLabel(node: Statement, outermostLabeledStatement: LabeledStatement | undefined, afterRestoreLabelCallback?: (node: LabeledStatement) => void): Statement;
  interface CallBinding {
    target: LeftHandSideExpression;
    thisArg: Expression;
  }
  function createCallBinding(expression: Expression, recordTempVariable: (temp: Identifier) => void, languageVersion?: ScriptTarget, cacheIdentifiers?: boolean): CallBinding;
  function inlineExpressions(expressions: ReadonlyArray<Expression>): Expression;
  function createExpressionFromEntityName(node: EntityName | Expression): Expression;
  function createExpressionForPropertyName(memberName: PropertyName): Expression;
  function createExpressionForObjectLiteralElementLike(node: ObjectLiteralExpression, property: ObjectLiteralElementLike, receiver: Expression): Expression | undefined;
  /**
   * Gets the internal name of a declaration. This is primarily used for declarations that can be
   * referred to by name in the body of an ES5 class function body. An internal name will *never*
   * be prefixed with an module or namespace export modifier like "exports." when emitted as an
   * expression. An internal name will also *never* be renamed due to a collision with a block
   * scoped variable.
   *
   * @param node The declaration.
   * @param allowComments A value indicating whether comments may be emitted for the name.
   * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
   */
  function getInternalName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
  /**
   * Gets whether an identifier should only be referred to by its internal name.
   */
  function isInternalName(node: Identifier): boolean;
  /**
   * Gets the local name of a declaration. This is primarily used for declarations that can be
   * referred to by name in the declaration's immediate scope (classes, enums, namespaces). A
   * local name will *never* be prefixed with an module or namespace export modifier like
   * "exports." when emitted as an expression.
   *
   * @param node The declaration.
   * @param allowComments A value indicating whether comments may be emitted for the name.
   * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
   */
  function getLocalName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
  /**
   * Gets whether an identifier should only be referred to by its local name.
   */
  function isLocalName(node: Identifier): boolean;
  /**
   * Gets the export name of a declaration. This is primarily used for declarations that can be
   * referred to by name in the declaration's immediate scope (classes, enums, namespaces). An
   * export name will *always* be prefixed with an module or namespace export modifier like
   * `"exports."` when emitted as an expression if the name points to an exported symbol.
   *
   * @param node The declaration.
   * @param allowComments A value indicating whether comments may be emitted for the name.
   * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
   */
  function getExportName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
  /**
   * Gets whether an identifier should only be referred to by its export representation if the
   * name points to an exported symbol.
   */
  function isExportName(node: Identifier): boolean;
  /**
   * Gets the name of a declaration for use in declarations.
   *
   * @param node The declaration.
   * @param allowComments A value indicating whether comments may be emitted for the name.
   * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
   */
  function getDeclarationName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
  /**
   * Gets the exported name of a declaration for use in expressions.
   *
   * An exported name will *always* be prefixed with an module or namespace export modifier like
   * "exports." if the name points to an exported symbol.
   *
   * @param ns The namespace identifier.
   * @param node The declaration.
   * @param allowComments A value indicating whether comments may be emitted for the name.
   * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
   */
  function getExternalModuleOrNamespaceExportName(ns: Identifier | undefined, node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier | PropertyAccessExpression;
  /**
   * Gets a namespace-qualified name for use in expressions.
   *
   * @param ns The namespace identifier.
   * @param name The name.
   * @param allowComments A value indicating whether comments may be emitted for the name.
   * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
   */
  function getNamespaceMemberName(ns: Identifier, name: Identifier, allowComments?: boolean, allowSourceMaps?: boolean): PropertyAccessExpression;
  function convertToFunctionBody(node: ConciseBody, multiLine?: boolean): Block;
  function convertFunctionDeclarationToExpression(node: FunctionDeclaration): FunctionExpression;
  /**
   * Add any necessary prologue-directives into target statement-array.
   * The function needs to be called during each transformation step.
   * This function needs to be called whenever we transform the statement
   * list of a source file, namespace, or function-like body.
   *
   * @param target: result statements array
   * @param source: origin statements array
   * @param ensureUseStrict: boolean determining whether the function need to add prologue-directives
   * @param visitor: Optional callback used to visit any custom prologue directives.
   */
  function addPrologue(target: Statement[], source: ReadonlyArray<Statement>, ensureUseStrict?: boolean, visitor?: (node: Node) => VisitResult<Node>): number;
  /**
   * Add just the standard (string-expression) prologue-directives into target statement-array.
   * The function needs to be called during each transformation step.
   * This function needs to be called whenever we transform the statement
   * list of a source file, namespace, or function-like body.
   */
  function addStandardPrologue(target: Statement[], source: ReadonlyArray<Statement>, ensureUseStrict?: boolean): number;
  /**
   * Add just the custom prologue-directives into target statement-array.
   * The function needs to be called during each transformation step.
   * This function needs to be called whenever we transform the statement
   * list of a source file, namespace, or function-like body.
   */
  function addCustomPrologue(target: Statement[], source: ReadonlyArray<Statement>, statementOffset: number, visitor?: (node: Node) => VisitResult<Node>): number;
  function addCustomPrologue(target: Statement[], source: ReadonlyArray<Statement>, statementOffset: number | undefined, visitor?: (node: Node) => VisitResult<Node>): number | undefined;
  function findUseStrictPrologue(statements: ReadonlyArray<Statement>): Statement | undefined;
  function startsWithUseStrict(statements: ReadonlyArray<Statement>): boolean;
  /**
   * Ensures "use strict" directive is added
   *
   * @param statements An array of statements
   */
  function ensureUseStrict(statements: NodeArray<Statement>): NodeArray<Statement>;
  /**
   * Wraps the operand to a BinaryExpression in parentheses if they are needed to preserve the intended
   * order of operations.
   *
   * @param binaryOperator The operator for the BinaryExpression.
   * @param operand The operand for the BinaryExpression.
   * @param isLeftSideOfBinary A value indicating whether the operand is the left side of the
   *                           BinaryExpression.
   */
  function parenthesizeBinaryOperand(binaryOperator: SyntaxKind, operand: Expression, isLeftSideOfBinary: boolean, leftOperand?: Expression): Expression;
  function parenthesizeForConditionalHead(condition: Expression): Expression;
  function parenthesizeSubexpressionOfConditionalExpression(e: Expression): Expression;
  /**
   *  [Per the spec](https://tc39.github.io/ecma262/#prod-ExportDeclaration), `export default` accepts _AssigmentExpression_ but
   *  has a lookahead restriction for `function`, `async function`, and `class`.
   *
   * Basically, that means we need to parenthesize in the following cases:
   *
   * - BinaryExpression of CommaToken
   * - CommaList (synthetic list of multiple comma expressions)
   * - FunctionExpression
   * - ClassExpression
   */
  function parenthesizeDefaultExpression(e: Expression): Expression;
  /**
   * Wraps an expression in parentheses if it is needed in order to use the expression
   * as the expression of a NewExpression node.
   *
   * @param expression The Expression node.
   */
  function parenthesizeForNew(expression: Expression): LeftHandSideExpression;
  /**
   * Wraps an expression in parentheses if it is needed in order to use the expression for
   * property or element access.
   *
   * @param expr The expression node.
   */
  function parenthesizeForAccess(expression: Expression): LeftHandSideExpression;
  function parenthesizePostfixOperand(operand: Expression): LeftHandSideExpression;
  function parenthesizePrefixOperand(operand: Expression): UnaryExpression;
  function parenthesizeListElements(elements: NodeArray<Expression>): NodeArray<Expression>;
  function parenthesizeExpressionForList(expression: Expression): Expression;
  function parenthesizeExpressionForExpressionStatement(expression: Expression): Expression;
  function parenthesizeConditionalTypeMember(member: TypeNode): TypeNode;
  function parenthesizeElementTypeMember(member: TypeNode): TypeNode;
  function parenthesizeArrayTypeMember(member: TypeNode): TypeNode;
  function parenthesizeElementTypeMembers(members: ReadonlyArray<TypeNode>): NodeArray<TypeNode>;
  function parenthesizeTypeParameters(typeParameters: ReadonlyArray<TypeNode> | undefined): MutableNodeArray<TypeNode> | undefined;
  function getLeftmostExpression(node: Expression, stopAtCallExpressions: boolean): Expression;
  function parenthesizeConciseBody(body: ConciseBody): ConciseBody;
  function isCommaSequence(node: Expression): node is (BinaryExpression & {
    operatorToken: Token<SyntaxKind.CommaToken>;
  }) | CommaListExpression;
  enum OuterExpressionKinds {
    Parentheses = 1,
    Assertions = 2,
    PartiallyEmittedExpressions = 4,
    All = 7
  }
  type OuterExpression = ParenthesizedExpression | TypeAssertion | AsExpression | NonNullExpression | PartiallyEmittedExpression;
  function isOuterExpression(node: Node, kinds?: OuterExpressionKinds): node is OuterExpression;
  function skipOuterExpressions(node: Expression, kinds?: OuterExpressionKinds): Expression;
  function skipOuterExpressions(node: Node, kinds?: OuterExpressionKinds): Node;
  function skipAssertions(node: Expression): Expression;
  function skipAssertions(node: Node): Node;
  function recreateOuterExpressions(outerExpression: Expression | undefined, innerExpression: Expression, kinds?: OuterExpressionKinds): Expression;
  function startOnNewLine<T extends Node>(node: T): T;
  function getExternalHelpersModuleName(node: SourceFile): Identifier | undefined;
  function hasRecordedExternalHelpers(sourceFile: SourceFile): boolean;
  function createExternalHelpersImportDeclarationIfNeeded(sourceFile: SourceFile, compilerOptions: CompilerOptions, hasExportStarsToExportValues?: boolean, hasImportStar?: boolean, hasImportDefault?: boolean): ImportDeclaration | undefined;
  function getOrCreateExternalHelpersModuleNameIfNeeded(node: SourceFile, compilerOptions: CompilerOptions, hasExportStarsToExportValues?: boolean, hasImportStarOrImportDefault?: boolean): Identifier | undefined;
  /**
   * Get the name of that target module from an import or export declaration
   */
  function getLocalNameForExternalImport(node: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration, sourceFile: SourceFile): Identifier | undefined;
  /**
   * Get the name of a target module from an import/export declaration as should be written in the emitted output.
   * The emitted output name can be different from the input if:
   *  1. The module has a /// <amd-module name="<new name>" />
   *  2. --out or --outFile is used, making the name relative to the rootDir
   *  3- The containing SourceFile has an entry in renamedDependencies for the import as requested by some module loaders (e.g. System).
   * Otherwise, a new StringLiteral node representing the module name will be returned.
   */
  function getExternalModuleNameLiteral(importNode: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration, sourceFile: SourceFile, host: EmitHost, resolver: EmitResolver, compilerOptions: CompilerOptions): StringLiteral | undefined;
  /**
   * Get the name of a module as should be written in the emitted output.
   * The emitted output name can be different from the input if:
   *  1. The module has a /// <amd-module name="<new name>" />
   *  2. --out or --outFile is used, making the name relative to the rootDir
   * Otherwise, a new StringLiteral node representing the module name will be returned.
   */
  function tryGetModuleNameFromFile(file: SourceFile | undefined, host: EmitHost, options: CompilerOptions): StringLiteral | undefined;
  /**
   * Gets the initializer of an BindingOrAssignmentElement.
   */
  function getInitializerOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): Expression | undefined;
  /**
   * Gets the name of an BindingOrAssignmentElement.
   */
  function getTargetOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): BindingOrAssignmentElementTarget | undefined;
  /**
   * Determines whether an BindingOrAssignmentElement is a rest element.
   */
  function getRestIndicatorOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): BindingOrAssignmentElementRestIndicator | undefined;
  /**
   * Gets the property name of a BindingOrAssignmentElement
   */
  function getPropertyNameOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): PropertyName | undefined;
  /**
   * Gets the elements of a BindingOrAssignmentPattern
   */
  function getElementsOfBindingOrAssignmentPattern(name: BindingOrAssignmentPattern): ReadonlyArray<BindingOrAssignmentElement>;
  function convertToArrayAssignmentElement(element: BindingOrAssignmentElement): Expression;
  function convertToObjectAssignmentElement(element: BindingOrAssignmentElement): ObjectLiteralElementLike;
  function convertToAssignmentPattern(node: BindingOrAssignmentPattern): AssignmentPattern;
  function convertToObjectAssignmentPattern(node: ObjectBindingOrAssignmentPattern): ObjectLiteralExpression;
  function convertToArrayAssignmentPattern(node: ArrayBindingOrAssignmentPattern): ArrayLiteralExpression;
  function convertToAssignmentElementTarget(node: BindingOrAssignmentElementTarget): Expression;
}
declare namespace ts {
  /**
   * Visits a Node using the supplied visitor, possibly returning a new Node in its place.
   *
   * @param node The Node to visit.
   * @param visitor The callback used to visit the Node.
   * @param test A callback to execute to verify the Node is valid.
   * @param lift An optional callback to execute to lift a NodeArray into a valid Node.
   */
  function visitNode<T extends Node>(node: T | undefined, visitor: Visitor | undefined, test?: (node: Node) => boolean, lift?: (node: NodeArray<Node>) => T): T;
  /**
   * Visits a Node using the supplied visitor, possibly returning a new Node in its place.
   *
   * @param node The Node to visit.
   * @param visitor The callback used to visit the Node.
   * @param test A callback to execute to verify the Node is valid.
   * @param lift An optional callback to execute to lift a NodeArray into a valid Node.
   */
  function visitNode<T extends Node>(node: T | undefined, visitor: Visitor | undefined, test?: (node: Node) => boolean, lift?: (node: NodeArray<Node>) => T): T | undefined;
  /**
   * Visits a NodeArray using the supplied visitor, possibly returning a new NodeArray in its place.
   *
   * @param nodes The NodeArray to visit.
   * @param visitor The callback used to visit a Node.
   * @param test A node test to execute for each node.
   * @param start An optional value indicating the starting offset at which to start visiting.
   * @param count An optional value indicating the maximum number of nodes to visit.
   */
  function visitNodes<T extends Node>(nodes: NodeArray<T> | undefined, visitor: Visitor, test?: (node: Node) => boolean, start?: number, count?: number): NodeArray<T>;
  /**
   * Visits a NodeArray using the supplied visitor, possibly returning a new NodeArray in its place.
   *
   * @param nodes The NodeArray to visit.
   * @param visitor The callback used to visit a Node.
   * @param test A node test to execute for each node.
   * @param start An optional value indicating the starting offset at which to start visiting.
   * @param count An optional value indicating the maximum number of nodes to visit.
   */
  function visitNodes<T extends Node>(nodes: NodeArray<T> | undefined, visitor: Visitor, test?: (node: Node) => boolean, start?: number, count?: number): NodeArray<T> | undefined;
  /**
   * Starts a new lexical environment and visits a statement list, ending the lexical environment
   * and merging hoisted declarations upon completion.
   */
  function visitLexicalEnvironment(statements: NodeArray<Statement>, visitor: Visitor, context: TransformationContext, start?: number, ensureUseStrict?: boolean): NodeArray<Statement>;
  /**
   * Starts a new lexical environment and visits a parameter list, suspending the lexical
   * environment upon completion.
   */
  function visitParameterList(nodes: NodeArray<ParameterDeclaration> | undefined, visitor: Visitor, context: TransformationContext, nodesVisitor?: typeof visitNodes): NodeArray<ParameterDeclaration>;
  /**
   * Resumes a suspended lexical environment and visits a function body, ending the lexical
   * environment and merging hoisted declarations upon completion.
   */
  function visitFunctionBody(node: FunctionBody, visitor: Visitor, context: TransformationContext): FunctionBody;
  /**
   * Resumes a suspended lexical environment and visits a function body, ending the lexical
   * environment and merging hoisted declarations upon completion.
   */
  function visitFunctionBody(node: FunctionBody | undefined, visitor: Visitor, context: TransformationContext): FunctionBody | undefined;
  /**
   * Resumes a suspended lexical environment and visits a concise body, ending the lexical
   * environment and merging hoisted declarations upon completion.
   */
  function visitFunctionBody(node: ConciseBody, visitor: Visitor, context: TransformationContext): ConciseBody;
  /**
   * Visits each child of a Node using the supplied visitor, possibly returning a new Node of the same kind in its place.
   *
   * @param node The Node whose children will be visited.
   * @param visitor The callback used to visit each child.
   * @param context A lexical environment context for the visitor.
   */
  function visitEachChild<T extends Node>(node: T, visitor: Visitor, context: TransformationContext): T;
  /**
   * Visits each child of a Node using the supplied visitor, possibly returning a new Node of the same kind in its place.
   *
   * @param node The Node whose children will be visited.
   * @param visitor The callback used to visit each child.
   * @param context A lexical environment context for the visitor.
   */
  function visitEachChild<T extends Node>(node: T | undefined, visitor: Visitor, context: TransformationContext, nodesVisitor?: typeof visitNodes, tokenVisitor?: Visitor): T | undefined;
}
declare namespace ts {
  /**
   * Similar to `reduceLeft`, performs a reduction against each child of a node.
   * NOTE: Unlike `forEachChild`, this does *not* visit every node.
   *
   * @param node The node containing the children to reduce.
   * @param initial The initial value to supply to the reduction.
   * @param f The callback function
   */
  function reduceEachChild<T>(node: Node | undefined, initial: T, cbNode: (memo: T, node: Node) => T, cbNodeArray?: (memo: T, nodes: NodeArray<Node>) => T): T;
  /**
   * Merges generated lexical declarations into a new statement list.
   */
  function mergeLexicalEnvironment(statements: NodeArray<Statement>, declarations: ReadonlyArray<Statement> | undefined): NodeArray<Statement>;
  /**
   * Appends generated lexical declarations to an array of statements.
   */
  function mergeLexicalEnvironment(statements: Statement[], declarations: ReadonlyArray<Statement> | undefined): Statement[];
  /**
   * Lifts a NodeArray containing only Statement nodes to a block.
   *
   * @param nodes The NodeArray.
   */
  function liftToBlock(nodes: ReadonlyArray<Node>): Statement;
  /**
   * Aggregates the TransformFlags for a Node and its subtree.
   */
  function aggregateTransformFlags<T extends Node>(node: T): T;
}
declare namespace ts {
  interface SourceMapGeneratorOptions {
    extendedDiagnostics?: boolean;
  }
  function createSourceMapGenerator(host: EmitHost, file: string, sourceRoot: string, sourcesDirectoryPath: string, generatorOptions: SourceMapGeneratorOptions): SourceMapGenerator;
  interface LineInfo {
    getLineCount(): number;
    getLineText(line: number): string;
  }
  function getLineInfo(text: string, lineStarts: ReadonlyArray<number>): LineInfo;
  /**
   * Tries to find the sourceMappingURL comment at the end of a file.
   */
  function tryGetSourceMappingURL(lineInfo: LineInfo): string | undefined;
  function isRawSourceMap(x: any): x is RawSourceMap;
  function tryParseRawSourceMap(text: string): RawSourceMap | undefined;
  interface MappingsDecoder extends Iterator<Mapping> {
    readonly pos: number;
    readonly error: string | undefined;
    readonly state: Required<Mapping>;
  }
  interface Mapping {
    generatedLine: number;
    generatedCharacter: number;
    sourceIndex?: number;
    sourceLine?: number;
    sourceCharacter?: number;
    nameIndex?: number;
  }
  interface SourceMapping extends Mapping {
    sourceIndex: number;
    sourceLine: number;
    sourceCharacter: number;
  }
  function decodeMappings(mappings: string): MappingsDecoder;
  function sameMapping<T extends Mapping>(left: T, right: T): boolean;
  function isSourceMapping(mapping: Mapping): mapping is SourceMapping;
  function createDocumentPositionMapper(host: DocumentPositionMapperHost, map: RawSourceMap, mapPath: string): DocumentPositionMapper;
  const identitySourceMapConsumer: DocumentPositionMapper;
}
declare namespace ts {
  function getOriginalNodeId(node: Node): number;
  interface ExternalModuleInfo {
    externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[];
    externalHelpersImportDeclaration: ImportDeclaration | undefined;
    exportSpecifiers: Map<ExportSpecifier[]>;
    exportedBindings: Identifier[][];
    exportedNames: Identifier[] | undefined;
    exportEquals: ExportAssignment | undefined;
    hasExportStarsToExportValues: boolean;
  }
  function chainBundle(transformSourceFile: (x: SourceFile) => SourceFile): (x: SourceFile | Bundle) => SourceFile | Bundle;
  function getImportNeedsImportStarHelper(node: ImportDeclaration): boolean;
  function getImportNeedsImportDefaultHelper(node: ImportDeclaration): boolean;
  function collectExternalModuleInfo(sourceFile: SourceFile, resolver: EmitResolver, compilerOptions: CompilerOptions): ExternalModuleInfo;
  /**
   * Used in the module transformer to check if an expression is reasonably without sideeffect,
   *  and thus better to copy into multiple places rather than to cache in a temporary variable
   *  - this is mostly subjective beyond the requirement that the expression not be sideeffecting
   */
  function isSimpleCopiableExpression(expression: Expression): boolean;
  /**
   * A simple inlinable expression is an expression which can be copied into multiple locations
   * without risk of repeating any sideeffects and whose value could not possibly change between
   * any such locations
   */
  function isSimpleInlineableExpression(expression: Expression): boolean;
  /**
   * Adds super call and preceding prologue directives into the list of statements.
   *
   * @param ctor The constructor node.
   * @param result The list of statements.
   * @param visitor The visitor to apply to each node added to the result array.
   * @returns index of the statement that follows super call
   */
  function addPrologueDirectivesAndInitialSuperCall(ctor: ConstructorDeclaration, result: Statement[], visitor: Visitor): number;
  /**
   * @param input Template string input strings
   * @param args Names which need to be made file-level unique
   */
  function helperString(input: TemplateStringsArray, ...args: string[]): (uniqueName: EmitHelperUniqueNameCallback) => string;
  /**
   * Gets all property declarations with initializers on either the static or instance side of a class.
   *
   * @param node The class node.
   * @param isStatic A value indicating whether to get properties from the static or instance side of the class.
   */
  function getInitializedProperties(node: ClassExpression | ClassDeclaration, isStatic: boolean): ReadonlyArray<PropertyDeclaration>;
  /**
   * Gets a value indicating whether a class element is a static property declaration with an initializer.
   *
   * @param member The class element node.
   */
  function isStaticInitializedProperty(member: ClassElement): member is PropertyDeclaration & {
    initializer: Expression;
  };
  /**
   * Gets a value indicating whether a class element is an instance property declaration with an initializer.
   *
   * @param member The class element node.
   */
  function isInstanceInitializedProperty(member: ClassElement): member is PropertyDeclaration & {
    initializer: Expression;
  };
  /**
   * Gets a value indicating whether a class element is either a static or an instance property declaration with an initializer.
   *
   * @param member The class element node.
   * @param isStatic A value indicating whether the member should be a static or instance member.
   */
  function isInitializedProperty(member: ClassElement): member is PropertyDeclaration & {
    initializer: Expression;
  };
}
declare namespace ts {
  enum FlattenLevel {
    All = 0,
    ObjectRest = 1
  }
  /**
   * Flattens a DestructuringAssignment or a VariableDeclaration to an expression.
   *
   * @param node The node to flatten.
   * @param visitor An optional visitor used to visit initializers.
   * @param context The transformation context.
   * @param level Indicates the extent to which flattening should occur.
   * @param needsValue An optional value indicating whether the value from the right-hand-side of
   * the destructuring assignment is needed as part of a larger expression.
   * @param createAssignmentCallback An optional callback used to create the assignment expression.
   */
  function flattenDestructuringAssignment(node: VariableDeclaration | DestructuringAssignment, visitor: ((node: Node) => VisitResult<Node>) | undefined, context: TransformationContext, level: FlattenLevel, needsValue?: boolean, createAssignmentCallback?: (name: Identifier, value: Expression, location?: TextRange) => Expression): Expression;
  /**
   * Flattens a VariableDeclaration or ParameterDeclaration to one or more variable declarations.
   *
   * @param node The node to flatten.
   * @param visitor An optional visitor used to visit initializers.
   * @param context The transformation context.
   * @param boundValue The value bound to the declaration.
   * @param skipInitializer A value indicating whether to ignore the initializer of `node`.
   * @param hoistTempVariables Indicates whether temporary variables should not be recorded in-line.
   * @param level Indicates the extent to which flattening should occur.
   */
  function flattenDestructuringBinding(node: VariableDeclaration | ParameterDeclaration, visitor: (node: Node) => VisitResult<Node>, context: TransformationContext, level: FlattenLevel, rval?: Expression, hoistTempVariables?: boolean, skipInitializer?: boolean): VariableDeclaration[];
  const restHelper: UnscopedEmitHelper;
}
declare namespace ts {
  function transformTypeScript(context: TransformationContext): (node: SourceFile | Bundle) => SourceFile | Bundle;
  const decorateHelper: UnscopedEmitHelper;
  const metadataHelper: UnscopedEmitHelper;
  const paramHelper: UnscopedEmitHelper;
}
declare namespace ts {
  /**
   * Transforms ECMAScript Class Syntax.
   * TypeScript parameter property syntax is transformed in the TypeScript transformer.
   * For now, this transforms public field declarations using TypeScript class semantics
   * (where the declarations get elided and initializers are transformed as assignments in the constructor).
   * Eventually, this transform will change to the ECMAScript semantics (with Object.defineProperty).
   */
  function transformClassFields(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformES2017(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
  /** Creates a variable named `_super` with accessor properties for the given property names. */
  function createSuperAccessVariableStatement(resolver: EmitResolver, node: FunctionLikeDeclaration, names: UnderscoreEscapedMap<true>): VariableStatement;
  const awaiterHelper: UnscopedEmitHelper;
  const asyncSuperHelper: EmitHelper;
  const advancedAsyncSuperHelper: EmitHelper;
}
declare namespace ts {
  function transformES2018(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
  const assignHelper: UnscopedEmitHelper;
  function createAssignHelper(context: TransformationContext, attributesSegments: Expression[]): CallExpression;
  const awaitHelper: UnscopedEmitHelper;
  const asyncGeneratorHelper: UnscopedEmitHelper;
  const asyncDelegator: UnscopedEmitHelper;
  const asyncValues: UnscopedEmitHelper;
}
declare namespace ts {
  function transformES2019(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformESNext(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformJsx(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformES2016(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformES2015(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
  const extendsHelper: UnscopedEmitHelper;
  const templateObjectHelper: UnscopedEmitHelper;
}
declare namespace ts {
  /**
   * Transforms ES5 syntax into ES3 syntax.
   *
   * @param context Context and state information for the transformation.
   */
  function transformES5(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformGenerators(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
  const generatorHelper: UnscopedEmitHelper;
}
declare namespace ts {
  function transformModule(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
  const importStarHelper: UnscopedEmitHelper;
  const importDefaultHelper: UnscopedEmitHelper;
}
declare namespace ts {
  function transformSystemModule(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  function transformES2015Module(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
  type GetSymbolAccessibilityDiagnostic = (symbolAccessibilityResult: SymbolAccessibilityResult) => (SymbolAccessibilityDiagnostic | undefined);
  interface SymbolAccessibilityDiagnostic {
    errorNode: Node;
    diagnosticMessage: DiagnosticMessage;
    typeName?: DeclarationName | QualifiedName;
  }
  type DeclarationDiagnosticProducing = VariableDeclaration | PropertyDeclaration | PropertySignature | BindingElement | SetAccessorDeclaration | GetAccessorDeclaration | ConstructSignatureDeclaration | CallSignatureDeclaration | MethodDeclaration | MethodSignature | FunctionDeclaration | ParameterDeclaration | TypeParameterDeclaration | ExpressionWithTypeArguments | ImportEqualsDeclaration | TypeAliasDeclaration | ConstructorDeclaration | IndexSignatureDeclaration | PropertyAccessExpression;
  function canProduceDiagnostics(node: Node): node is DeclarationDiagnosticProducing;
  function createGetSymbolAccessibilityDiagnosticForNodeName(node: DeclarationDiagnosticProducing): (symbolAccessibilityResult: SymbolAccessibilityResult) => SymbolAccessibilityDiagnostic | undefined;
  function createGetSymbolAccessibilityDiagnosticForNode(node: DeclarationDiagnosticProducing): (symbolAccessibilityResult: SymbolAccessibilityResult) => SymbolAccessibilityDiagnostic | undefined;
}
declare namespace ts {
  function getDeclarationDiagnostics(host: EmitHost, resolver: EmitResolver, file: SourceFile | undefined): DiagnosticWithLocation[] | undefined;
  function isInternalDeclaration(node: Node, currentSourceFile: SourceFile): boolean | 0 | undefined;
  /**
   * Transforms a ts file into a .d.ts file
   * This process requires type information, which is retrieved through the emit resolver. Because of this,
   * in many places this transformer assumes it will be operating on parse tree nodes directly.
   * This means that _no transforms should be allowed to occur before this one_.
   */
  function transformDeclarations(context: TransformationContext): {
    (node: Bundle): Bundle;
    (node: SourceFile): SourceFile;
    (node: SourceFile | Bundle): SourceFile | Bundle;
  };
}
declare namespace ts {
  const noTransformers: EmitTransformers;
  function getTransformers(compilerOptions: CompilerOptions, customTransformers?: CustomTransformers, emitOnlyDtsFiles?: boolean): EmitTransformers;
  function noEmitSubstitution(_hint: EmitHint, node: Node): Node;
  function noEmitNotification(hint: EmitHint, node: Node, callback: (hint: EmitHint, node: Node) => void): void;
  /**
   * Transforms an array of SourceFiles by passing them through each transformer.
   *
   * @param resolver The emit resolver provided by the checker.
   * @param host The emit host object used to interact with the file system.
   * @param options Compiler options to surface in the `TransformationContext`.
   * @param nodes An array of nodes to transform.
   * @param transforms An array of `TransformerFactory` callbacks.
   * @param allowDtsFiles A value indicating whether to allow the transformation of .d.ts files.
   */
  function transformNodes<T extends Node>(resolver: EmitResolver | undefined, host: EmitHost | undefined, options: CompilerOptions, nodes: ReadonlyArray<T>, transformers: ReadonlyArray<TransformerFactory<T>>, allowDtsFiles: boolean): TransformationResult<T>;
}
declare namespace ts {
  function isBuildInfoFile(file: string): boolean;
  /**
   * Iterates over the source files that are expected to have an emit output.
   *
   * @param host An EmitHost.
   * @param action The action to execute.
   * @param sourceFilesOrTargetSourceFile
   *   If an array, the full list of source files to emit.
   *   Else, calls `getSourceFilesToEmit` with the (optional) target source file to determine the list of source files to emit.
   */
  function forEachEmittedFile<T>(host: EmitHost, action: (emitFileNames: EmitFileNames, sourceFileOrBundle: SourceFile | Bundle | undefined) => T, sourceFilesOrTargetSourceFile?: ReadonlyArray<SourceFile> | SourceFile, emitOnlyDtsFiles?: boolean, onlyBuildInfo?: boolean, includeBuildInfo?: boolean): T | undefined;
  function getOutputPathForBuildInfo(options: CompilerOptions): string | undefined;
  function getOutputPathsForBundle(options: CompilerOptions, forceDtsPaths: boolean): EmitFileNames;
  function getOutputPathsFor(sourceFile: SourceFile | Bundle, host: EmitHost, forceDtsPaths: boolean): EmitFileNames;
  function getOutputExtension(sourceFile: SourceFile, options: CompilerOptions): Extension;
  function getOutputDeclarationFileName(inputFileName: string, configFile: ParsedCommandLine, ignoreCase: boolean): string;
  function getAllProjectOutputs(configFile: ParsedCommandLine, ignoreCase: boolean): ReadonlyArray<string>;
  function getFirstProjectOutput(configFile: ParsedCommandLine, ignoreCase: boolean): string;
  function emitFiles(resolver: EmitResolver, host: EmitHost, targetSourceFile: SourceFile | undefined, { scriptTransformers, declarationTransformers }: EmitTransformers, emitOnlyDtsFiles?: boolean, onlyBuildInfo?: boolean): EmitResult;
  function getBuildInfoText(buildInfo: BuildInfo): string;
  function getBuildInfo(buildInfoText: string): BuildInfo;
  const notImplementedResolver: EmitResolver;
  /** File that isnt present resulting in error or output files */
  type EmitUsingBuildInfoResult = string | ReadonlyArray<OutputFile>;
  interface EmitUsingBuildInfoHost extends ModuleResolutionHost {
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
  }
  function emitUsingBuildInfo(config: ParsedCommandLine, host: EmitUsingBuildInfoHost, getCommandLine: (ref: ProjectReference) => ParsedCommandLine | undefined, customTransformers?: CustomTransformers): EmitUsingBuildInfoResult;
  function createPrinter(printerOptions?: PrinterOptions, handlers?: PrintHandlers): Printer;
}
declare namespace ts {
  /**
   * Partial interface of the System thats needed to support the caching of directory structure
   */
  interface DirectoryStructureHost {
    fileExists(path: string): boolean;
    readFile(path: string, encoding?: string): string | undefined;
    directoryExists?(path: string): boolean;
    getDirectories?(path: string): string[];
    readDirectory?(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    realpath?(path: string): string;
    createDirectory?(path: string): void;
    writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
  }
  interface FileAndDirectoryExistence {
    fileExists: boolean;
    directoryExists: boolean;
  }
  interface CachedDirectoryStructureHost extends DirectoryStructureHost {
    useCaseSensitiveFileNames: boolean;
    getDirectories(path: string): string[];
    readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    /** Returns the queried result for the file exists and directory exists if at all it was done */
    addOrDeleteFileOrDirectory(fileOrDirectory: string, fileOrDirectoryPath: Path): FileAndDirectoryExistence | undefined;
    addOrDeleteFile(fileName: string, filePath: Path, eventKind: FileWatcherEventKind): void;
    clearCache(): void;
  }
  function createCachedDirectoryStructureHost(host: DirectoryStructureHost, currentDirectory: string, useCaseSensitiveFileNames: boolean): CachedDirectoryStructureHost | undefined;
  enum ConfigFileProgramReloadLevel {
    None = 0,
    /** Update the file name list from the disk */
    Partial = 1,
    /** Reload completely by re-reading contents of config file from disk and updating program */
    Full = 2
  }
  /**
   * Updates the existing missing file watches with the new set of missing files after new program is created
   */
  function updateMissingFilePathsWatch(program: Program, missingFileWatches: Map<FileWatcher>, createMissingFileWatch: (missingFilePath: Path) => FileWatcher): void;
  interface WildcardDirectoryWatcher {
    watcher: FileWatcher;
    flags: WatchDirectoryFlags;
  }
  /**
   * Updates the existing wild card directory watches with the new set of wild card directories from the config file
   * after new program is created because the config file was reloaded or program was created first time from the config file
   * Note that there is no need to call this function when the program is updated with additional files without reloading config files,
   * as wildcard directories wont change unless reloading config file
   */
  function updateWatchingWildcardDirectories(existingWatchedForWildcards: Map<WildcardDirectoryWatcher>, wildcardDirectories: Map<WatchDirectoryFlags>, watchDirectory: (directory: string, flags: WatchDirectoryFlags) => FileWatcher): void;
  function isEmittedFileOfProgram(program: Program | undefined, file: string): boolean;
  enum WatchLogLevel {
    None = 0,
    TriggerOnly = 1,
    Verbose = 2
  }
  interface WatchFileHost {
    watchFile(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
  }
  interface WatchDirectoryHost {
    watchDirectory(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
  }
  type WatchFile<X, Y> = (host: WatchFileHost, file: string, callback: FileWatcherCallback, pollingInterval: PollingInterval, detailInfo1: X, detailInfo2?: Y) => FileWatcher;
  type FilePathWatcherCallback = (fileName: string, eventKind: FileWatcherEventKind, filePath: Path) => void;
  type WatchFilePath<X, Y> = (host: WatchFileHost, file: string, callback: FilePathWatcherCallback, pollingInterval: PollingInterval, path: Path, detailInfo1: X, detailInfo2?: Y) => FileWatcher;
  type WatchDirectory<X, Y> = (host: WatchDirectoryHost, directory: string, callback: DirectoryWatcherCallback, flags: WatchDirectoryFlags, detailInfo1: X, detailInfo2?: Y) => FileWatcher;
  interface WatchFactory<X, Y> {
    watchFile: WatchFile<X, Y>;
    watchFilePath: WatchFilePath<X, Y>;
    watchDirectory: WatchDirectory<X, Y>;
  }
  function getWatchFactory<X, Y = undefined>(watchLogLevel: WatchLogLevel, log: (s: string) => void, getDetailWatchInfo?: GetDetailWatchInfo<X, Y>): WatchFactory<X, Y>;
  type GetDetailWatchInfo<X, Y> = (detailInfo1: X, detailInfo2: Y | undefined) => string;
  function closeFileWatcherOf<T extends {
    watcher: FileWatcher;
  }>(objWithWatcher: T): void;
}
declare namespace ts {
  export function findConfigFile(searchPath: string, fileExists: (fileName: string) => boolean, configName?: string): string | undefined;
  export function resolveTripleslashReference(moduleName: string, containingFile: string): string;
  export function computeCommonSourceDirectoryOfFilenames(fileNames: string[], currentDirectory: string, getCanonicalFileName: GetCanonicalFileName): string;
  export function createCompilerHost(options: CompilerOptions, setParentNodes?: boolean): CompilerHost;
  export function createCompilerHostWorker(options: CompilerOptions, setParentNodes?: boolean, system?: System): CompilerHost;
  interface CompilerHostLikeForCache {
    fileExists(fileName: string): boolean;
    readFile(fileName: string, encoding?: string): string | undefined;
    directoryExists?(directory: string): boolean;
    createDirectory?(directory: string): void;
    writeFile?: WriteFileCallback;
  }
  export function changeCompilerHostLikeToUseCache(host: CompilerHostLikeForCache, toPath: (fileName: string) => Path, getSourceFile?: CompilerHost["getSourceFile"]): {
    originalReadFile: (fileName: string, encoding?: string | undefined) => string | undefined;
    originalFileExists: (fileName: string) => boolean;
    originalDirectoryExists: ((directory: string) => boolean) | undefined;
    originalCreateDirectory: ((directory: string) => void) | undefined;
    originalWriteFile: WriteFileCallback | undefined;
    getSourceFileWithCache: ((fileName: string, languageVersion: ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined) => SourceFile | undefined) | undefined;
    readFileWithCache: (fileName: string) => string | undefined;
  };
  export function getPreEmitDiagnostics(program: Program, sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
  export function getPreEmitDiagnostics(program: BuilderProgram, sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
  export interface FormatDiagnosticsHost {
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    getNewLine(): string;
  }
  export function formatDiagnostics(diagnostics: ReadonlyArray<Diagnostic>, host: FormatDiagnosticsHost): string;
  export function formatDiagnostic(diagnostic: Diagnostic, host: FormatDiagnosticsHost): string;
  /** @internal */
  export enum ForegroundColorEscapeSequences {
    Grey = "\u001B[90m",
    Red = "\u001B[91m",
    Yellow = "\u001B[93m",
    Blue = "\u001B[94m",
    Cyan = "\u001B[96m"
  }
  /** @internal */
  export function formatColorAndReset(text: string, formatStyle: string): string;
  export function formatLocation(file: SourceFile, start: number, host: FormatDiagnosticsHost, color?: typeof formatColorAndReset): string;
  export function formatDiagnosticsWithColorAndContext(diagnostics: ReadonlyArray<Diagnostic>, host: FormatDiagnosticsHost): string;
  export function flattenDiagnosticMessageText(diag: string | DiagnosticMessageChain | undefined, newLine: string, indent?: number): string;
  export function loadWithLocalCache<T>(names: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, loader: (name: string, containingFile: string, redirectedReference: ResolvedProjectReference | undefined) => T): T[];
  /**
   * Determines if program structure is upto date or needs to be recreated
   */
  export function isProgramUptoDate(program: Program | undefined, rootFileNames: string[], newOptions: CompilerOptions, getSourceVersion: (path: Path) => string | undefined, fileExists: (fileName: string) => boolean, hasInvalidatedResolution: HasInvalidatedResolution, hasChangedAutomaticTypeDirectiveNames: boolean, projectReferences: ReadonlyArray<ProjectReference> | undefined): boolean;
  export function getConfigFileParsingDiagnostics(configFileParseResult: ParsedCommandLine): ReadonlyArray<Diagnostic>;
  /**
   * Create a new 'Program' instance. A Program is an immutable collection of 'SourceFile's and a 'CompilerOptions'
   * that represent a compilation unit.
   *
   * Creating a program proceeds from a set of root files, expanding the set of inputs by following imports and
   * triple-slash-reference-path directives transitively. '@types' and triple-slash-reference-types are also pulled in.
   *
   * @param createProgramOptions - The options for creating a program.
   * @returns A 'Program' object.
   */
  export function createProgram(createProgramOptions: CreateProgramOptions): Program;
  /**
   * Create a new 'Program' instance. A Program is an immutable collection of 'SourceFile's and a 'CompilerOptions'
   * that represent a compilation unit.
   *
   * Creating a program proceeds from a set of root files, expanding the set of inputs by following imports and
   * triple-slash-reference-path directives transitively. '@types' and triple-slash-reference-types are also pulled in.
   *
   * @param rootNames - A set of root files.
   * @param options - The compiler options which should be used.
   * @param host - The host interacts with the underlying file system.
   * @param oldProgram - Reuses an old program structure.
   * @param configFileParsingDiagnostics - error during config file parsing
   * @returns A 'Program' object.
   */
  export function createProgram(rootNames: ReadonlyArray<string>, options: CompilerOptions, host?: CompilerHost, oldProgram?: Program, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>): Program;
  interface CompilerHostLike {
    useCaseSensitiveFileNames(): boolean;
    getCurrentDirectory(): string;
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string | undefined;
    readDirectory?(rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): string[];
    trace?(s: string): void;
    onUnRecoverableConfigFileDiagnostic?: DiagnosticReporter;
  }
  export function parseConfigHostFromCompilerHostLike(host: CompilerHostLike, directoryStructureHost?: DirectoryStructureHost): ParseConfigFileHost;
  /** @deprecated */ export interface ResolveProjectReferencePathHost {
    fileExists(fileName: string): boolean;
  }
  export function createPrependNodes(projectReferences: ReadonlyArray<ProjectReference> | undefined, getCommandLine: (ref: ProjectReference, index: number) => ParsedCommandLine | undefined, readFile: (path: string) => string | undefined): InputFiles[];
  /**
   * Returns the target config filename of a project reference.
   * Note: The file might not exist.
   */
  export function resolveProjectReferencePath(ref: ProjectReference): ResolvedConfigFileName;
  /** @deprecated */ export function resolveProjectReferencePath(host: ResolveProjectReferencePathHost, ref: ProjectReference): ResolvedConfigFileName;
  /**
   * Returns a DiagnosticMessage if we won't include a resolved module due to its extension.
   * The DiagnosticMessage's parameters are the imported module name, and the filename it resolved to.
   * This returns a diagnostic even if the module will be an untyped module.
   */
  export function getResolutionDiagnostic(options: CompilerOptions, { extension }: ResolvedModuleFull): DiagnosticMessage | undefined;
  export {};
}
declare namespace ts {
  interface EmitOutput {
    outputFiles: OutputFile[];
    emitSkipped: boolean;
    exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
  }
  interface OutputFile {
    name: string;
    writeByteOrderMark: boolean;
    text: string;
  }
}
declare namespace ts {
  function getFileEmitOutput(program: Program, sourceFile: SourceFile, emitOnlyDtsFiles: boolean, cancellationToken?: CancellationToken, customTransformers?: CustomTransformers): EmitOutput;
  interface ReusableBuilderState {
    /**
     * Information of the file eg. its version, signature etc
     */
    fileInfos: ReadonlyMap<BuilderState.FileInfo>;
    /**
     * Contains the map of ReferencedSet=Referenced files of the file if module emit is enabled
     * Otherwise undefined
     * Thus non undefined value indicates, module emit
     */
    readonly referencedMap?: ReadonlyMap<BuilderState.ReferencedSet> | undefined;
    /**
     * Contains the map of exported modules ReferencedSet=exported module files from the file if module emit is enabled
     * Otherwise undefined
     */
    readonly exportedModulesMap?: ReadonlyMap<BuilderState.ReferencedSet> | undefined;
  }
  interface BuilderState {
    /**
     * Information of the file eg. its version, signature etc
     */
    fileInfos: Map<BuilderState.FileInfo>;
    /**
     * Contains the map of ReferencedSet=Referenced files of the file if module emit is enabled
     * Otherwise undefined
     * Thus non undefined value indicates, module emit
     */
    readonly referencedMap: ReadonlyMap<BuilderState.ReferencedSet> | undefined;
    /**
     * Contains the map of exported modules ReferencedSet=exported module files from the file if module emit is enabled
     * Otherwise undefined
     */
    readonly exportedModulesMap: Map<BuilderState.ReferencedSet> | undefined;
    /**
     * Map of files that have already called update signature.
     * That means hence forth these files are assumed to have
     * no change in their signature for this version of the program
     */
    hasCalledUpdateShapeSignature: Map<true>;
    /**
     * Cache of all files excluding default library file for the current program
     */
    allFilesExcludingDefaultLibraryFile?: ReadonlyArray<SourceFile>;
    /**
     * Cache of all the file names
     */
    allFileNames?: ReadonlyArray<string>;
  }
  function cloneMapOrUndefined<T>(map: ReadonlyMap<T> | undefined): Map<T> | undefined;
}
declare namespace ts.BuilderState {
  /**
   * Information about the source file: Its version and optional signature from last emit
   */
  interface FileInfo {
    readonly version: string;
    signature: string | undefined;
  }
  /**
   * Referenced files with values for the keys as referenced file's path to be true
   */
  type ReferencedSet = ReadonlyMap<true>;
  /**
   * Compute the hash to store the shape of the file
   */
  type ComputeHash = (data: string) => string;
  /**
   * Exported modules to from declaration emit being computed.
   * This can contain false in the affected file path to specify that there are no exported module(types from other modules) for this file
   */
  type ComputingExportedModulesMap = Map<ReferencedSet | false>;
  /**
   * Returns true if oldState is reusable, that is the emitKind = module/non module has not changed
   */
  function canReuseOldState(newReferencedMap: ReadonlyMap<ReferencedSet> | undefined, oldState: Readonly<ReusableBuilderState> | undefined): boolean | undefined;
  /**
   * Creates the state of file references and signature for the new program from oldState if it is safe
   */
  function create(newProgram: Program, getCanonicalFileName: GetCanonicalFileName, oldState?: Readonly<ReusableBuilderState>): BuilderState;
  /**
   * Releases needed properties
   */
  function releaseCache(state: BuilderState): void;
  /**
   * Creates a clone of the state
   */
  function clone(state: Readonly<BuilderState>): BuilderState;
  /**
   * Gets the files affected by the path from the program
   */
  function getFilesAffectedBy(state: BuilderState, programOfThisState: Program, path: Path, cancellationToken: CancellationToken | undefined, computeHash: ComputeHash, cacheToUpdateSignature?: Map<string>, exportedModulesMapCache?: ComputingExportedModulesMap): ReadonlyArray<SourceFile>;
  /**
   * Updates the signatures from the cache into state's fileinfo signatures
   * This should be called whenever it is safe to commit the state of the builder
   */
  function updateSignaturesFromCache(state: BuilderState, signatureCache: Map<string>): void;
  /**
   * Returns if the shape of the signature has changed since last emit
   */
  function updateShapeSignature(state: Readonly<BuilderState>, programOfThisState: Program, sourceFile: SourceFile, cacheToUpdateSignature: Map<string>, cancellationToken: CancellationToken | undefined, computeHash: ComputeHash, exportedModulesMapCache?: ComputingExportedModulesMap): boolean;
  /**
   * Updates the exported modules from cache into state's exported modules map
   * This should be called whenever it is safe to commit the state of the builder
   */
  function updateExportedFilesMapFromCache(state: BuilderState, exportedModulesMapCache: ComputingExportedModulesMap | undefined): void;
  /**
   * Get all the dependencies of the sourceFile
   */
  function getAllDependencies(state: BuilderState, programOfThisState: Program, sourceFile: SourceFile): ReadonlyArray<string>;
}
declare namespace ts {
  interface ReusableDiagnostic extends ReusableDiagnosticRelatedInformation {
    /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
    reportsUnnecessary?: {};
    source?: string;
    relatedInformation?: ReusableDiagnosticRelatedInformation[];
  }
  interface ReusableDiagnosticRelatedInformation {
    category: DiagnosticCategory;
    code: number;
    file: string | undefined;
    start: number | undefined;
    length: number | undefined;
    messageText: string | ReusableDiagnosticMessageChain;
  }
  type ReusableDiagnosticMessageChain = DiagnosticMessageChain;
  interface ReusableBuilderProgramState extends ReusableBuilderState {
    /**
     * Cache of semantic diagnostics for files with their Path being the key
     */
    semanticDiagnosticsPerFile?: ReadonlyMap<ReadonlyArray<ReusableDiagnostic> | ReadonlyArray<Diagnostic>> | undefined;
    /**
     * The map has key by source file's path that has been changed
     */
    changedFilesSet?: ReadonlyMap<true>;
    /**
     * Set of affected files being iterated
     */
    affectedFiles?: ReadonlyArray<SourceFile> | undefined;
    /**
     * Current changed file for iterating over affected files
     */
    currentChangedFilePath?: Path | undefined;
    /**
     * Map of file signatures, with key being file path, calculated while getting current changed file's affected files
     * These will be committed whenever the iteration through affected files of current changed file is complete
     */
    currentAffectedFilesSignatures?: ReadonlyMap<string> | undefined;
    /**
     * Newly computed visible to outside referencedSet
     */
    currentAffectedFilesExportedModulesMap?: Readonly<BuilderState.ComputingExportedModulesMap> | undefined;
    /**
     * True if the semantic diagnostics were copied from the old state
     */
    semanticDiagnosticsFromOldState?: Map<true>;
    /**
     * program corresponding to this state
     */
    program?: Program | undefined;
    /**
     * compilerOptions for the program
     */
    compilerOptions: CompilerOptions;
    /**
     * Files pending to be emitted
     */
    affectedFilesPendingEmit?: ReadonlyArray<Path> | undefined;
    /**
     * Current index to retrieve pending affected file
     */
    affectedFilesPendingEmitIndex?: number | undefined;
    hasReusableDiagnostic?: true;
  }
  /**
   * State to store the changed files, affected files and cache semantic diagnostics
   */
  interface BuilderProgramState extends BuilderState {
    /**
     * Cache of semantic diagnostics for files with their Path being the key
     */
    semanticDiagnosticsPerFile: Map<ReadonlyArray<Diagnostic>> | undefined;
    /**
     * The map has key by source file's path that has been changed
     */
    changedFilesSet: Map<true>;
    /**
     * Set of affected files being iterated
     */
    affectedFiles: ReadonlyArray<SourceFile> | undefined;
    /**
     * Current index to retrieve affected file from
     */
    affectedFilesIndex: number | undefined;
    /**
     * Current changed file for iterating over affected files
     */
    currentChangedFilePath: Path | undefined;
    /**
     * Map of file signatures, with key being file path, calculated while getting current changed file's affected files
     * These will be committed whenever the iteration through affected files of current changed file is complete
     */
    currentAffectedFilesSignatures: Map<string> | undefined;
    /**
     * Newly computed visible to outside referencedSet
     */
    currentAffectedFilesExportedModulesMap: BuilderState.ComputingExportedModulesMap | undefined;
    /**
     * Already seen affected files
     */
    seenAffectedFiles: Map<true> | undefined;
    /**
     * whether this program has cleaned semantic diagnostics cache for lib files
     */
    cleanedDiagnosticsOfLibFiles?: boolean;
    /**
     * True if the semantic diagnostics were copied from the old state
     */
    semanticDiagnosticsFromOldState?: Map<true>;
    /**
     * program corresponding to this state
     */
    program: Program | undefined;
    /**
     * compilerOptions for the program
     */
    compilerOptions: CompilerOptions;
    /**
     * Files pending to be emitted
     */
    affectedFilesPendingEmit: ReadonlyArray<Path> | undefined;
    /**
     * Current index to retrieve pending affected file
     */
    affectedFilesPendingEmitIndex: number | undefined;
    /**
     * true if build info is emitted
     */
    emittedBuildInfo?: boolean;
    /**
     * Already seen affected files
     */
    seenEmittedFiles: Map<true> | undefined;
    /**
     * true if program has been emitted
     */
    programEmitComplete?: true;
  }
  type ProgramBuildInfoDiagnostic = string | [string, ReadonlyArray<ReusableDiagnostic>];
  interface ProgramBuildInfo {
    fileInfos: MapLike<BuilderState.FileInfo>;
    options: CompilerOptions;
    referencedMap?: MapLike<string[]>;
    exportedModulesMap?: MapLike<string[]>;
    semanticDiagnosticsPerFile?: ProgramBuildInfoDiagnostic[];
  }
  enum BuilderProgramKind {
    SemanticDiagnosticsBuilderProgram = 0,
    EmitAndSemanticDiagnosticsBuilderProgram = 1
  }
  interface BuilderCreationParameters {
    newProgram: Program;
    host: BuilderProgramHost;
    oldProgram: BuilderProgram | undefined;
    configFileParsingDiagnostics: ReadonlyArray<Diagnostic>;
  }
  function getBuilderCreationParameters(newProgramOrRootNames: Program | ReadonlyArray<string> | undefined, hostOrOptions: BuilderProgramHost | CompilerOptions | undefined, oldProgramOrHost?: BuilderProgram | CompilerHost, configFileParsingDiagnosticsOrOldProgram?: ReadonlyArray<Diagnostic> | BuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>, projectReferences?: ReadonlyArray<ProjectReference>): BuilderCreationParameters;
  function createBuilderProgram(kind: BuilderProgramKind.SemanticDiagnosticsBuilderProgram, builderCreationParameters: BuilderCreationParameters): SemanticDiagnosticsBuilderProgram;
  function createBuilderProgram(kind: BuilderProgramKind.EmitAndSemanticDiagnosticsBuilderProgram, builderCreationParameters: BuilderCreationParameters): EmitAndSemanticDiagnosticsBuilderProgram;
  function createBuildProgramUsingProgramBuildInfo(program: ProgramBuildInfo, buildInfoPath: string, host: ReadBuildProgramHost): EmitAndSemanticDiagnosticsBuilderProgram;
  function createRedirectedBuilderProgram(state: {
    program: Program | undefined;
    compilerOptions: CompilerOptions;
  }, configFileParsingDiagnostics: ReadonlyArray<Diagnostic>): BuilderProgram;
}
declare namespace ts {
  type AffectedFileResult<T> = {
    result: T;
    affected: SourceFile | Program;
  } | undefined;
  interface BuilderProgramHost {
    /**
     * return true if file names are treated with case sensitivity
     */
    useCaseSensitiveFileNames(): boolean;
    /**
     * If provided this would be used this hash instead of actual file shape text for detecting changes
     */
    createHash?: (data: string) => string;
    /**
     * When emit or emitNextAffectedFile are called without writeFile,
     * this callback if present would be used to write files
     */
    writeFile?: WriteFileCallback;
  }
  /**
   * Builder to manage the program state changes
   */
  interface BuilderProgram {
    getState(): ReusableBuilderProgramState;
    backupState(): void;
    restoreState(): void;
    /**
     * Returns current program
     */
    getProgram(): Program;
    /**
     * Returns current program that could be undefined if the program was released
     */
    getProgramOrUndefined(): Program | undefined;
    /**
     * Releases reference to the program, making all the other operations that need program to fail.
     */
    releaseProgram(): void;
    /**
     * Get compiler options of the program
     */
    getCompilerOptions(): CompilerOptions;
    /**
     * Get the source file in the program with file name
     */
    getSourceFile(fileName: string): SourceFile | undefined;
    /**
     * Get a list of files in the program
     */
    getSourceFiles(): ReadonlyArray<SourceFile>;
    /**
     * Get the diagnostics for compiler options
     */
    getOptionsDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    /**
     * Get the diagnostics that dont belong to any file
     */
    getGlobalDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    /**
     * Get the diagnostics from config file parsing
     */
    getConfigFileParsingDiagnostics(): ReadonlyArray<Diagnostic>;
    /**
     * Get the syntax diagnostics, for all source files if source file is not supplied
     */
    getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    /**
     * Get the declaration diagnostics, for all source files if source file is not supplied
     */
    getDeclarationDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<DiagnosticWithLocation>;
    /**
     * Get all the dependencies of the file
     */
    getAllDependencies(sourceFile: SourceFile): ReadonlyArray<string>;
    /**
     * Gets the semantic diagnostics from the program corresponding to this state of file (if provided) or whole program
     * The semantic diagnostics are cached and managed here
     * Note that it is assumed that when asked about semantic diagnostics through this API,
     * the file has been taken out of affected files so it is safe to use cache or get from program and cache the diagnostics
     * In case of SemanticDiagnosticsBuilderProgram if the source file is not provided,
     * it will iterate through all the affected files, to ensure that cache stays valid and yet provide a way to get all semantic diagnostics
     */
    getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    /**
     * Emits the JavaScript and declaration files.
     * When targetSource file is specified, emits the files corresponding to that source file,
     * otherwise for the whole program.
     * In case of EmitAndSemanticDiagnosticsBuilderProgram, when targetSourceFile is specified,
     * it is assumed that that file is handled from affected file list. If targetSourceFile is not specified,
     * it will only emit all the affected files instead of whole program
     *
     * The first of writeFile if provided, writeFile of BuilderProgramHost if provided, writeFile of compiler host
     * in that order would be used to write the files
     */
    emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
    /**
     * Get the current directory of the program
     */
    getCurrentDirectory(): string;
  }
  /**
   * The builder that caches the semantic diagnostics for the program and handles the changed files and affected files
   */
  interface SemanticDiagnosticsBuilderProgram extends BuilderProgram {
    /**
     * Gets the semantic diagnostics from the program for the next affected file and caches it
     * Returns undefined if the iteration is complete
     */
    getSemanticDiagnosticsOfNextAffectedFile(cancellationToken?: CancellationToken, ignoreSourceFile?: (sourceFile: SourceFile) => boolean): AffectedFileResult<ReadonlyArray<Diagnostic>>;
  }
  /**
   * The builder that can handle the changes in program and iterate through changed file to emit the files
   * The semantic diagnostics are cached per file and managed by clearing for the changed/affected files
   */
  interface EmitAndSemanticDiagnosticsBuilderProgram extends SemanticDiagnosticsBuilderProgram {
    /**
     * Emits the next affected file's emit result (EmitResult and sourceFiles emitted) or returns undefined if iteration is complete
     * The first of writeFile if provided, writeFile of BuilderProgramHost if provided, writeFile of compiler host
     * in that order would be used to write the files
     */
    emitNextAffectedFile(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): AffectedFileResult<EmitResult>;
  }
  /**
   * Create the builder to manage semantic diagnostics and cache them
   */
  function createSemanticDiagnosticsBuilderProgram(newProgram: Program, host: BuilderProgramHost, oldProgram?: SemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>): SemanticDiagnosticsBuilderProgram;
  function createSemanticDiagnosticsBuilderProgram(rootNames: ReadonlyArray<string> | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: SemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>, projectReferences?: ReadonlyArray<ProjectReference>): SemanticDiagnosticsBuilderProgram;
  /**
   * Create the builder that can handle the changes in program and iterate through changed files
   * to emit the those files and manage semantic diagnostics cache as well
   */
  function createEmitAndSemanticDiagnosticsBuilderProgram(newProgram: Program, host: BuilderProgramHost, oldProgram?: EmitAndSemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>): EmitAndSemanticDiagnosticsBuilderProgram;
  function createEmitAndSemanticDiagnosticsBuilderProgram(rootNames: ReadonlyArray<string> | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: EmitAndSemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>, projectReferences?: ReadonlyArray<ProjectReference>): EmitAndSemanticDiagnosticsBuilderProgram;
  /**
   * Creates a builder thats just abstraction over program and can be used with watch
   */
  function createAbstractBuilder(newProgram: Program, host: BuilderProgramHost, oldProgram?: BuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>): BuilderProgram;
  function createAbstractBuilder(rootNames: ReadonlyArray<string> | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: BuilderProgram, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>, projectReferences?: ReadonlyArray<ProjectReference>): BuilderProgram;
}
declare namespace ts {
  /** This is the cache of module/typedirectives resolution that can be retained across program */
  export interface ResolutionCache {
    startRecordingFilesWithChangedResolutions(): void;
    finishRecordingFilesWithChangedResolutions(): Path[] | undefined;
    resolveModuleNames(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference?: ResolvedProjectReference): (ResolvedModuleFull | undefined)[];
    getResolvedModuleWithFailedLookupLocationsFromCache(moduleName: string, containingFile: string): CachedResolvedModuleWithFailedLookupLocations | undefined;
    resolveTypeReferenceDirectives(typeDirectiveNames: string[], containingFile: string, redirectedReference?: ResolvedProjectReference): (ResolvedTypeReferenceDirective | undefined)[];
    invalidateResolutionOfFile(filePath: Path): void;
    removeResolutionsOfFile(filePath: Path): void;
    removeResolutionsFromProjectReferenceRedirects(filePath: Path): void;
    setFilesWithInvalidatedNonRelativeUnresolvedImports(filesWithUnresolvedImports: Map<ReadonlyArray<string>>): void;
    createHasInvalidatedResolution(forceAllFilesAsInvalidated?: boolean): HasInvalidatedResolution;
    startCachingPerDirectoryResolution(): void;
    finishCachingPerDirectoryResolution(): void;
    updateTypeRootsWatch(): void;
    closeTypeRootsWatch(): void;
    clear(): void;
  }
  interface ResolutionWithFailedLookupLocations {
    readonly failedLookupLocations: ReadonlyArray<string>;
    isInvalidated?: boolean;
    refCount?: number;
  }
  interface CachedResolvedModuleWithFailedLookupLocations extends ResolvedModuleWithFailedLookupLocations, ResolutionWithFailedLookupLocations {
  }
  export interface ResolutionCacheHost extends ModuleResolutionHost {
    toPath(fileName: string): Path;
    getCanonicalFileName: GetCanonicalFileName;
    getCompilationSettings(): CompilerOptions;
    watchDirectoryOfFailedLookupLocation(directory: string, cb: DirectoryWatcherCallback, flags: WatchDirectoryFlags): FileWatcher;
    onInvalidatedResolution(): void;
    watchTypeRootsDirectory(directory: string, cb: DirectoryWatcherCallback, flags: WatchDirectoryFlags): FileWatcher;
    onChangedAutomaticTypeDirectiveNames(): void;
    getCachedDirectoryStructureHost(): CachedDirectoryStructureHost | undefined;
    projectName?: string;
    getGlobalCache?(): string | undefined;
    globalCacheResolutionModuleName?(externalModuleName: string): string;
    writeLog(s: string): void;
    maxNumberOfFilesToIterateForInvalidation?: number;
    getCurrentProgram(): Program | undefined;
    fileIsOpen(filePath: Path): boolean;
  }
  export function isPathIgnored(path: Path): boolean;
  /**
   * Filter out paths like
   * "/", "/user", "/user/username", "/user/username/folderAtRoot",
   * "c:/", "c:/users", "c:/users/username", "c:/users/username/folderAtRoot", "c:/folderAtRoot"
   * @param dirPath
   */
  export function canWatchDirectory(dirPath: Path): boolean;
  export const maxNumberOfFilesToIterateForInvalidation = 256;
  export function createResolutionCache(resolutionHost: ResolutionCacheHost, rootDirForResolution: string | undefined, logChangesWhenResolvingModule: boolean): ResolutionCache;
  export {};
}
declare namespace ts.moduleSpecifiers {
  function updateModuleSpecifier(compilerOptions: CompilerOptions, importingSourceFileName: Path, toFileName: string, host: ModuleSpecifierResolutionHost, files: ReadonlyArray<SourceFile>, redirectTargetsMap: RedirectTargetsMap, oldImportSpecifier: string): string | undefined;
  function getModuleSpecifier(compilerOptions: CompilerOptions, importingSourceFile: SourceFile, importingSourceFileName: Path, toFileName: string, host: ModuleSpecifierResolutionHost, files: ReadonlyArray<SourceFile>, preferences: UserPreferences | undefined, redirectTargetsMap: RedirectTargetsMap): string;
  function getModuleSpecifiers(moduleSymbol: Symbol, compilerOptions: CompilerOptions, importingSourceFile: SourceFile, host: ModuleSpecifierResolutionHost, files: ReadonlyArray<SourceFile>, userPreferences: UserPreferences, redirectTargetsMap: RedirectTargetsMap): ReadonlyArray<string>;
  function countPathComponents(path: string): number;
}
declare namespace ts {
  /**
   * Create a function that reports error by writing to the system and handles the formating of the diagnostic
   */
  export function createDiagnosticReporter(system: System, pretty?: boolean): DiagnosticReporter;
  export const screenStartingMessageCodes: number[];
  /**
   * Create a function that reports watch status by writing to the system and handles the formating of the diagnostic
   */
  export function createWatchStatusReporter(system: System, pretty?: boolean): WatchStatusReporter;
  /** Parses config file using System interface */
  export function parseConfigFileWithSystem(configFileName: string, optionsToExtend: CompilerOptions, system: System, reportDiagnostic: DiagnosticReporter): ParsedCommandLine | undefined;
  export function getErrorCountForSummary(diagnostics: ReadonlyArray<Diagnostic>): number;
  export function getWatchErrorSummaryDiagnosticMessage(errorCount: number): DiagnosticMessage;
  export function getErrorSummaryText(errorCount: number, newLine: string): string;
  /**
   * Program structure needed to emit the files and report diagnostics
   */
  export interface ProgramToEmitFilesAndReportErrors {
    getCurrentDirectory(): string;
    getCompilerOptions(): CompilerOptions;
    getSourceFiles(): ReadonlyArray<SourceFile>;
    getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getOptionsDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getGlobalDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getConfigFileParsingDiagnostics(): ReadonlyArray<Diagnostic>;
    emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
  }
  export function listFiles(program: ProgramToEmitFilesAndReportErrors, writeFileName: (s: string) => void): void;
  /**
   * Helper that emit files, report diagnostics and lists emitted and/or source files depending on compiler options
   */
  export function emitFilesAndReportErrors(program: ProgramToEmitFilesAndReportErrors, reportDiagnostic: DiagnosticReporter, writeFileName?: (s: string) => void, reportSummary?: ReportEmitErrorSummary, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): {
    emitResult: EmitResult;
    diagnostics: Diagnostic[];
  };
  export function emitFilesAndReportErrorsAndGetExitStatus(program: ProgramToEmitFilesAndReportErrors, reportDiagnostic: DiagnosticReporter, writeFileName?: (s: string) => void, reportSummary?: ReportEmitErrorSummary, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): ExitStatus.Success | ExitStatus.DiagnosticsPresent_OutputsSkipped | ExitStatus.DiagnosticsPresent_OutputsGenerated;
  export const noopFileWatcher: FileWatcher;
  export function createWatchHost(system?: System, reportWatchStatus?: WatchStatusReporter): WatchHost;
  export enum WatchType {
    ConfigFile = "Config file",
    SourceFile = "Source file",
    MissingFile = "Missing file",
    WildcardDirectory = "Wild card directory",
    FailedLookupLocations = "Failed Lookup Locations",
    TypeRoots = "Type roots"
  }
  interface WatchFactory<X, Y = undefined> extends ts.WatchFactory<X, Y> {
    writeLog: (s: string) => void;
  }
  export function createWatchFactory<Y = undefined>(host: {
    trace?(s: string): void;
  }, options: {
    extendedDiagnostics?: boolean;
    diagnostics?: boolean;
  }): WatchFactory<WatchType, Y>;
  export function createCompilerHostFromProgramHost(host: ProgramHost<any>, getCompilerOptions: () => CompilerOptions, directoryStructureHost?: DirectoryStructureHost): CompilerHost;
  export function setGetSourceFileAsHashVersioned(compilerHost: CompilerHost, host: {
    createHash?(data: string): string;
  }): void;
  /**
   * Creates the watch compiler host that can be extended with config file or root file names and options host
   */
  export function createProgramHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system: System, createProgram: CreateProgram<T> | undefined): ProgramHost<T>;
  /**
   * Creates the watch compiler host from system for config file in watch mode
   */
  export function createWatchCompilerHostOfConfigFile<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(configFileName: string, optionsToExtend: CompilerOptions | undefined, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): WatchCompilerHostOfConfigFile<T>;
  /**
   * Creates the watch compiler host from system for compiling root files and options in watch mode
   */
  export function createWatchCompilerHostOfFilesAndCompilerOptions<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(rootFiles: string[], options: CompilerOptions, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, projectReferences?: ReadonlyArray<ProjectReference>): WatchCompilerHostOfFilesAndCompilerOptions<T>;
  export interface IncrementalCompilationOptions {
    rootNames: ReadonlyArray<string>;
    options: CompilerOptions;
    configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>;
    projectReferences?: ReadonlyArray<ProjectReference>;
    host?: CompilerHost;
    reportDiagnostic?: DiagnosticReporter;
    reportErrorSummary?: ReportEmitErrorSummary;
    afterProgramEmitAndDiagnostics?(program: EmitAndSemanticDiagnosticsBuilderProgram): void;
    system?: System;
  }
  export function performIncrementalCompilation(input: IncrementalCompilationOptions): ExitStatus.Success | ExitStatus.DiagnosticsPresent_OutputsSkipped | ExitStatus.DiagnosticsPresent_OutputsGenerated;
  export {};
}
declare namespace ts {
  interface ReadBuildProgramHost {
    useCaseSensitiveFileNames(): boolean;
    getCurrentDirectory(): string;
    readFile(fileName: string): string | undefined;
  }
  function readBuilderProgram(compilerOptions: CompilerOptions, host: ReadBuildProgramHost): EmitAndSemanticDiagnosticsBuilderProgram | undefined;
  function createIncrementalCompilerHost(options: CompilerOptions, system?: System): CompilerHost;
  interface IncrementalProgramOptions<T extends BuilderProgram> {
    rootNames: ReadonlyArray<string>;
    options: CompilerOptions;
    configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>;
    projectReferences?: ReadonlyArray<ProjectReference>;
    host?: CompilerHost;
    createProgram?: CreateProgram<T>;
  }
  function createIncrementalProgram<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>({ rootNames, options, configFileParsingDiagnostics, projectReferences, host, createProgram }: IncrementalProgramOptions<T>): T;
  type WatchStatusReporter = (diagnostic: Diagnostic, newLine: string, options: CompilerOptions) => void;
  /** Create the program with rootNames and options, if they are undefined, oldProgram and new configFile diagnostics create new program */
  type CreateProgram<T extends BuilderProgram> = (rootNames: ReadonlyArray<string> | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: T, configFileParsingDiagnostics?: ReadonlyArray<Diagnostic>, projectReferences?: ReadonlyArray<ProjectReference> | undefined) => T;
  /** Host that has watch functionality used in --watch mode */
  interface WatchHost {
    /** If provided, called with Diagnostic message that informs about change in watch status */
    onWatchStatusChange?(diagnostic: Diagnostic, newLine: string, options: CompilerOptions): void;
    /** Used to watch changes in source files, missing files needed to update the program or config file */
    watchFile(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
    /** Used to watch resolved module's failed lookup locations, config file specs, type roots where auto type reference directives are added */
    watchDirectory(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
    /** If provided, will be used to set delayed compilation, so that multiple changes in short span are compiled together */
    setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
    /** If provided, will be used to reset existing delayed compilation */
    clearTimeout?(timeoutId: any): void;
  }
  interface ProgramHost<T extends BuilderProgram> {
    /**
     * Used to create the program when need for program creation or recreation detected
     */
    createProgram: CreateProgram<T>;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: CompilerOptions): string;
    getDefaultLibLocation?(): string;
    createHash?(data: string): string;
    /**
     * Use to check file presence for source files and
     * if resolveModuleNames is not provided (complier is in charge of module resolution) then module files as well
     */
    fileExists(path: string): boolean;
    /**
     * Use to read file text for source files and
     * if resolveModuleNames is not provided (complier is in charge of module resolution) then module files as well
     */
    readFile(path: string, encoding?: string): string | undefined;
    /** If provided, used for module resolution as well as to handle directory structure */
    directoryExists?(path: string): boolean;
    /** If provided, used in resolutions as well as handling directory structure */
    getDirectories?(path: string): string[];
    /** If provided, used to cache and handle directory structure modifications */
    readDirectory?(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    /** Symbol links resolution */
    realpath?(path: string): string;
    /** If provided would be used to write log about compilation */
    trace?(s: string): void;
    /** If provided is used to get the environment variable */
    getEnvironmentVariable?(name: string): string | undefined;
    /** If provided, used to resolve the module names, otherwise typescript's default module resolution */
    resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
    /** If provided, used to resolve type reference directives, otherwise typescript's default resolution */
    resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
  }
  /** Internal interface used to wire emit through same host */
  interface ProgramHost<T extends BuilderProgram> {
    createDirectory?(path: string): void;
    writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
    onCachedDirectoryStructureHostCreate?(host: CachedDirectoryStructureHost): void;
  }
  interface WatchCompilerHost<T extends BuilderProgram> extends ProgramHost<T>, WatchHost {
    /** If provided, callback to invoke after every new program creation */
    afterProgramCreate?(program: T): void;
    maxNumberOfFilesToIterateForInvalidation?: number;
  }
  /**
   * Host to create watch with root files and options
   */
  interface WatchCompilerHostOfFilesAndCompilerOptions<T extends BuilderProgram> extends WatchCompilerHost<T> {
    /** root files to use to generate program */
    rootFiles: string[];
    /** Compiler options */
    options: CompilerOptions;
    /** Project References */
    projectReferences?: ReadonlyArray<ProjectReference>;
  }
  /**
   * Host to create watch with config file
   */
  interface WatchCompilerHostOfConfigFile<T extends BuilderProgram> extends WatchCompilerHost<T>, ConfigFileDiagnosticsReporter {
    /** Name of the config file to compile */
    configFileName: string;
    /** Options to extend */
    optionsToExtend?: CompilerOptions;
    /**
     * Used to generate source file names from the config file and its include, exclude, files rules
     * and also to cache the directory stucture
     */
    readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
  }
  /**
   * Host to create watch with config file that is already parsed (from tsc)
   */
  interface WatchCompilerHostOfConfigFile<T extends BuilderProgram> extends WatchCompilerHost<T> {
    optionsToExtend?: CompilerOptions;
    configFileParsingResult?: ParsedCommandLine;
  }
  interface Watch<T> {
    /** Synchronize with host and get updated program */
    getProgram(): T;
    /** Gets the existing program without synchronizing with changes on host */
    getCurrentProgram(): T;
    /** Closes the watch */
    close(): void;
  }
  /**
   * Creates the watch what generates program using the config file
   */
  interface WatchOfConfigFile<T> extends Watch<T> {
  }
  /**
   * Creates the watch that generates program using the root files and compiler options
   */
  interface WatchOfFilesAndCompilerOptions<T> extends Watch<T> {
    /** Updates the root files in the program, only if this is not config file compilation */
    updateRootFileNames(fileNames: string[]): void;
  }
  /**
   * Create the watch compiler host for either configFile or fileNames and its options
   */
  function createWatchCompilerHost<T extends BuilderProgram>(configFileName: string, optionsToExtend: CompilerOptions | undefined, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): WatchCompilerHostOfConfigFile<T>;
  function createWatchCompilerHost<T extends BuilderProgram>(rootFiles: string[], options: CompilerOptions, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, projectReferences?: ReadonlyArray<ProjectReference>): WatchCompilerHostOfFilesAndCompilerOptions<T>;
  /**
   * Creates the watch from the host for root files and compiler options
   */
  function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfFilesAndCompilerOptions<T>): WatchOfFilesAndCompilerOptions<T>;
  /**
   * Creates the watch from the host for config file
   */
  function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfConfigFile<T>): WatchOfConfigFile<T>;
}
declare namespace ts {
  enum UpToDateStatusType {
    Unbuildable = 0,
    UpToDate = 1,
    /**
     * The project appears out of date because its upstream inputs are newer than its outputs,
     * but all of its outputs are actually newer than the previous identical outputs of its (.d.ts) inputs.
     * This means we can Pseudo-build (just touch timestamps), as if we had actually built this project.
     */
    UpToDateWithUpstreamTypes = 2,
    /**
     * The project appears out of date because its upstream inputs are newer than its outputs,
     * but all of its outputs are actually newer than the previous identical outputs of its (.d.ts) inputs.
     * This means we can Pseudo-build (just manipulate outputs), as if we had actually built this project.
     */
    OutOfDateWithPrepend = 3,
    OutputMissing = 4,
    OutOfDateWithSelf = 5,
    OutOfDateWithUpstream = 6,
    UpstreamOutOfDate = 7,
    UpstreamBlocked = 8,
    ComputingUpstream = 9,
    TsVersionOutputOfDate = 10,
    /**
     * Projects with no outputs (i.e. "solution" files)
     */
    ContainerOnly = 11
  }
  type UpToDateStatus = Status.Unbuildable | Status.UpToDate | Status.OutOfDateWithPrepend | Status.OutputMissing | Status.OutOfDateWithSelf | Status.OutOfDateWithUpstream | Status.UpstreamOutOfDate | Status.UpstreamBlocked | Status.ComputingUpstream | Status.TsVersionOutOfDate | Status.ContainerOnly;
  namespace Status {
    /**
     * The project can't be built at all in its current state. For example,
     * its config file cannot be parsed, or it has a syntax error or missing file
     */
    interface Unbuildable {
      type: UpToDateStatusType.Unbuildable;
      reason: string;
    }
    /**
     * This project doesn't have any outputs, so "is it up to date" is a meaningless question.
     */
    interface ContainerOnly {
      type: UpToDateStatusType.ContainerOnly;
    }
    /**
     * The project is up to date with respect to its inputs.
     * We track what the newest input file is.
     */
    interface UpToDate {
      type: UpToDateStatusType.UpToDate | UpToDateStatusType.UpToDateWithUpstreamTypes;
      newestInputFileTime?: Date;
      newestInputFileName?: string;
      newestDeclarationFileContentChangedTime?: Date;
      newestOutputFileTime?: Date;
      newestOutputFileName?: string;
      oldestOutputFileName: string;
    }
    /**
     * The project is up to date with respect to its inputs except for prepend output changed (no declaration file change in prepend).
     */
    interface OutOfDateWithPrepend {
      type: UpToDateStatusType.OutOfDateWithPrepend;
      outOfDateOutputFileName: string;
      newerProjectName: string;
    }
    /**
     * One or more of the outputs of the project does not exist.
     */
    interface OutputMissing {
      type: UpToDateStatusType.OutputMissing;
      /**
       * The name of the first output file that didn't exist
       */
      missingOutputFileName: string;
    }
    /**
     * One or more of the project's outputs is older than its newest input.
     */
    interface OutOfDateWithSelf {
      type: UpToDateStatusType.OutOfDateWithSelf;
      outOfDateOutputFileName: string;
      newerInputFileName: string;
    }
    /**
     * This project depends on an out-of-date project, so shouldn't be built yet
     */
    interface UpstreamOutOfDate {
      type: UpToDateStatusType.UpstreamOutOfDate;
      upstreamProjectName: string;
    }
    /**
     * This project depends an upstream project with build errors
     */
    interface UpstreamBlocked {
      type: UpToDateStatusType.UpstreamBlocked;
      upstreamProjectName: string;
      upstreamProjectBlocked: boolean;
    }
    /**
     *  Computing status of upstream projects referenced
     */
    interface ComputingUpstream {
      type: UpToDateStatusType.ComputingUpstream;
    }
    interface TsVersionOutOfDate {
      type: UpToDateStatusType.TsVersionOutputOfDate;
      version: string;
    }
    /**
     * One or more of the project's outputs is older than the newest output of
     * an upstream project.
     */
    interface OutOfDateWithUpstream {
      type: UpToDateStatusType.OutOfDateWithUpstream;
      outOfDateOutputFileName: string;
      newerProjectName: string;
    }
  }
  function resolveConfigFileProjectName(project: string): ResolvedConfigFileName;
}
declare namespace ts {
  interface BuildOptions {
    dry?: boolean;
    force?: boolean;
    verbose?: boolean;
    clean?: boolean;
    watch?: boolean;
    help?: boolean;
    preserveWatchOutput?: boolean;
    listEmittedFiles?: boolean;
    listFiles?: boolean;
    pretty?: boolean;
    incremental?: boolean;
    traceResolution?: boolean;
    diagnostics?: boolean;
    extendedDiagnostics?: boolean;
    locale?: string;
    [option: string]: CompilerOptionsValue | undefined;
  }
  type ResolvedConfigFilePath = ResolvedConfigFileName & Path;
  type ReportEmitErrorSummary = (errorCount: number) => void;
  interface SolutionBuilderHostBase<T extends BuilderProgram> extends ProgramHost<T> {
    createDirectory?(path: string): void;
    /**
     * Should provide create directory and writeFile if done of invalidatedProjects is not invoked with
     * writeFileCallback
     */
    writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
    getModifiedTime(fileName: string): Date | undefined;
    setModifiedTime(fileName: string, date: Date): void;
    deleteFile(fileName: string): void;
    getParsedCommandLine?(fileName: string): ParsedCommandLine | undefined;
    reportDiagnostic: DiagnosticReporter;
    reportSolutionBuilderStatus: DiagnosticReporter;
    afterProgramEmitAndDiagnostics?(program: T): void;
    now?(): Date;
  }
  interface SolutionBuilderHost<T extends BuilderProgram> extends SolutionBuilderHostBase<T> {
    reportErrorSummary?: ReportEmitErrorSummary;
  }
  interface SolutionBuilderWithWatchHost<T extends BuilderProgram> extends SolutionBuilderHostBase<T>, WatchHost {
  }
  type BuildOrder = readonly ResolvedConfigFileName[];
  interface CircularBuildOrder {
    buildOrder: BuildOrder;
    circularDiagnostics: readonly Diagnostic[];
  }
  type AnyBuildOrder = BuildOrder | CircularBuildOrder;
  function isCircularBuildOrder(buildOrder: AnyBuildOrder): buildOrder is CircularBuildOrder;
  function getBuildOrderFromAnyBuildOrder(anyBuildOrder: AnyBuildOrder): BuildOrder;
  interface SolutionBuilder<T extends BuilderProgram> {
    build(project?: string, cancellationToken?: CancellationToken): ExitStatus;
    clean(project?: string): ExitStatus;
    buildReferences(project: string, cancellationToken?: CancellationToken): ExitStatus;
    cleanReferences(project?: string): ExitStatus;
    getNextInvalidatedProject(cancellationToken?: CancellationToken): InvalidatedProject<T> | undefined;
    getBuildOrder(): AnyBuildOrder;
    getUpToDateStatusOfProject(project: string): UpToDateStatus;
    invalidateProject(configFilePath: ResolvedConfigFilePath, reloadLevel?: ConfigFileProgramReloadLevel): void;
    buildNextInvalidatedProject(): void;
  }
  /**
   * Create a function that reports watch status by writing to the system and handles the formating of the diagnostic
   */
  function createBuilderStatusReporter(system: System, pretty?: boolean): DiagnosticReporter;
  function createSolutionBuilderHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system?: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportSolutionBuilderStatus?: DiagnosticReporter, reportErrorSummary?: ReportEmitErrorSummary): SolutionBuilderHost<T>;
  function createSolutionBuilderWithWatchHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system?: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportSolutionBuilderStatus?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): SolutionBuilderWithWatchHost<T>;
  function createSolutionBuilder<T extends BuilderProgram>(host: SolutionBuilderHost<T>, rootNames: ReadonlyArray<string>, defaultOptions: BuildOptions): SolutionBuilder<T>;
  function createSolutionBuilderWithWatch<T extends BuilderProgram>(host: SolutionBuilderWithWatchHost<T>, rootNames: ReadonlyArray<string>, defaultOptions: BuildOptions): SolutionBuilder<T>;
  enum InvalidatedProjectKind {
    Build = 0,
    UpdateBundle = 1,
    UpdateOutputFileStamps = 2
  }
  interface InvalidatedProjectBase {
    readonly kind: InvalidatedProjectKind;
    readonly project: ResolvedConfigFileName;
    readonly projectPath: ResolvedConfigFilePath;
    readonly buildOrder: readonly ResolvedConfigFileName[];
    /**
     *  To dispose this project and ensure that all the necessary actions are taken and state is updated accordingly
     */
    done(cancellationToken?: CancellationToken, writeFile?: WriteFileCallback, customTransformers?: CustomTransformers): ExitStatus;
    getCompilerOptions(): CompilerOptions;
    getCurrentDirectory(): string;
  }
  interface UpdateOutputFileStampsProject extends InvalidatedProjectBase {
    readonly kind: InvalidatedProjectKind.UpdateOutputFileStamps;
    updateOutputFileStatmps(): void;
  }
  interface BuildInvalidedProject<T extends BuilderProgram> extends InvalidatedProjectBase {
    readonly kind: InvalidatedProjectKind.Build;
    getBuilderProgram(): T | undefined;
    getProgram(): Program | undefined;
    getSourceFile(fileName: string): SourceFile | undefined;
    getSourceFiles(): ReadonlyArray<SourceFile>;
    getOptionsDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getGlobalDiagnostics(cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getConfigFileParsingDiagnostics(): ReadonlyArray<Diagnostic>;
    getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getAllDependencies(sourceFile: SourceFile): ReadonlyArray<string>;
    getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): ReadonlyArray<Diagnostic>;
    getSemanticDiagnosticsOfNextAffectedFile(cancellationToken?: CancellationToken, ignoreSourceFile?: (sourceFile: SourceFile) => boolean): AffectedFileResult<ReadonlyArray<Diagnostic>>;
    emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult | undefined;
  }
  interface UpdateBundleProject<T extends BuilderProgram> extends InvalidatedProjectBase {
    readonly kind: InvalidatedProjectKind.UpdateBundle;
    emit(writeFile?: WriteFileCallback, customTransformers?: CustomTransformers): EmitResult | BuildInvalidedProject<T> | undefined;
  }
  type InvalidatedProject<T extends BuilderProgram> = UpdateOutputFileStampsProject | BuildInvalidedProject<T> | UpdateBundleProject<T>;
}
declare namespace ts.server {
  const ActionSet: ActionSet;
  const ActionInvalidate: ActionInvalidate;
  const ActionPackageInstalled: ActionPackageInstalled;
  const EventTypesRegistry: EventTypesRegistry;
  const EventBeginInstallTypes: EventBeginInstallTypes;
  const EventEndInstallTypes: EventEndInstallTypes;
  const EventInitializationFailed: EventInitializationFailed;
  namespace Arguments {
    const GlobalCacheLocation = "--globalTypingsCacheLocation";
    const LogFile = "--logFile";
    const EnableTelemetry = "--enableTelemetry";
    const TypingSafeListLocation = "--typingSafeListLocation";
    const TypesMapLocation = "--typesMapLocation";
    /**
     * This argument specifies the location of the NPM executable.
     * typingsInstaller will run the command with `${npmLocation} install ...`.
     */
    const NpmLocation = "--npmLocation";
    /**
     * Flag indicating that the typings installer should try to validate the default npm location.
     * If the default npm is not found when this flag is enabled, fallback to `npm install`
     */
    const ValidateDefaultNpmLocation = "--validateDefaultNpmLocation";
  }
  function hasArgument(argumentName: string): boolean;
  function findArgument(argumentName: string): string | undefined;
  function nowString(): string;
}
declare namespace ts.server {
  type ActionSet = "action::set";
  type ActionInvalidate = "action::invalidate";
  type ActionPackageInstalled = "action::packageInstalled";
  type EventTypesRegistry = "event::typesRegistry";
  type EventBeginInstallTypes = "event::beginInstallTypes";
  type EventEndInstallTypes = "event::endInstallTypes";
  type EventInitializationFailed = "event::initializationFailed";
  interface TypingInstallerResponse {
    readonly kind: ActionSet | ActionInvalidate | EventTypesRegistry | ActionPackageInstalled | EventBeginInstallTypes | EventEndInstallTypes | EventInitializationFailed;
  }
  interface TypingInstallerRequestWithProjectName {
    readonly projectName: string;
  }
  type TypingInstallerRequestUnion = DiscoverTypings | CloseProject | TypesRegistryRequest | InstallPackageRequest;
  interface DiscoverTypings extends TypingInstallerRequestWithProjectName {
    readonly fileNames: string[];
    readonly projectRootPath: Path;
    readonly compilerOptions: CompilerOptions;
    readonly typeAcquisition: TypeAcquisition;
    readonly unresolvedImports: SortedReadonlyArray<string>;
    readonly cachePath?: string;
    readonly kind: "discover";
  }
  interface CloseProject extends TypingInstallerRequestWithProjectName {
    readonly kind: "closeProject";
  }
  interface TypesRegistryRequest {
    readonly kind: "typesRegistry";
  }
  interface InstallPackageRequest extends TypingInstallerRequestWithProjectName {
    readonly kind: "installPackage";
    readonly fileName: Path;
    readonly packageName: string;
    readonly projectRootPath: Path;
  }
  interface TypesRegistryResponse extends TypingInstallerResponse {
    readonly kind: EventTypesRegistry;
    readonly typesRegistry: MapLike<MapLike<string>>;
  }
  interface PackageInstalledResponse extends ProjectResponse {
    readonly kind: ActionPackageInstalled;
    readonly success: boolean;
    readonly message: string;
  }
  interface InitializationFailedResponse extends TypingInstallerResponse {
    readonly kind: EventInitializationFailed;
    readonly message: string;
  }
  interface ProjectResponse extends TypingInstallerResponse {
    readonly projectName: string;
  }
  interface InvalidateCachedTypings extends ProjectResponse {
    readonly kind: ActionInvalidate;
  }
  interface InstallTypes extends ProjectResponse {
    readonly kind: EventBeginInstallTypes | EventEndInstallTypes;
    readonly eventId: number;
    readonly typingsInstallerVersion: string;
    readonly packagesToInstall: ReadonlyArray<string>;
  }
  interface BeginInstallTypes extends InstallTypes {
    readonly kind: EventBeginInstallTypes;
  }
  interface EndInstallTypes extends InstallTypes {
    readonly kind: EventEndInstallTypes;
    readonly installSuccess: boolean;
  }
  interface InstallTypingHost extends JsTyping.TypingResolutionHost {
    useCaseSensitiveFileNames: boolean;
    writeFile(path: string, content: string): void;
    createDirectory(path: string): void;
    watchFile?(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
    watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
  }
  interface SetTypings extends ProjectResponse {
    readonly typeAcquisition: TypeAcquisition;
    readonly compilerOptions: CompilerOptions;
    readonly typings: string[];
    readonly unresolvedImports: SortedReadonlyArray<string>;
    readonly kind: ActionSet;
  }
  type TypingInstallerResponseUnion = SetTypings | InvalidateCachedTypings | TypesRegistryResponse | PackageInstalledResponse | InstallTypes | InitializationFailedResponse;
}
declare namespace ts.JsTyping {
  interface TypingResolutionHost {
    directoryExists(path: string): boolean;
    fileExists(fileName: string): boolean;
    readFile(path: string, encoding?: string): string | undefined;
    readDirectory(rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string> | undefined, depth?: number): string[];
  }
  interface CachedTyping {
    typingLocation: string;
    version: Version;
  }
  function isTypingUpToDate(cachedTyping: CachedTyping, availableTypingVersions: MapLike<string>): boolean;
  const nodeCoreModuleList: ReadonlyArray<string>;
  const nodeCoreModules: Map<true>;
  function nonRelativeModuleNameForTypingCache(moduleName: string): string;
  /**
   * A map of loose file names to library names that we are confident require typings
   */
  type SafeList = ReadonlyMap<string>;
  function loadSafeList(host: TypingResolutionHost, safeListPath: Path): SafeList;
  function loadTypesMap(host: TypingResolutionHost, typesMapPath: Path): SafeList | undefined;
  /**
   * @param host is the object providing I/O related operations.
   * @param fileNames are the file names that belong to the same project
   * @param projectRootPath is the path to the project root directory
   * @param safeListPath is the path used to retrieve the safe list
   * @param packageNameToTypingLocation is the map of package names to their cached typing locations and installed versions
   * @param typeAcquisition is used to customize the typing acquisition process
   * @param compilerOptions are used as a source for typing inference
   */
  function discoverTypings(host: TypingResolutionHost, log: ((message: string) => void) | undefined, fileNames: string[], projectRootPath: Path, safeList: SafeList, packageNameToTypingLocation: ReadonlyMap<CachedTyping>, typeAcquisition: TypeAcquisition, unresolvedImports: ReadonlyArray<string>, typesRegistry: ReadonlyMap<MapLike<string>>): {
    cachedTypingPaths: string[];
    newTypingNames: string[];
    filesToWatch: string[];
  };
  enum NameValidationResult {
    Ok = 0,
    EmptyName = 1,
    NameTooLong = 2,
    NameStartsWithDot = 3,
    NameStartsWithUnderscore = 4,
    NameContainsNonURISafeCharacters = 5
  }
  interface ScopedPackageNameValidationResult {
    name: string;
    isScopeName: boolean;
    result: NameValidationResult;
  }
  type PackageNameValidationResult = NameValidationResult | ScopedPackageNameValidationResult;
  /**
   * Validates package name using rules defined at https://docs.npmjs.com/files/package.json
   */
  function validatePackageName(packageName: string): PackageNameValidationResult;
  function renderPackageNameValidationFailure(result: PackageNameValidationResult, typing: string): string;
}
declare namespace ts {
  interface Node {
    getSourceFile(): SourceFile;
    getChildCount(sourceFile?: SourceFile): number;
    getChildAt(index: number, sourceFile?: SourceFile): Node;
    getChildren(sourceFile?: SourceFile): Node[];
    getChildren(sourceFile?: SourceFileLike): Node[];
    getStart(sourceFile?: SourceFile, includeJsDocComment?: boolean): number;
    getStart(sourceFile?: SourceFileLike, includeJsDocComment?: boolean): number;
    getFullStart(): number;
    getEnd(): number;
    getWidth(sourceFile?: SourceFileLike): number;
    getFullWidth(): number;
    getLeadingTriviaWidth(sourceFile?: SourceFile): number;
    getFullText(sourceFile?: SourceFile): string;
    getText(sourceFile?: SourceFile): string;
    getFirstToken(sourceFile?: SourceFile): Node | undefined;
    getLastToken(sourceFile?: SourceFile): Node | undefined;
    forEachChild<T>(cbNode: (node: Node) => T | undefined, cbNodeArray?: (nodes: NodeArray<Node>) => T | undefined): T | undefined;
  }
  interface Identifier {
    readonly text: string;
  }
  interface Symbol {
    readonly name: string;
    getFlags(): SymbolFlags;
    getEscapedName(): __String;
    getName(): string;
    getDeclarations(): Declaration[] | undefined;
    getDocumentationComment(typeChecker: TypeChecker | undefined): SymbolDisplayPart[];
    getJsDocTags(): JSDocTagInfo[];
  }
  interface Type {
    getFlags(): TypeFlags;
    getSymbol(): Symbol | undefined;
    getProperties(): Symbol[];
    getProperty(propertyName: string): Symbol | undefined;
    getApparentProperties(): Symbol[];
    getCallSignatures(): ReadonlyArray<Signature>;
    getConstructSignatures(): ReadonlyArray<Signature>;
    getStringIndexType(): Type | undefined;
    getNumberIndexType(): Type | undefined;
    getBaseTypes(): BaseType[] | undefined;
    getNonNullableType(): Type;
    getConstraint(): Type | undefined;
    getDefault(): Type | undefined;
    isUnion(): this is UnionType;
    isIntersection(): this is IntersectionType;
    isUnionOrIntersection(): this is UnionOrIntersectionType;
    isLiteral(): this is LiteralType;
    isStringLiteral(): this is StringLiteralType;
    isNumberLiteral(): this is NumberLiteralType;
    isTypeParameter(): this is TypeParameter;
    isClassOrInterface(): this is InterfaceType;
    isClass(): this is InterfaceType;
  }
  interface Signature {
    getDeclaration(): SignatureDeclaration;
    getTypeParameters(): TypeParameter[] | undefined;
    getParameters(): Symbol[];
    getReturnType(): Type;
    getDocumentationComment(typeChecker: TypeChecker | undefined): SymbolDisplayPart[];
    getJsDocTags(): JSDocTagInfo[];
  }
  interface SourceFile {
    version: string;
    scriptSnapshot: IScriptSnapshot | undefined;
    nameTable: UnderscoreEscapedMap<number> | undefined;
    getNamedDeclarations(): Map<ReadonlyArray<Declaration>>;
    getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
    getLineEndOfPosition(pos: number): number;
    getLineStarts(): ReadonlyArray<number>;
    getPositionOfLineAndCharacter(line: number, character: number): number;
    update(newText: string, textChangeRange: TextChangeRange): SourceFile;
    sourceMapper?: DocumentPositionMapper;
  }
  interface SourceFileLike {
    getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
  }
  interface SourceMapSource {
    getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
  }
  /**
   * Represents an immutable snapshot of a script at a specified time.Once acquired, the
   * snapshot is observably immutable. i.e. the same calls with the same parameters will return
   * the same values.
   */
  interface IScriptSnapshot {
    /** Gets a portion of the script snapshot specified by [start, end). */
    getText(start: number, end: number): string;
    /** Gets the length of this script snapshot. */
    getLength(): number;
    /**
     * Gets the TextChangeRange that describe how the text changed between this text and
     * an older version.  This information is used by the incremental parser to determine
     * what sections of the script need to be re-parsed.  'undefined' can be returned if the
     * change range cannot be determined.  However, in that case, incremental parsing will
     * not happen and the entire document will be re - parsed.
     */
    getChangeRange(oldSnapshot: IScriptSnapshot): TextChangeRange | undefined;
    /** Releases all resources held by this script snapshot */
    dispose?(): void;
  }
  namespace ScriptSnapshot {
    function fromString(text: string): IScriptSnapshot;
  }
  interface PreProcessedFileInfo {
    referencedFiles: FileReference[];
    typeReferenceDirectives: FileReference[];
    libReferenceDirectives: FileReference[];
    importedFiles: FileReference[];
    ambientExternalModules?: string[];
    isLibFile: boolean;
  }
  interface HostCancellationToken {
    isCancellationRequested(): boolean;
  }
  interface InstallPackageOptions {
    fileName: Path;
    packageName: string;
  }
  interface LanguageServiceHost extends GetEffectiveTypeRootsHost {
    getCompilationSettings(): CompilerOptions;
    getNewLine?(): string;
    getProjectVersion?(): string;
    getScriptFileNames(): string[];
    getScriptKind?(fileName: string): ScriptKind;
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;
    getProjectReferences?(): ReadonlyArray<ProjectReference> | undefined;
    getLocalizedDiagnosticMessages?(): any;
    getCancellationToken?(): HostCancellationToken;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: CompilerOptions): string;
    log?(s: string): void;
    trace?(s: string): void;
    error?(s: string): void;
    useCaseSensitiveFileNames?(): boolean;
    readDirectory?(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    readFile?(path: string, encoding?: string): string | undefined;
    realpath?(path: string): string;
    fileExists?(path: string): boolean;
    getTypeRootsVersion?(): number;
    resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
    getResolvedModuleWithFailedLookupLocationsFromCache?(modulename: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
    resolveTypeReferenceDirectives?(typeDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
    hasInvalidatedResolution?: HasInvalidatedResolution;
    hasChangedAutomaticTypeDirectiveNames?: boolean;
    getDirectories?(directoryName: string): string[];
    /**
     * Gets a set of custom transformers to use during emit.
     */
    getCustomTransformers?(): CustomTransformers | undefined;
    isKnownTypesPackageName?(name: string): boolean;
    installPackage?(options: InstallPackageOptions): Promise<ApplyCodeActionCommandResult>;
    writeFile?(fileName: string, content: string): void;
    getDocumentPositionMapper?(generatedFileName: string, sourceFileName?: string): DocumentPositionMapper | undefined;
    getSourceFileLike?(fileName: string): SourceFileLike | undefined;
  }
  const emptyOptions: {};
  type WithMetadata<T> = T & {
    metadata?: unknown;
  };
  interface LanguageService {
    cleanupSemanticCache(): void;
    getSyntacticDiagnostics(fileName: string): DiagnosticWithLocation[];
    /** The first time this is called, it will return global diagnostics (no location). */
    getSemanticDiagnostics(fileName: string): Diagnostic[];
    getSuggestionDiagnostics(fileName: string): DiagnosticWithLocation[];
    getCompilerOptionsDiagnostics(): Diagnostic[];
    /**
     * @deprecated Use getEncodedSyntacticClassifications instead.
     */
    getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
    /**
     * @deprecated Use getEncodedSemanticClassifications instead.
     */
    getSemanticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
    getEncodedSyntacticClassifications(fileName: string, span: TextSpan): Classifications;
    getEncodedSemanticClassifications(fileName: string, span: TextSpan): Classifications;
    getCompletionsAtPosition(fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): WithMetadata<CompletionInfo> | undefined;
    getCompletionEntryDetails(fileName: string, position: number, name: string, formatOptions: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined, preferences: UserPreferences | undefined): CompletionEntryDetails | undefined;
    getCompletionEntrySymbol(fileName: string, position: number, name: string, source: string | undefined): Symbol | undefined;
    getQuickInfoAtPosition(fileName: string, position: number): QuickInfo | undefined;
    getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): TextSpan | undefined;
    getBreakpointStatementAtPosition(fileName: string, position: number): TextSpan | undefined;
    getSignatureHelpItems(fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): SignatureHelpItems | undefined;
    getRenameInfo(fileName: string, position: number, options?: RenameInfoOptions): RenameInfo;
    findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename?: boolean): ReadonlyArray<RenameLocation> | undefined;
    getSmartSelectionRange(fileName: string, position: number): SelectionRange;
    getDefinitionAtPosition(fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined;
    getDefinitionAndBoundSpan(fileName: string, position: number): DefinitionInfoAndBoundSpan | undefined;
    getTypeDefinitionAtPosition(fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined;
    getImplementationAtPosition(fileName: string, position: number): ReadonlyArray<ImplementationLocation> | undefined;
    getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[] | undefined;
    findReferences(fileName: string, position: number): ReferencedSymbol[] | undefined;
    getDocumentHighlights(fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[] | undefined;
    /** @deprecated */
    getOccurrencesAtPosition(fileName: string, position: number): ReadonlyArray<ReferenceEntry> | undefined;
    getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string, excludeDtsFiles?: boolean): NavigateToItem[];
    getNavigationBarItems(fileName: string): NavigationBarItem[];
    getNavigationTree(fileName: string): NavigationTree;
    getOutliningSpans(fileName: string): OutliningSpan[];
    getTodoComments(fileName: string, descriptors: TodoCommentDescriptor[]): TodoComment[];
    getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
    getIndentationAtPosition(fileName: string, position: number, options: EditorOptions | EditorSettings): number;
    getFormattingEditsForRange(fileName: string, start: number, end: number, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
    getFormattingEditsForDocument(fileName: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
    getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
    getDocCommentTemplateAtPosition(fileName: string, position: number): TextInsertion | undefined;
    isValidBraceCompletionAtPosition(fileName: string, position: number, openingBrace: number): boolean;
    /**
     * This will return a defined result if the position is after the `>` of the opening tag, or somewhere in the text, of a JSXElement with no closing tag.
     * Editors should call this after `>` is typed.
     */
    getJsxClosingTagAtPosition(fileName: string, position: number): JsxClosingTagInfo | undefined;
    getSpanOfEnclosingComment(fileName: string, position: number, onlyMultiLine: boolean): TextSpan | undefined;
    toLineColumnOffset?(fileName: string, position: number): LineAndCharacter;
    /** @internal */
    getSourceMapper(): SourceMapper;
    getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: ReadonlyArray<number>, formatOptions: FormatCodeSettings, preferences: UserPreferences): ReadonlyArray<CodeFixAction>;
    getCombinedCodeFix(scope: CombinedCodeFixScope, fixId: {}, formatOptions: FormatCodeSettings, preferences: UserPreferences): CombinedCodeActions;
    applyCodeActionCommand(action: CodeActionCommand, formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult>;
    applyCodeActionCommand(action: CodeActionCommand[], formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult[]>;
    applyCodeActionCommand(action: CodeActionCommand | CodeActionCommand[], formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
    /** @deprecated `fileName` will be ignored */
    applyCodeActionCommand(fileName: string, action: CodeActionCommand): Promise<ApplyCodeActionCommandResult>;
    /** @deprecated `fileName` will be ignored */
    applyCodeActionCommand(fileName: string, action: CodeActionCommand[]): Promise<ApplyCodeActionCommandResult[]>;
    /** @deprecated `fileName` will be ignored */
    applyCodeActionCommand(fileName: string, action: CodeActionCommand | CodeActionCommand[]): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
    getApplicableRefactors(fileName: string, positionOrRange: number | TextRange, preferences: UserPreferences | undefined): ApplicableRefactorInfo[];
    getEditsForRefactor(fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string, preferences: UserPreferences | undefined): RefactorEditInfo | undefined;
    organizeImports(scope: OrganizeImportsScope, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges>;
    getEditsForFileRename(oldFilePath: string, newFilePath: string, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges>;
    getEmitOutput(fileName: string, emitOnlyDtsFiles?: boolean): EmitOutput;
    getProgram(): Program | undefined;
    getNonBoundSourceFile(fileName: string): SourceFile;
    dispose(): void;
  }
  interface JsxClosingTagInfo {
    readonly newText: string;
  }
  interface CombinedCodeFixScope {
    type: "file";
    fileName: string;
  }
  type OrganizeImportsScope = CombinedCodeFixScope;
  type CompletionsTriggerCharacter = "." | '"' | "'" | "`" | "/" | "@" | "<";
  interface GetCompletionsAtPositionOptions extends UserPreferences {
    /**
     * If the editor is asking for completions because a certain character was typed
     * (as opposed to when the user explicitly requested them) this should be set.
     */
    triggerCharacter?: CompletionsTriggerCharacter;
    /** @deprecated Use includeCompletionsForModuleExports */
    includeExternalModuleExports?: boolean;
    /** @deprecated Use includeCompletionsWithInsertText */
    includeInsertTextCompletions?: boolean;
  }
  type SignatureHelpTriggerCharacter = "," | "(" | "<";
  type SignatureHelpRetriggerCharacter = SignatureHelpTriggerCharacter | ")";
  interface SignatureHelpItemsOptions {
    triggerReason?: SignatureHelpTriggerReason;
  }
  type SignatureHelpTriggerReason = SignatureHelpInvokedReason | SignatureHelpCharacterTypedReason | SignatureHelpRetriggeredReason;
  /**
   * Signals that the user manually requested signature help.
   * The language service will unconditionally attempt to provide a result.
   */
  interface SignatureHelpInvokedReason {
    kind: "invoked";
    triggerCharacter?: undefined;
  }
  /**
   * Signals that the signature help request came from a user typing a character.
   * Depending on the character and the syntactic context, the request may or may not be served a result.
   */
  interface SignatureHelpCharacterTypedReason {
    kind: "characterTyped";
    /**
     * Character that was responsible for triggering signature help.
     */
    triggerCharacter: SignatureHelpTriggerCharacter;
  }
  /**
   * Signals that this signature help request came from typing a character or moving the cursor.
   * This should only occur if a signature help session was already active and the editor needs to see if it should adjust.
   * The language service will unconditionally attempt to provide a result.
   * `triggerCharacter` can be `undefined` for a retrigger caused by a cursor move.
   */
  interface SignatureHelpRetriggeredReason {
    kind: "retrigger";
    /**
     * Character that was responsible for triggering signature help.
     */
    triggerCharacter?: SignatureHelpRetriggerCharacter;
  }
  interface ApplyCodeActionCommandResult {
    successMessage: string;
  }
  interface Classifications {
    spans: number[];
    endOfLineState: EndOfLineState;
  }
  interface ClassifiedSpan {
    textSpan: TextSpan;
    classificationType: ClassificationTypeNames;
  }
  /**
   * Navigation bar interface designed for visual studio's dual-column layout.
   * This does not form a proper tree.
   * The navbar is returned as a list of top-level items, each of which has a list of child items.
   * Child items always have an empty array for their `childItems`.
   */
  interface NavigationBarItem {
    text: string;
    kind: ScriptElementKind;
    kindModifiers: string;
    spans: TextSpan[];
    childItems: NavigationBarItem[];
    indent: number;
    bolded: boolean;
    grayed: boolean;
  }
  /**
   * Node in a tree of nested declarations in a file.
   * The top node is always a script or module node.
   */
  interface NavigationTree {
    /** Name of the declaration, or a short description, e.g. "<class>". */
    text: string;
    kind: ScriptElementKind;
    /** ScriptElementKindModifier separated by commas, e.g. "public,abstract" */
    kindModifiers: string;
    /**
     * Spans of the nodes that generated this declaration.
     * There will be more than one if this is the result of merging.
     */
    spans: TextSpan[];
    nameSpan: TextSpan | undefined;
    /** Present if non-empty */
    childItems?: NavigationTree[];
  }
  interface TodoCommentDescriptor {
    text: string;
    priority: number;
  }
  interface TodoComment {
    descriptor: TodoCommentDescriptor;
    message: string;
    position: number;
  }
  interface TextChange {
    span: TextSpan;
    newText: string;
  }
  interface FileTextChanges {
    fileName: string;
    textChanges: TextChange[];
    isNewFile?: boolean;
  }
  interface CodeAction {
    /** Description of the code action to display in the UI of the editor */
    description: string;
    /** Text changes to apply to each file as part of the code action */
    changes: FileTextChanges[];
    /**
     * If the user accepts the code fix, the editor should send the action back in a `applyAction` request.
     * This allows the language service to have side effects (e.g. installing dependencies) upon a code fix.
     */
    commands?: CodeActionCommand[];
  }
  interface CodeFixAction extends CodeAction {
    /** Short name to identify the fix, for use by telemetry. */
    fixName: string;
    /**
     * If present, one may call 'getCombinedCodeFix' with this fixId.
     * This may be omitted to indicate that the code fix can't be applied in a group.
     */
    fixId?: {};
    fixAllDescription?: string;
  }
  interface CombinedCodeActions {
    changes: ReadonlyArray<FileTextChanges>;
    commands?: ReadonlyArray<CodeActionCommand>;
  }
  type CodeActionCommand = InstallPackageAction;
  interface InstallPackageAction {
    readonly type: "install package";
    readonly file: string;
    readonly packageName: string;
  }
  /**
   * A set of one or more available refactoring actions, grouped under a parent refactoring.
   */
  interface ApplicableRefactorInfo {
    /**
     * The programmatic name of the refactoring
     */
    name: string;
    /**
     * A description of this refactoring category to show to the user.
     * If the refactoring gets inlined (see below), this text will not be visible.
     */
    description: string;
    /**
     * Inlineable refactorings can have their actions hoisted out to the top level
     * of a context menu. Non-inlineanable refactorings should always be shown inside
     * their parent grouping.
     *
     * If not specified, this value is assumed to be 'true'
     */
    inlineable?: boolean;
    actions: RefactorActionInfo[];
  }
  /**
   * Represents a single refactoring action - for example, the "Extract Method..." refactor might
   * offer several actions, each corresponding to a surround class or closure to extract into.
   */
  interface RefactorActionInfo {
    /**
     * The programmatic name of the refactoring action
     */
    name: string;
    /**
     * A description of this refactoring action to show to the user.
     * If the parent refactoring is inlined away, this will be the only text shown,
     * so this description should make sense by itself if the parent is inlineable=true
     */
    description: string;
  }
  /**
   * A set of edits to make in response to a refactor action, plus an optional
   * location where renaming should be invoked from
   */
  interface RefactorEditInfo {
    edits: FileTextChanges[];
    renameFilename?: string;
    renameLocation?: number;
    commands?: CodeActionCommand[];
  }
  interface TextInsertion {
    newText: string;
    /** The position in newText the caret should point to after the insertion. */
    caretOffset: number;
  }
  interface DocumentSpan {
    textSpan: TextSpan;
    fileName: string;
    /**
     * If the span represents a location that was remapped (e.g. via a .d.ts.map file),
     * then the original filename and span will be specified here
     */
    originalTextSpan?: TextSpan;
    originalFileName?: string;
    /**
     * If DocumentSpan.textSpan is the span for name of the declaration,
     * then this is the span for relevant declaration
     */
    contextSpan?: TextSpan;
    originalContextSpan?: TextSpan;
  }
  interface RenameLocation extends DocumentSpan {
    readonly prefixText?: string;
    readonly suffixText?: string;
  }
  interface ReferenceEntry extends DocumentSpan {
    isWriteAccess: boolean;
    isDefinition: boolean;
    isInString?: true;
  }
  interface ImplementationLocation extends DocumentSpan {
    kind: ScriptElementKind;
    displayParts: SymbolDisplayPart[];
  }
  interface DocumentHighlights {
    fileName: string;
    highlightSpans: HighlightSpan[];
  }
  enum HighlightSpanKind {
    none = "none",
    definition = "definition",
    reference = "reference",
    writtenReference = "writtenReference"
  }
  interface HighlightSpan {
    fileName?: string;
    isInString?: true;
    textSpan: TextSpan;
    contextSpan?: TextSpan;
    kind: HighlightSpanKind;
  }
  interface NavigateToItem {
    name: string;
    kind: ScriptElementKind;
    kindModifiers: string;
    matchKind: "exact" | "prefix" | "substring" | "camelCase";
    isCaseSensitive: boolean;
    fileName: string;
    textSpan: TextSpan;
    containerName: string;
    containerKind: ScriptElementKind;
  }
  enum IndentStyle {
    None = 0,
    Block = 1,
    Smart = 2
  }
  interface EditorOptions {
    BaseIndentSize?: number;
    IndentSize: number;
    TabSize: number;
    NewLineCharacter: string;
    ConvertTabsToSpaces: boolean;
    IndentStyle: IndentStyle;
  }
  interface EditorSettings {
    baseIndentSize?: number;
    indentSize?: number;
    tabSize?: number;
    newLineCharacter?: string;
    convertTabsToSpaces?: boolean;
    indentStyle?: IndentStyle;
  }
  interface FormatCodeOptions extends EditorOptions {
    InsertSpaceAfterCommaDelimiter: boolean;
    InsertSpaceAfterSemicolonInForStatements: boolean;
    InsertSpaceBeforeAndAfterBinaryOperators: boolean;
    InsertSpaceAfterConstructor?: boolean;
    InsertSpaceAfterKeywordsInControlFlowStatements: boolean;
    InsertSpaceAfterFunctionKeywordForAnonymousFunctions: boolean;
    InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: boolean;
    InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: boolean;
    InsertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
    InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: boolean;
    InsertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
    InsertSpaceAfterTypeAssertion?: boolean;
    InsertSpaceBeforeFunctionParenthesis?: boolean;
    PlaceOpenBraceOnNewLineForFunctions: boolean;
    PlaceOpenBraceOnNewLineForControlBlocks: boolean;
    insertSpaceBeforeTypeAnnotation?: boolean;
  }
  interface FormatCodeSettings extends EditorSettings {
    readonly insertSpaceAfterCommaDelimiter?: boolean;
    readonly insertSpaceAfterSemicolonInForStatements?: boolean;
    readonly insertSpaceBeforeAndAfterBinaryOperators?: boolean;
    readonly insertSpaceAfterConstructor?: boolean;
    readonly insertSpaceAfterKeywordsInControlFlowStatements?: boolean;
    readonly insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean;
    readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean;
    readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean;
    readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
    readonly insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean;
    readonly insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
    readonly insertSpaceAfterTypeAssertion?: boolean;
    readonly insertSpaceBeforeFunctionParenthesis?: boolean;
    readonly placeOpenBraceOnNewLineForFunctions?: boolean;
    readonly placeOpenBraceOnNewLineForControlBlocks?: boolean;
    readonly insertSpaceBeforeTypeAnnotation?: boolean;
    readonly indentMultiLineObjectLiteralBeginningOnBlankLine?: boolean;
  }
  function getDefaultFormatCodeSettings(newLineCharacter?: string): FormatCodeSettings;
  const testFormatSettings: FormatCodeSettings;
  interface DefinitionInfo extends DocumentSpan {
    kind: ScriptElementKind;
    name: string;
    containerKind: ScriptElementKind;
    containerName: string;
  }
  interface DefinitionInfoAndBoundSpan {
    definitions?: ReadonlyArray<DefinitionInfo>;
    textSpan: TextSpan;
  }
  interface ReferencedSymbolDefinitionInfo extends DefinitionInfo {
    displayParts: SymbolDisplayPart[];
  }
  interface ReferencedSymbol {
    definition: ReferencedSymbolDefinitionInfo;
    references: ReferenceEntry[];
  }
  enum SymbolDisplayPartKind {
    aliasName = 0,
    className = 1,
    enumName = 2,
    fieldName = 3,
    interfaceName = 4,
    keyword = 5,
    lineBreak = 6,
    numericLiteral = 7,
    stringLiteral = 8,
    localName = 9,
    methodName = 10,
    moduleName = 11,
    operator = 12,
    parameterName = 13,
    propertyName = 14,
    punctuation = 15,
    space = 16,
    text = 17,
    typeParameterName = 18,
    enumMemberName = 19,
    functionName = 20,
    regularExpressionLiteral = 21
  }
  interface SymbolDisplayPart {
    text: string;
    kind: string;
  }
  interface JSDocTagInfo {
    name: string;
    text?: string;
  }
  interface QuickInfo {
    kind: ScriptElementKind;
    kindModifiers: string;
    textSpan: TextSpan;
    displayParts?: SymbolDisplayPart[];
    documentation?: SymbolDisplayPart[];
    tags?: JSDocTagInfo[];
  }
  type RenameInfo = RenameInfoSuccess | RenameInfoFailure;
  interface RenameInfoSuccess {
    canRename: true;
    /**
     * File or directory to rename.
     * If set, `getEditsForFileRename` should be called instead of `findRenameLocations`.
     */
    fileToRename?: string;
    displayName: string;
    fullDisplayName: string;
    kind: ScriptElementKind;
    kindModifiers: string;
    triggerSpan: TextSpan;
  }
  interface RenameInfoFailure {
    canRename: false;
    localizedErrorMessage: string;
  }
  interface RenameInfoOptions {
    readonly allowRenameOfImportPath?: boolean;
  }
  interface SignatureHelpParameter {
    name: string;
    documentation: SymbolDisplayPart[];
    displayParts: SymbolDisplayPart[];
    isOptional: boolean;
  }
  interface SelectionRange {
    textSpan: TextSpan;
    parent?: SelectionRange;
  }
  /**
   * Represents a single signature to show in signature help.
   * The id is used for subsequent calls into the language service to ask questions about the
   * signature help item in the context of any documents that have been updated.  i.e. after
   * an edit has happened, while signature help is still active, the host can ask important
   * questions like 'what parameter is the user currently contained within?'.
   */
  interface SignatureHelpItem {
    isVariadic: boolean;
    prefixDisplayParts: SymbolDisplayPart[];
    suffixDisplayParts: SymbolDisplayPart[];
    separatorDisplayParts: SymbolDisplayPart[];
    parameters: SignatureHelpParameter[];
    documentation: SymbolDisplayPart[];
    tags: JSDocTagInfo[];
  }
  /**
   * Represents a set of signature help items, and the preferred item that should be selected.
   */
  interface SignatureHelpItems {
    items: SignatureHelpItem[];
    applicableSpan: TextSpan;
    selectedItemIndex: number;
    argumentIndex: number;
    argumentCount: number;
  }
  interface CompletionInfo {
    /** Not true for all global completions. This will be true if the enclosing scope matches a few syntax kinds. See `isSnippetScope`. */
    isGlobalCompletion: boolean;
    isMemberCompletion: boolean;
    /**
     * true when the current location also allows for a new identifier
     */
    isNewIdentifierLocation: boolean;
    entries: CompletionEntry[];
  }
  interface CompletionEntry {
    name: string;
    kind: ScriptElementKind;
    kindModifiers?: string;
    sortText: string;
    insertText?: string;
    /**
     * An optional span that indicates the text to be replaced by this completion item.
     * If present, this span should be used instead of the default one.
     * It will be set if the required span differs from the one generated by the default replacement behavior.
     */
    replacementSpan?: TextSpan;
    hasAction?: true;
    source?: string;
    isRecommended?: true;
  }
  interface CompletionEntryDetails {
    name: string;
    kind: ScriptElementKind;
    kindModifiers: string;
    displayParts: SymbolDisplayPart[];
    documentation?: SymbolDisplayPart[];
    tags?: JSDocTagInfo[];
    codeActions?: CodeAction[];
    source?: SymbolDisplayPart[];
  }
  interface OutliningSpan {
    /** The span of the document to actually collapse. */
    textSpan: TextSpan;
    /** The span of the document to display when the user hovers over the collapsed span. */
    hintSpan: TextSpan;
    /** The text to display in the editor for the collapsed region. */
    bannerText: string;
    /**
     * Whether or not this region should be automatically collapsed when
     * the 'Collapse to Definitions' command is invoked.
     */
    autoCollapse: boolean;
    /**
     * Classification of the contents of the span
     */
    kind: OutliningSpanKind;
  }
  enum OutliningSpanKind {
    /** Single or multi-line comments */
    Comment = "comment",
    /** Sections marked by '// #region' and '// #endregion' comments */
    Region = "region",
    /** Declarations and expressions */
    Code = "code",
    /** Contiguous blocks of import declarations */
    Imports = "imports"
  }
  enum OutputFileType {
    JavaScript = 0,
    SourceMap = 1,
    Declaration = 2
  }
  enum EndOfLineState {
    None = 0,
    InMultiLineCommentTrivia = 1,
    InSingleQuoteStringLiteral = 2,
    InDoubleQuoteStringLiteral = 3,
    InTemplateHeadOrNoSubstitutionTemplate = 4,
    InTemplateMiddleOrTail = 5,
    InTemplateSubstitutionPosition = 6
  }
  enum TokenClass {
    Punctuation = 0,
    Keyword = 1,
    Operator = 2,
    Comment = 3,
    Whitespace = 4,
    Identifier = 5,
    NumberLiteral = 6,
    BigIntLiteral = 7,
    StringLiteral = 8,
    RegExpLiteral = 9
  }
  interface ClassificationResult {
    finalLexState: EndOfLineState;
    entries: ClassificationInfo[];
  }
  interface ClassificationInfo {
    length: number;
    classification: TokenClass;
  }
  interface Classifier {
    /**
     * Gives lexical classifications of tokens on a line without any syntactic context.
     * For instance, a token consisting of the text 'string' can be either an identifier
     * named 'string' or the keyword 'string', however, because this classifier is not aware,
     * it relies on certain heuristics to give acceptable results. For classifications where
     * speed trumps accuracy, this function is preferable; however, for true accuracy, the
     * syntactic classifier is ideal. In fact, in certain editing scenarios, combining the
     * lexical, syntactic, and semantic classifiers may issue the best user experience.
     *
     * @param text                      The text of a line to classify.
     * @param lexState                  The state of the lexical classifier at the end of the previous line.
     * @param syntacticClassifierAbsent Whether the client is *not* using a syntactic classifier.
     *                                  If there is no syntactic classifier (syntacticClassifierAbsent=true),
     *                                  certain heuristics may be used in its place; however, if there is a
     *                                  syntactic classifier (syntacticClassifierAbsent=false), certain
     *                                  classifications which may be incorrectly categorized will be given
     *                                  back as Identifiers in order to allow the syntactic classifier to
     *                                  subsume the classification.
     * @deprecated Use getLexicalClassifications instead.
     */
    getClassificationsForLine(text: string, lexState: EndOfLineState, syntacticClassifierAbsent: boolean): ClassificationResult;
    getEncodedLexicalClassifications(text: string, endOfLineState: EndOfLineState, syntacticClassifierAbsent: boolean): Classifications;
  }
  enum ScriptElementKind {
    unknown = "",
    warning = "warning",
    /** predefined type (void) or keyword (class) */
    keyword = "keyword",
    /** top level script node */
    scriptElement = "script",
    /** module foo {} */
    moduleElement = "module",
    /** class X {} */
    classElement = "class",
    /** var x = class X {} */
    localClassElement = "local class",
    /** interface Y {} */
    interfaceElement = "interface",
    /** type T = ... */
    typeElement = "type",
    /** enum E */
    enumElement = "enum",
    enumMemberElement = "enum member",
    /**
     * Inside module and script only
     * const v = ..
     */
    variableElement = "var",
    /** Inside function */
    localVariableElement = "local var",
    /**
     * Inside module and script only
     * function f() { }
     */
    functionElement = "function",
    /** Inside function */
    localFunctionElement = "local function",
    /** class X { [public|private]* foo() {} } */
    memberFunctionElement = "method",
    /** class X { [public|private]* [get|set] foo:number; } */
    memberGetAccessorElement = "getter",
    memberSetAccessorElement = "setter",
    /**
     * class X { [public|private]* foo:number; }
     * interface Y { foo:number; }
     */
    memberVariableElement = "property",
    /** class X { constructor() { } } */
    constructorImplementationElement = "constructor",
    /** interface Y { ():number; } */
    callSignatureElement = "call",
    /** interface Y { []:number; } */
    indexSignatureElement = "index",
    /** interface Y { new():Y; } */
    constructSignatureElement = "construct",
    /** function foo(*Y*: string) */
    parameterElement = "parameter",
    typeParameterElement = "type parameter",
    primitiveType = "primitive type",
    label = "label",
    alias = "alias",
    constElement = "const",
    letElement = "let",
    directory = "directory",
    externalModuleName = "external module name",
    /**
     * <JsxTagName attribute1 attribute2={0} />
     */
    jsxAttribute = "JSX attribute",
    /** String literal */
      string = "string"
  }
  enum ScriptElementKindModifier {
    none = "",
    publicMemberModifier = "public",
    privateMemberModifier = "private",
    protectedMemberModifier = "protected",
    exportedModifier = "export",
    ambientModifier = "declare",
    staticModifier = "static",
    abstractModifier = "abstract",
    optionalModifier = "optional",
    dtsModifier = ".d.ts",
    tsModifier = ".ts",
    tsxModifier = ".tsx",
    jsModifier = ".js",
    jsxModifier = ".jsx",
    jsonModifier = ".json"
  }
  enum ClassificationTypeNames {
    comment = "comment",
    identifier = "identifier",
    keyword = "keyword",
    numericLiteral = "number",
    bigintLiteral = "bigint",
    operator = "operator",
    stringLiteral = "string",
    whiteSpace = "whitespace",
    text = "text",
    punctuation = "punctuation",
    className = "class name",
    enumName = "enum name",
    interfaceName = "interface name",
    moduleName = "module name",
    typeParameterName = "type parameter name",
    typeAliasName = "type alias name",
    parameterName = "parameter name",
    docCommentTagName = "doc comment tag name",
    jsxOpenTagName = "jsx open tag name",
    jsxCloseTagName = "jsx close tag name",
    jsxSelfClosingTagName = "jsx self closing tag name",
    jsxAttribute = "jsx attribute",
    jsxText = "jsx text",
    jsxAttributeStringLiteralValue = "jsx attribute string literal value"
  }
  enum ClassificationType {
    comment = 1,
    identifier = 2,
    keyword = 3,
    numericLiteral = 4,
    operator = 5,
    stringLiteral = 6,
    regularExpressionLiteral = 7,
    whiteSpace = 8,
    text = 9,
    punctuation = 10,
    className = 11,
    enumName = 12,
    interfaceName = 13,
    moduleName = 14,
    typeParameterName = 15,
    typeAliasName = 16,
    parameterName = 17,
    docCommentTagName = 18,
    jsxOpenTagName = 19,
    jsxCloseTagName = 20,
    jsxSelfClosingTagName = 21,
    jsxAttribute = 22,
    jsxText = 23,
    jsxAttributeStringLiteralValue = 24,
    bigintLiteral = 25
  }
}
interface PromiseConstructor {
  new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
  reject(reason: any): Promise<never>;
  all<T>(values: (T | PromiseLike<T>)[]): Promise<T[]>;
}
declare var Promise: PromiseConstructor;
declare namespace ts {
  const scanner: Scanner;
  enum SemanticMeaning {
    None = 0,
    Value = 1,
    Type = 2,
    Namespace = 4,
    All = 7
  }
  function getMeaningFromDeclaration(node: Node): SemanticMeaning;
  function getMeaningFromLocation(node: Node): SemanticMeaning;
  function isInRightSideOfInternalImportEqualsDeclaration(node: Node): boolean;
  function isCallExpressionTarget(node: Node): boolean;
  function isNewExpressionTarget(node: Node): boolean;
  function isCallOrNewExpressionTarget(node: Node): boolean;
  function climbPastPropertyAccess(node: Node): Node;
  function getTargetLabel(referenceNode: Node, labelName: string): Identifier | undefined;
  function hasPropertyAccessExpressionWithName(node: CallExpression, funcName: string): boolean;
  function isJumpStatementTarget(node: Node): node is Identifier & {
    parent: BreakOrContinueStatement;
  };
  function isLabelOfLabeledStatement(node: Node): node is Identifier;
  function isLabelName(node: Node): boolean;
  function isTagName(node: Node): boolean;
  function isRightSideOfQualifiedName(node: Node): boolean;
  function isRightSideOfPropertyAccess(node: Node): boolean;
  function isNameOfModuleDeclaration(node: Node): boolean;
  function isNameOfFunctionDeclaration(node: Node): boolean;
  function isLiteralNameOfPropertyDeclarationOrIndexAccess(node: StringLiteral | NumericLiteral): boolean;
  function isExpressionOfExternalModuleImportEqualsDeclaration(node: Node): boolean;
  function getContainerNode(node: Node): Declaration | undefined;
  function getNodeKind(node: Node): ScriptElementKind;
  function isThis(node: Node): boolean;
  interface ListItemInfo {
    listItemIndex: number;
    list: Node;
  }
  function getLineStartPositionForPosition(position: number, sourceFile: SourceFileLike): number;
  function rangeContainsRange(r1: TextRange, r2: TextRange): boolean;
  function rangeContainsRangeExclusive(r1: TextRange, r2: TextRange): boolean;
  function rangeContainsPosition(r: TextRange, pos: number): boolean;
  function rangeContainsPositionExclusive(r: TextRange, pos: number): boolean;
  function startEndContainsRange(start: number, end: number, range: TextRange): boolean;
  function rangeContainsStartEnd(range: TextRange, start: number, end: number): boolean;
  function rangeOverlapsWithStartEnd(r1: TextRange, start: number, end: number): boolean;
  function nodeOverlapsWithStartEnd(node: Node, sourceFile: SourceFile, start: number, end: number): boolean;
  function startEndOverlapsWithStartEnd(start1: number, end1: number, start2: number, end2: number): boolean;
  /**
   * Assumes `candidate.start <= position` holds.
   */
  function positionBelongsToNode(candidate: Node, position: number, sourceFile: SourceFile): boolean;
  function findListItemInfo(node: Node): ListItemInfo | undefined;
  function hasChildOfKind(n: Node, kind: SyntaxKind, sourceFile: SourceFile): boolean;
  function findChildOfKind<T extends Node>(n: Node, kind: T["kind"], sourceFile: SourceFileLike): T | undefined;
  function findContainingList(node: Node): SyntaxList | undefined;
  /**
   * Gets the token whose text has range [start, end) and
   * position >= start and (position < end or (position === end && token is literal or keyword or identifier))
   */
  function getTouchingPropertyName(sourceFile: SourceFile, position: number): Node;
  /**
   * Returns the token if position is in [start, end).
   * If position === end, returns the preceding token if includeItemAtEndPosition(previousToken) === true
   */
  function getTouchingToken(sourceFile: SourceFile, position: number, includePrecedingTokenAtEndPosition?: (n: Node) => boolean): Node;
  /** Returns a token if position is in [start-of-leading-trivia, end) */
  function getTokenAtPosition(sourceFile: SourceFile, position: number): Node;
  /**
   * The token on the left of the position is the token that strictly includes the position
   * or sits to the left of the cursor if it is on a boundary. For example
   *
   *   fo|o               -> will return foo
   *   foo <comment> |bar -> will return foo
   *
   */
  function findTokenOnLeftOfPosition(file: SourceFile, position: number): Node | undefined;
  function findNextToken(previousToken: Node, parent: Node, sourceFile: SourceFile): Node | undefined;
  /**
   * Finds the rightmost token satisfying `token.end <= position`,
   * excluding `JsxText` tokens containing only whitespace.
   */
  function findPrecedingToken(position: number, sourceFile: SourceFile, startNode?: Node, excludeJsdoc?: boolean): Node | undefined;
  function isInString(sourceFile: SourceFile, position: number, previousToken?: Node | undefined): boolean;
  /**
   * returns true if the position is in between the open and close elements of an JSX expression.
   */
  function isInsideJsxElementOrAttribute(sourceFile: SourceFile, position: number): boolean;
  function isInTemplateString(sourceFile: SourceFile, position: number): boolean;
  function isInJSXText(sourceFile: SourceFile, position: number): boolean;
  function findPrecedingMatchingToken(token: Node, matchingTokenKind: SyntaxKind, sourceFile: SourceFile): Node | undefined;
  function isPossiblyTypeArgumentPosition(token: Node, sourceFile: SourceFile, checker: TypeChecker): boolean;
  function getPossibleGenericSignatures(called: Expression, typeArgumentCount: number, checker: TypeChecker): ReadonlyArray<Signature>;
  interface PossibleTypeArgumentInfo {
    readonly called: Identifier;
    readonly nTypeArguments: number;
  }
  interface PossibleProgramFileInfo {
    ProgramFiles?: string[];
  }
  function getPossibleTypeArgumentsInfo(tokenIn: Node, sourceFile: SourceFile): PossibleTypeArgumentInfo | undefined;
  /**
   * Returns true if the cursor at position in sourceFile is within a comment.
   *
   * @param tokenAtPosition Must equal `getTokenAtPosition(sourceFile, position)
   * @param predicate Additional predicate to test on the comment range.
   */
  function isInComment(sourceFile: SourceFile, position: number, tokenAtPosition?: Node): CommentRange | undefined;
  function hasDocComment(sourceFile: SourceFile, position: number): boolean;
  function getNodeModifiers(node: Node): string;
  function getTypeArgumentOrTypeParameterList(node: Node): NodeArray<Node> | undefined;
  function isComment(kind: SyntaxKind): boolean;
  function isStringOrRegularExpressionOrTemplateLiteral(kind: SyntaxKind): boolean;
  function isPunctuation(kind: SyntaxKind): boolean;
  function isInsideTemplateLiteral(node: TemplateLiteralToken, position: number, sourceFile: SourceFile): boolean;
  function isAccessibilityModifier(kind: SyntaxKind): boolean;
  function cloneCompilerOptions(options: CompilerOptions): CompilerOptions;
  function isArrayLiteralOrObjectLiteralDestructuringPattern(node: Node): boolean;
  function isInReferenceComment(sourceFile: SourceFile, position: number): boolean;
  function isInNonReferenceComment(sourceFile: SourceFile, position: number): boolean;
  function createTextSpanFromNode(node: Node, sourceFile?: SourceFile, endNode?: Node): TextSpan;
  function createTextRangeFromNode(node: Node, sourceFile: SourceFile): TextRange;
  function createTextSpanFromRange(range: TextRange): TextSpan;
  function createTextRangeFromSpan(span: TextSpan): TextRange;
  function createTextChangeFromStartLength(start: number, length: number, newText: string): TextChange;
  function createTextChange(span: TextSpan, newText: string): TextChange;
  const typeKeywords: ReadonlyArray<SyntaxKind>;
  function isTypeKeyword(kind: SyntaxKind): boolean;
  /** True if the symbol is for an external module, as opposed to a namespace. */
  function isExternalModuleSymbol(moduleSymbol: Symbol): boolean;
  /** Returns `true` the first time it encounters a node and `false` afterwards. */
  type NodeSeenTracker<T = Node> = (node: T) => boolean;
  function nodeSeenTracker<T extends Node>(): NodeSeenTracker<T>;
  function getSnapshotText(snap: IScriptSnapshot): string;
  function repeatString(str: string, count: number): string;
  function skipConstraint(type: Type): Type;
  function getNameFromPropertyName(name: PropertyName): string | undefined;
  function programContainsEs6Modules(program: Program): boolean;
  function compilerOptionsIndicateEs6Modules(compilerOptions: CompilerOptions): boolean;
  function hostUsesCaseSensitiveFileNames(host: {
    useCaseSensitiveFileNames?(): boolean;
  }): boolean;
  function hostGetCanonicalFileName(host: {
    useCaseSensitiveFileNames?(): boolean;
  }): GetCanonicalFileName;
  function makeImportIfNecessary(defaultImport: Identifier | undefined, namedImports: ReadonlyArray<ImportSpecifier> | undefined, moduleSpecifier: string, quotePreference: QuotePreference): ImportDeclaration | undefined;
  function makeImport(defaultImport: Identifier | undefined, namedImports: ReadonlyArray<ImportSpecifier> | undefined, moduleSpecifier: string | Expression, quotePreference: QuotePreference): ImportDeclaration;
  function makeStringLiteral(text: string, quotePreference: QuotePreference): StringLiteral;
  enum QuotePreference {
    Single = 0,
    Double = 1
  }
  function quotePreferenceFromString(str: StringLiteral, sourceFile: SourceFile): QuotePreference;
  function getQuotePreference(sourceFile: SourceFile, preferences: UserPreferences): QuotePreference;
  function getQuoteFromPreference(qp: QuotePreference): string;
  function symbolNameNoDefault(symbol: Symbol): string | undefined;
  function symbolEscapedNameNoDefault(symbol: Symbol): __String | undefined;
  type ObjectBindingElementWithoutPropertyName = BindingElement & {
    name: Identifier;
  };
  function isObjectBindingElementWithoutPropertyName(bindingElement: Node): bindingElement is ObjectBindingElementWithoutPropertyName;
  function getPropertySymbolFromBindingElement(checker: TypeChecker, bindingElement: ObjectBindingElementWithoutPropertyName): Symbol | undefined;
  /**
   * Find symbol of the given property-name and add the symbol to the given result array
   * @param symbol a symbol to start searching for the given propertyName
   * @param propertyName a name of property to search for
   * @param result an array of symbol of found property symbols
   * @param previousIterationSymbolsCache a cache of symbol from previous iterations of calling this function to prevent infinite revisiting of the same symbol.
   *                                The value of previousIterationSymbol is undefined when the function is first called.
   */
  function getPropertySymbolsFromBaseTypes<T>(symbol: Symbol, propertyName: string, checker: TypeChecker, cb: (symbol: Symbol) => T | undefined): T | undefined;
  function isMemberSymbolInBaseType(memberSymbol: Symbol, checker: TypeChecker): boolean;
  function getParentNodeInSpan(node: Node | undefined, file: SourceFile, span: TextSpan): Node | undefined;
  function findModifier(node: Node, kind: Modifier["kind"]): Modifier | undefined;
  function insertImport(changes: textChanges.ChangeTracker, sourceFile: SourceFile, importDecl: Statement): void;
  function textSpansEqual(a: TextSpan | undefined, b: TextSpan | undefined): boolean;
  function documentSpansEqual(a: DocumentSpan, b: DocumentSpan): boolean;
}
declare namespace ts {
  function isFirstDeclarationOfSymbolParameter(symbol: Symbol): boolean;
  function symbolPart(text: string, symbol: Symbol): SymbolDisplayPart;
  function displayPart(text: string, kind: SymbolDisplayPartKind): SymbolDisplayPart;
  function spacePart(): SymbolDisplayPart;
  function keywordPart(kind: SyntaxKind): SymbolDisplayPart;
  function punctuationPart(kind: SyntaxKind): SymbolDisplayPart;
  function operatorPart(kind: SyntaxKind): SymbolDisplayPart;
  function textOrKeywordPart(text: string): SymbolDisplayPart;
  function textPart(text: string): SymbolDisplayPart;
  /**
   * The default is CRLF.
   */
  function getNewLineOrDefaultFromHost(host: LanguageServiceHost | LanguageServiceShimHost, formatSettings?: FormatCodeSettings): string;
  function lineBreakPart(): SymbolDisplayPart;
  function mapToDisplayParts(writeDisplayParts: (writer: DisplayPartsSymbolWriter) => void): SymbolDisplayPart[];
  function typeToDisplayParts(typechecker: TypeChecker, type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): SymbolDisplayPart[];
  function symbolToDisplayParts(typeChecker: TypeChecker, symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags): SymbolDisplayPart[];
  function signatureToDisplayParts(typechecker: TypeChecker, signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags): SymbolDisplayPart[];
  function isImportOrExportSpecifierName(location: Node): location is Identifier;
  function scriptKindIs(fileName: string, host: LanguageServiceHost, ...scriptKinds: ScriptKind[]): boolean;
  function getScriptKind(fileName: string, host?: LanguageServiceHost): ScriptKind;
  function getSymbolTarget(symbol: Symbol, checker: TypeChecker): Symbol;
  function getUniqueSymbolId(symbol: Symbol, checker: TypeChecker): number;
  function getFirstNonSpaceCharacterPosition(text: string, position: number): number;
  function getPrecedingNonSpaceCharacterPosition(text: string, position: number): number;
  /**
   * Creates a deep, memberwise clone of a node with no source map location.
   *
   * WARNING: This is an expensive operation and is only intended to be used in refactorings
   * and code fixes (because those are triggered by explicit user actions).
   */
  function getSynthesizedDeepClone<T extends Node | undefined>(node: T, includeTrivia?: boolean): T;
  function getSynthesizedDeepCloneWithRenames<T extends Node>(node: T, includeTrivia?: boolean, renameMap?: Map<Identifier>, checker?: TypeChecker, callback?: (originalNode: Node, clone: Node) => any): T;
  function getSynthesizedDeepClones<T extends Node>(nodes: NodeArray<T>, includeTrivia?: boolean): NodeArray<T>;
  function getSynthesizedDeepClones<T extends Node>(nodes: NodeArray<T> | undefined, includeTrivia?: boolean): NodeArray<T> | undefined;
  /**
   * Sets EmitFlags to suppress leading and trailing trivia on the node.
   */
  function suppressLeadingAndTrailingTrivia(node: Node): void;
  /**
   * Sets EmitFlags to suppress leading trivia on the node.
   */
  function suppressLeadingTrivia(node: Node): void;
  /**
   * Sets EmitFlags to suppress trailing trivia on the node.
   */
  function suppressTrailingTrivia(node: Node): void;
  function getUniqueName(baseName: string, sourceFile: SourceFile): string;
  /**
   * @return The index of the (only) reference to the extracted symbol.  We want the cursor
   * to be on the reference, rather than the declaration, because it's closer to where the
   * user was before extracting it.
   */
  function getRenameLocation(edits: ReadonlyArray<FileTextChanges>, renameFilename: string, name: string, preferLastLocation: boolean): number;
  function copyLeadingComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
  function copyTrailingComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
  /**
   * This function copies the trailing comments for the token that comes before `sourceNode`, as leading comments of `targetNode`.
   * This is useful because sometimes a comment that refers to `sourceNode` will be a leading comment for `sourceNode`, according to the
   * notion of trivia ownership, and instead will be a trailing comment for the token before `sourceNode`, e.g.:
   * `function foo(\* not leading comment for a *\ a: string) {}`
   * The comment refers to `a` but belongs to the `(` token, but we might want to copy it.
   */
  function copyTrailingAsLeadingComments(sourceNode: Node, targetNode: Node, sourceFile: SourceFile, commentKind?: CommentKind, hasTrailingNewLine?: boolean): void;
  function getContextualTypeFromParent(node: Expression, checker: TypeChecker): Type | undefined;
  function quote(text: string, preferences: UserPreferences): string;
  function isEqualityOperatorKind(kind: SyntaxKind): kind is EqualityOperator;
  function isStringLiteralOrTemplate(node: Node): node is StringLiteralLike | TemplateExpression | TaggedTemplateExpression;
  function hasIndexSignature(type: Type): boolean;
  function getSwitchedType(caseClause: CaseClause, checker: TypeChecker): Type | undefined;
  function getTypeNodeIfAccessible(type: Type, enclosingScope: Node, program: Program, host: LanguageServiceHost): TypeNode | undefined;
  function syntaxUsuallyHasTrailingSemicolon(kind: SyntaxKind): boolean;
  function probablyUsesSemicolons(sourceFile: SourceFile): boolean;
}
declare namespace ts {
  /** The classifier is used for syntactic highlighting in editors via the TSServer */
  function createClassifier(): Classifier;
  function getSemanticClassifications(typeChecker: TypeChecker, cancellationToken: CancellationToken, sourceFile: SourceFile, classifiableNames: UnderscoreEscapedMap<true>, span: TextSpan): ClassifiedSpan[];
  function getEncodedSemanticClassifications(typeChecker: TypeChecker, cancellationToken: CancellationToken, sourceFile: SourceFile, classifiableNames: UnderscoreEscapedMap<true>, span: TextSpan): Classifications;
  function getSyntacticClassifications(cancellationToken: CancellationToken, sourceFile: SourceFile, span: TextSpan): ClassifiedSpan[];
  function getEncodedSyntacticClassifications(cancellationToken: CancellationToken, sourceFile: SourceFile, span: TextSpan): Classifications;
}
declare namespace ts.Completions.StringCompletions {
  function getStringLiteralCompletions(sourceFile: SourceFile, position: number, contextToken: Node | undefined, checker: TypeChecker, options: CompilerOptions, host: LanguageServiceHost, log: Log, preferences: UserPreferences): CompletionInfo | undefined;
  function getStringLiteralCompletionDetails(name: string, sourceFile: SourceFile, position: number, contextToken: Node | undefined, checker: TypeChecker, options: CompilerOptions, host: LanguageServiceHost, cancellationToken: CancellationToken): CompletionEntryDetails | undefined;
}
declare namespace ts.Completions {
  export enum SortText {
    LocationPriority = "0",
    SuggestedClassMembers = "1",
    GlobalsOrKeywords = "2",
    AutoImportSuggestions = "3",
    JavascriptIdentifiers = "4"
  }
  export type Log = (message: string) => void;
  enum SymbolOriginInfoKind {
    ThisType = 0,
    SymbolMemberNoExport = 1,
    SymbolMemberExport = 2,
    Export = 3
  }
  type SymbolOriginInfo = {
    kind: SymbolOriginInfoKind.ThisType;
  } | {
    kind: SymbolOriginInfoKind.SymbolMemberNoExport;
  } | SymbolOriginInfoExport;
  interface SymbolOriginInfoExport {
    kind: SymbolOriginInfoKind.SymbolMemberExport | SymbolOriginInfoKind.Export;
    moduleSymbol: Symbol;
    isDefaultExport: boolean;
  }
  /**
   * Map from symbol id -> SymbolOriginInfo.
   * Only populated for symbols that come from other modules.
   */
  type SymbolOriginInfoMap = (SymbolOriginInfo | undefined)[];
  type SymbolSortTextMap = (SortText | undefined)[];
  export function getCompletionsAtPosition(host: LanguageServiceHost, program: Program, log: Log, sourceFile: SourceFile, position: number, preferences: UserPreferences, triggerCharacter: CompletionsTriggerCharacter | undefined): CompletionInfo | undefined;
  export function getCompletionEntriesFromSymbols(symbols: ReadonlyArray<Symbol>, entries: Push<CompletionEntry>, location: Node | undefined, sourceFile: SourceFile, typeChecker: TypeChecker, target: ScriptTarget, log: Log, kind: CompletionKind, preferences: UserPreferences, propertyAccessToConvert?: PropertyAccessExpression | undefined, isJsxInitializer?: IsJsxInitializer, recommendedCompletion?: Symbol, symbolToOriginInfoMap?: SymbolOriginInfoMap, symbolToSortTextMap?: SymbolSortTextMap): Map<true>;
  export interface CompletionEntryIdentifier {
    name: string;
    source?: string;
  }
  export function getCompletionEntryDetails(program: Program, log: Log, sourceFile: SourceFile, position: number, entryId: CompletionEntryIdentifier, host: LanguageServiceHost, formatContext: formatting.FormatContext, preferences: UserPreferences, cancellationToken: CancellationToken): CompletionEntryDetails | undefined;
  export function createCompletionDetailsForSymbol(symbol: Symbol, checker: TypeChecker, sourceFile: SourceFile, location: Node, cancellationToken: CancellationToken, codeActions?: CodeAction[], sourceDisplay?: SymbolDisplayPart[]): CompletionEntryDetails;
  export function createCompletionDetails(name: string, kindModifiers: string, kind: ScriptElementKind, displayParts: SymbolDisplayPart[], documentation?: SymbolDisplayPart[], tags?: JSDocTagInfo[], codeActions?: CodeAction[], source?: SymbolDisplayPart[]): CompletionEntryDetails;
  export function getCompletionEntrySymbol(program: Program, log: Log, sourceFile: SourceFile, position: number, entryId: CompletionEntryIdentifier): Symbol | undefined;
  /** true: after the `=` sign but no identifier has been typed yet. Else is the Identifier after the initializer. */
  type IsJsxInitializer = boolean | Identifier;
  export enum CompletionKind {
    ObjectPropertyDeclaration = 0,
    Global = 1,
    PropertyAccess = 2,
    MemberLike = 3,
    String = 4,
    None = 5
  }
  export {};
}
declare namespace ts.DocumentHighlights {
  function getDocumentHighlights(program: Program, cancellationToken: CancellationToken, sourceFile: SourceFile, position: number, sourceFilesToSearch: ReadonlyArray<SourceFile>): DocumentHighlights[] | undefined;
}
declare namespace ts {
  /**
   * The document registry represents a store of SourceFile objects that can be shared between
   * multiple LanguageService instances. A LanguageService instance holds on the SourceFile (AST)
   * of files in the context.
   * SourceFile objects account for most of the memory usage by the language service. Sharing
   * the same DocumentRegistry instance between different instances of LanguageService allow
   * for more efficient memory utilization since all projects will share at least the library
   * file (lib.d.ts).
   *
   * A more advanced use of the document registry is to serialize sourceFile objects to disk
   * and re-hydrate them when needed.
   *
   * To create a default DocumentRegistry, use createDocumentRegistry to create one, and pass it
   * to all subsequent createLanguageService calls.
   */
  interface DocumentRegistry {
    /**
     * Request a stored SourceFile with a given fileName and compilationSettings.
     * The first call to acquire will call createLanguageServiceSourceFile to generate
     * the SourceFile if was not found in the registry.
     *
     * @param fileName The name of the file requested
     * @param compilationSettings Some compilation settings like target affects the
     * shape of a the resulting SourceFile. This allows the DocumentRegistry to store
     * multiple copies of the same file for different compilation settings.
     * @param scriptSnapshot Text of the file. Only used if the file was not found
     * in the registry and a new one was created.
     * @param version Current version of the file. Only used if the file was not found
     * in the registry and a new one was created.
     */
    acquireDocument(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
    acquireDocumentWithKey(fileName: string, path: Path, compilationSettings: CompilerOptions, key: DocumentRegistryBucketKey, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
    /**
     * Request an updated version of an already existing SourceFile with a given fileName
     * and compilationSettings. The update will in-turn call updateLanguageServiceSourceFile
     * to get an updated SourceFile.
     *
     * @param fileName The name of the file requested
     * @param compilationSettings Some compilation settings like target affects the
     * shape of a the resulting SourceFile. This allows the DocumentRegistry to store
     * multiple copies of the same file for different compilation settings.
     * @param scriptSnapshot Text of the file.
     * @param version Current version of the file.
     */
    updateDocument(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
    updateDocumentWithKey(fileName: string, path: Path, compilationSettings: CompilerOptions, key: DocumentRegistryBucketKey, scriptSnapshot: IScriptSnapshot, version: string, scriptKind?: ScriptKind): SourceFile;
    getKeyForCompilationSettings(settings: CompilerOptions): DocumentRegistryBucketKey;
    /**
     * Informs the DocumentRegistry that a file is not needed any longer.
     *
     * Note: It is not allowed to call release on a SourceFile that was not acquired from
     * this registry originally.
     *
     * @param fileName The name of the file to be released
     * @param compilationSettings The compilation settings used to acquire the file
     */
    releaseDocument(fileName: string, compilationSettings: CompilerOptions): void;
    releaseDocumentWithKey(path: Path, key: DocumentRegistryBucketKey): void;
    getLanguageServiceRefCounts(path: Path): [string, number | undefined][];
    reportStats(): string;
  }
  interface ExternalDocumentCache {
    setDocument(key: DocumentRegistryBucketKey, path: Path, sourceFile: SourceFile): void;
    getDocument(key: DocumentRegistryBucketKey, path: Path): SourceFile | undefined;
  }
  type DocumentRegistryBucketKey = string & {
    __bucketKey: any;
  };
  function createDocumentRegistry(useCaseSensitiveFileNames?: boolean, currentDirectory?: string): DocumentRegistry;
  function createDocumentRegistryInternal(useCaseSensitiveFileNames?: boolean, currentDirectory?: string, externalCache?: ExternalDocumentCache): DocumentRegistry;
}
declare namespace ts.FindAllReferences {
  interface ImportsResult {
    /** For every import of the symbol, the location and local symbol for the import. */
    importSearches: ReadonlyArray<[Identifier, Symbol]>;
    /** For rename imports/exports `{ foo as bar }`, `foo` is not a local, so it may be added as a reference immediately without further searching. */
    singleReferences: ReadonlyArray<Identifier | StringLiteral>;
    /** List of source files that may (or may not) use the symbol via a namespace. (For UMD modules this is every file.) */
    indirectUsers: ReadonlyArray<SourceFile>;
  }
  type ImportTracker = (exportSymbol: Symbol, exportInfo: ExportInfo, isForRename: boolean) => ImportsResult;
  /** Creates the imports map and returns an ImportTracker that uses it. Call this lazily to avoid calling `getDirectImportsMap` unnecessarily.  */
  function createImportTracker(sourceFiles: ReadonlyArray<SourceFile>, sourceFilesSet: ReadonlyMap<true>, checker: TypeChecker, cancellationToken: CancellationToken | undefined): ImportTracker;
  /** Info about an exported symbol to perform recursive search on. */
  interface ExportInfo {
    exportingModuleSymbol: Symbol;
    exportKind: ExportKind;
  }
  enum ExportKind {
    Named = 0,
    Default = 1,
    ExportEquals = 2
  }
  enum ImportExport {
    Import = 0,
    Export = 1
  }
  type ModuleReference =
  /** "import" also includes require() calls. */
    {
      kind: "import";
      literal: StringLiteralLike;
    }
    /** <reference path> or <reference types> */
    | {
    kind: "reference";
    referencingFile: SourceFile;
    ref: FileReference;
  };
  function findModuleReferences(program: Program, sourceFiles: ReadonlyArray<SourceFile>, searchModuleSymbol: Symbol): ModuleReference[];
  interface ImportedSymbol {
    kind: ImportExport.Import;
    symbol: Symbol;
  }
  interface ExportedSymbol {
    kind: ImportExport.Export;
    symbol: Symbol;
    exportInfo: ExportInfo;
  }
  /**
   * Given a local reference, we might notice that it's an import/export and recursively search for references of that.
   * If at an import, look locally for the symbol it imports.
   * If at an export, look for all imports of it.
   * This doesn't handle export specifiers; that is done in `getReferencesAtExportSpecifier`.
   * @param comingFromExport If we are doing a search for all exports, don't bother looking backwards for the imported symbol, since that's the reason we're here.
   */
  function getImportOrExportSymbol(node: Node, symbol: Symbol, checker: TypeChecker, comingFromExport: boolean): ImportedSymbol | ExportedSymbol | undefined;
  function getExportInfo(exportSymbol: Symbol, exportKind: ExportKind, checker: TypeChecker): ExportInfo | undefined;
}
declare namespace ts.FindAllReferences {
  interface SymbolAndEntries {
    readonly definition: Definition | undefined;
    readonly references: ReadonlyArray<Entry>;
  }
  enum DefinitionKind {
    Symbol = 0,
    Label = 1,
    Keyword = 2,
    This = 3,
    String = 4
  }
  type Definition = {
    readonly type: DefinitionKind.Symbol;
    readonly symbol: Symbol;
  } | {
    readonly type: DefinitionKind.Label;
    readonly node: Identifier;
  } | {
    readonly type: DefinitionKind.Keyword;
    readonly node: Node;
  } | {
    readonly type: DefinitionKind.This;
    readonly node: Node;
  } | {
    readonly type: DefinitionKind.String;
    readonly node: StringLiteral;
  };
  enum EntryKind {
    Span = 0,
    Node = 1,
    StringLiteral = 2,
    SearchedLocalFoundProperty = 3,
    SearchedPropertyFoundLocal = 4
  }
  type NodeEntryKind = EntryKind.Node | EntryKind.StringLiteral | EntryKind.SearchedLocalFoundProperty | EntryKind.SearchedPropertyFoundLocal;
  type Entry = NodeEntry | SpanEntry;
  interface ContextWithStartAndEndNode {
    start: Node;
    end: Node;
  }
  type ContextNode = Node | ContextWithStartAndEndNode;
  interface NodeEntry {
    readonly kind: NodeEntryKind;
    readonly node: Node;
    readonly context?: ContextNode;
  }
  interface SpanEntry {
    readonly kind: EntryKind.Span;
    readonly fileName: string;
    readonly textSpan: TextSpan;
  }
  function nodeEntry(node: Node, kind?: NodeEntryKind): NodeEntry;
  function isContextWithStartAndEndNode(node: ContextNode): node is ContextWithStartAndEndNode;
  function getContextNode(node: NamedDeclaration | BinaryExpression | ForInOrOfStatement | undefined): ContextNode | undefined;
  function toContextSpan(textSpan: TextSpan, sourceFile: SourceFile, context?: ContextNode): {
    contextSpan: TextSpan;
  } | undefined;
  interface Options {
    readonly findInStrings?: boolean;
    readonly findInComments?: boolean;
    /**
     * True if we are renaming the symbol.
     * If so, we will find fewer references -- if it is referenced by several different names, we still only find references for the original name.
     */
    readonly isForRename?: boolean;
    /** True if we are searching for implementations. We will have a different method of adding references if so. */
    readonly implementations?: boolean;
    /**
     * True to opt in for enhanced renaming of shorthand properties and import/export specifiers.
     * The options controls the behavior for the whole rename operation; it cannot be changed on a per-file basis.
     * Default is false for backwards compatibility.
     */
    readonly providePrefixAndSuffixTextForRename?: boolean;
  }
  function findReferencedSymbols(program: Program, cancellationToken: CancellationToken, sourceFiles: ReadonlyArray<SourceFile>, sourceFile: SourceFile, position: number): ReferencedSymbol[] | undefined;
  function getImplementationsAtPosition(program: Program, cancellationToken: CancellationToken, sourceFiles: ReadonlyArray<SourceFile>, sourceFile: SourceFile, position: number): ImplementationLocation[] | undefined;
  function findReferenceOrRenameEntries<T>(program: Program, cancellationToken: CancellationToken, sourceFiles: ReadonlyArray<SourceFile>, node: Node, position: number, options: Options | undefined, convertEntry: ToReferenceOrRenameEntry<T>): T[] | undefined;
  type ToReferenceOrRenameEntry<T> = (entry: Entry, originalNode: Node, checker: TypeChecker) => T;
  function getReferenceEntriesForNode(position: number, node: Node, program: Program, sourceFiles: ReadonlyArray<SourceFile>, cancellationToken: CancellationToken, options?: Options, sourceFilesSet?: ReadonlyMap<true>): ReadonlyArray<Entry> | undefined;
  function toRenameLocation(entry: Entry, originalNode: Node, checker: TypeChecker, providePrefixAndSuffixText: boolean): RenameLocation;
  function toReferenceEntry(entry: Entry): ReferenceEntry;
  function toHighlightSpan(entry: Entry): {
    fileName: string;
    span: HighlightSpan;
  };
  function getTextSpanOfEntry(entry: Entry): TextSpan;
}
/** Encapsulates the core find-all-references algorithm. */
declare namespace ts.FindAllReferences.Core {
  /** Core find-all-references algorithm. Handles special cases before delegating to `getReferencedSymbolsForSymbol`. */
  function getReferencedSymbolsForNode(position: number, node: Node, program: Program, sourceFiles: ReadonlyArray<SourceFile>, cancellationToken: CancellationToken, options?: Options, sourceFilesSet?: ReadonlyMap<true>): ReadonlyArray<SymbolAndEntries> | undefined;
  function eachExportReference(sourceFiles: ReadonlyArray<SourceFile>, checker: TypeChecker, cancellationToken: CancellationToken | undefined, exportSymbol: Symbol, exportingModuleSymbol: Symbol, exportName: string, isDefaultExport: boolean, cb: (ref: Identifier) => void): void;
  /** Used as a quick check for whether a symbol is used at all in a file (besides its definition). */
  function isSymbolReferencedInFile(definition: Identifier, checker: TypeChecker, sourceFile: SourceFile): boolean;
  function eachSymbolReferenceInFile<T>(definition: Identifier, checker: TypeChecker, sourceFile: SourceFile, cb: (token: Identifier) => T): T | undefined;
  function eachSignatureCall(signature: SignatureDeclaration, sourceFiles: ReadonlyArray<SourceFile>, checker: TypeChecker, cb: (call: CallExpression) => void): void;
  /**
   * Given an initial searchMeaning, extracted from a location, widen the search scope based on the declarations
   * of the corresponding symbol. e.g. if we are searching for "Foo" in value position, but "Foo" references a class
   * then we need to widen the search to include type positions as well.
   * On the contrary, if we are searching for "Bar" in type position and we trace bar to an interface, and an uninstantiated
   * module, we want to keep the search limited to only types, as the two declarations (interface and uninstantiated module)
   * do not intersect in any of the three spaces.
   */
  function getIntersectingMeaningFromDeclarations(node: Node, symbol: Symbol): SemanticMeaning;
  function getReferenceEntriesForShorthandPropertyAssignment(node: Node, checker: TypeChecker, addReference: (node: Node) => void): void;
}
declare namespace ts {
  export function getEditsForFileRename(program: Program, oldFileOrDirPath: string, newFileOrDirPath: string, host: LanguageServiceHost, formatContext: formatting.FormatContext, _preferences: UserPreferences, sourceMapper: SourceMapper): ReadonlyArray<FileTextChanges>;
  /** If 'path' refers to an old directory, returns path in the new directory. */
  type PathUpdater = (path: string) => string | undefined;
  export function getPathUpdater(oldFileOrDirPath: string, newFileOrDirPath: string, getCanonicalFileName: GetCanonicalFileName, sourceMapper: SourceMapper | undefined): PathUpdater;
  export {};
}
declare namespace ts.GoToDefinition {
  function getDefinitionAtPosition(program: Program, sourceFile: SourceFile, position: number): ReadonlyArray<DefinitionInfo> | undefined;
  function getReferenceAtPosition(sourceFile: SourceFile, position: number, program: Program): {
    fileName: string;
    file: SourceFile;
  } | undefined;
  function getTypeDefinitionAtPosition(typeChecker: TypeChecker, sourceFile: SourceFile, position: number): ReadonlyArray<DefinitionInfo> | undefined;
  function getDefinitionAndBoundSpan(program: Program, sourceFile: SourceFile, position: number): DefinitionInfoAndBoundSpan | undefined;
  function findReferenceInPosition(refs: ReadonlyArray<FileReference>, pos: number): FileReference | undefined;
}
declare namespace ts.JsDoc {
  function getJsDocCommentsFromDeclarations(declarations: ReadonlyArray<Declaration>): SymbolDisplayPart[];
  function getJsDocTagsFromDeclarations(declarations?: Declaration[]): JSDocTagInfo[];
  function getJSDocTagNameCompletions(): CompletionEntry[];
  const getJSDocTagNameCompletionDetails: typeof getJSDocTagCompletionDetails;
  function getJSDocTagCompletions(): CompletionEntry[];
  function getJSDocTagCompletionDetails(name: string): CompletionEntryDetails;
  function getJSDocParameterNameCompletions(tag: JSDocParameterTag): CompletionEntry[];
  function getJSDocParameterNameCompletionDetails(name: string): CompletionEntryDetails;
  /**
   * Checks if position points to a valid position to add JSDoc comments, and if so,
   * returns the appropriate template. Otherwise returns an empty string.
   * Valid positions are
   *      - outside of comments, statements, and expressions, and
   *      - preceding a:
   *          - function/constructor/method declaration
   *          - class declarations
   *          - variable statements
   *          - namespace declarations
   *          - interface declarations
   *          - method signatures
   *          - type alias declarations
   *
   * Hosts should ideally check that:
   * - The line is all whitespace up to 'position' before performing the insertion.
   * - If the keystroke sequence "/\*\*" induced the call, we also check that the next
   * non-whitespace character is '*', which (approximately) indicates whether we added
   * the second '*' to complete an existing (JSDoc) comment.
   * @param fileName The file in which to perform the check.
   * @param position The (character-indexed) position in the file where the check should
   * be performed.
   */
  function getDocCommentTemplateAtPosition(newLine: string, sourceFile: SourceFile, position: number): TextInsertion | undefined;
}
declare namespace ts.NavigateTo {
  function getNavigateToItems(sourceFiles: ReadonlyArray<SourceFile>, checker: TypeChecker, cancellationToken: CancellationToken, searchValue: string, maxResultCount: number | undefined, excludeDtsFiles: boolean): NavigateToItem[];
}
declare namespace ts.NavigationBar {
  function getNavigationBarItems(sourceFile: SourceFile, cancellationToken: CancellationToken): NavigationBarItem[];
  function getNavigationTree(sourceFile: SourceFile, cancellationToken: CancellationToken): NavigationTree;
}
declare namespace ts.OrganizeImports {
  /**
   * Organize imports by:
   *   1) Removing unused imports
   *   2) Coalescing imports from the same module
   *   3) Sorting imports
   */
  function organizeImports(sourceFile: SourceFile, formatContext: formatting.FormatContext, host: LanguageServiceHost, program: Program, _preferences: UserPreferences): FileTextChanges[];
  /**
   * @param importGroup a list of ImportDeclarations, all with the same module name.
   */
  function coalesceImports(importGroup: ReadonlyArray<ImportDeclaration>): readonly ImportDeclaration[];
  /**
   * @param exportGroup a list of ExportDeclarations, all with the same module name.
   */
  function coalesceExports(exportGroup: ReadonlyArray<ExportDeclaration>): readonly ExportDeclaration[];
  function compareModuleSpecifiers(m1: Expression, m2: Expression): Comparison;
}
declare namespace ts.OutliningElementsCollector {
  function collectElements(sourceFile: SourceFile, cancellationToken: CancellationToken): OutliningSpan[];
}
declare namespace ts {
  enum PatternMatchKind {
    exact = 0,
    prefix = 1,
    substring = 2,
    camelCase = 3
  }
  interface PatternMatch {
    kind: PatternMatchKind;
    isCaseSensitive: boolean;
  }
  interface PatternMatcher {
    getMatchForLastSegmentOfPattern(candidate: string): PatternMatch | undefined;
    getFullMatch(candidateContainers: ReadonlyArray<string>, candidate: string): PatternMatch | undefined;
    patternContainsDots: boolean;
  }
  function createPatternMatcher(pattern: string): PatternMatcher | undefined;
  function breakIntoCharacterSpans(identifier: string): TextSpan[];
  function breakIntoWordSpans(identifier: string): TextSpan[];
}
declare namespace ts {
  function preProcessFile(sourceText: string, readImportFiles?: boolean, detectJavaScriptImports?: boolean): PreProcessedFileInfo;
}
declare namespace ts.Rename {
  function getRenameInfo(program: Program, sourceFile: SourceFile, position: number, options?: RenameInfoOptions): RenameInfo;
}
declare namespace ts.SmartSelectionRange {
  function getSmartSelectionRange(pos: number, sourceFile: SourceFile): SelectionRange;
}
declare namespace ts.SignatureHelp {
  function getSignatureHelpItems(program: Program, sourceFile: SourceFile, position: number, triggerReason: SignatureHelpTriggerReason | undefined, cancellationToken: CancellationToken): SignatureHelpItems | undefined;
  interface ArgumentInfoForCompletions {
    readonly invocation: CallLikeExpression;
    readonly argumentIndex: number;
    readonly argumentCount: number;
  }
  function getArgumentInfoForCompletions(node: Node, position: number, sourceFile: SourceFile): ArgumentInfoForCompletions | undefined;
}
declare namespace ts {
  interface SourceMapper {
    toLineColumnOffset(fileName: string, position: number): LineAndCharacter;
    tryGetSourcePosition(info: DocumentPosition): DocumentPosition | undefined;
    tryGetGeneratedPosition(info: DocumentPosition): DocumentPosition | undefined;
    clearCache(): void;
  }
  interface SourceMapperHost {
    useCaseSensitiveFileNames(): boolean;
    getCurrentDirectory(): string;
    getProgram(): Program | undefined;
    fileExists?(path: string): boolean;
    readFile?(path: string, encoding?: string): string | undefined;
    getSourceFileLike?(fileName: string): SourceFileLike | undefined;
    getDocumentPositionMapper?(generatedFileName: string, sourceFileName?: string): DocumentPositionMapper | undefined;
    log(s: string): void;
  }
  function getSourceMapper(host: SourceMapperHost): SourceMapper;
  /**
   * string | undefined to contents of map file to create DocumentPositionMapper from it
   * DocumentPositionMapper | false to give back cached DocumentPositionMapper
   */
  type ReadMapFile = (mapFileName: string, mapFileNameFromDts: string | undefined) => string | undefined | DocumentPositionMapper | false;
  function getDocumentPositionMapper(host: DocumentPositionMapperHost, generatedFileName: string, generatedFileLineInfo: LineInfo, readMapFile: ReadMapFile): DocumentPositionMapper | undefined;
}
declare namespace ts {
  function computeSuggestionDiagnostics(sourceFile: SourceFile, program: Program, cancellationToken: CancellationToken): DiagnosticWithLocation[];
  function isReturnStatementWithFixablePromiseHandler(node: Node): node is ReturnStatement;
  function isFixablePromiseHandler(node: Node): boolean;
}
declare namespace ts.SymbolDisplay {
  function getSymbolKind(typeChecker: TypeChecker, symbol: Symbol, location: Node): ScriptElementKind;
  function getSymbolModifiers(symbol: Symbol): string;
  interface SymbolDisplayPartsDocumentationAndSymbolKind {
    displayParts: SymbolDisplayPart[];
    documentation: SymbolDisplayPart[];
    symbolKind: ScriptElementKind;
    tags: JSDocTagInfo[] | undefined;
  }
  function getSymbolDisplayPartsDocumentationAndSymbolKind(typeChecker: TypeChecker, symbol: Symbol, sourceFile: SourceFile, enclosingDeclaration: Node | undefined, location: Node, semanticMeaning?: SemanticMeaning, alias?: Symbol): SymbolDisplayPartsDocumentationAndSymbolKind;
}
declare namespace ts {
  interface TranspileOptions {
    compilerOptions?: CompilerOptions;
    fileName?: string;
    reportDiagnostics?: boolean;
    moduleName?: string;
    renamedDependencies?: MapLike<string>;
    transformers?: CustomTransformers;
  }
  interface TranspileOutput {
    outputText: string;
    diagnostics?: Diagnostic[];
    sourceMapText?: string;
  }
  function transpileModule(input: string, transpileOptions: TranspileOptions): TranspileOutput;
  function transpile(input: string, compilerOptions?: CompilerOptions, fileName?: string, diagnostics?: Diagnostic[], moduleName?: string): string;
  /** JS users may pass in string values for enum compiler options (such as ModuleKind), so convert. */
  function fixupCompilerOptions(options: CompilerOptions, diagnostics: Diagnostic[]): CompilerOptions;
}
declare namespace ts.formatting {
  enum FormattingRequestKind {
    FormatDocument = 0,
    FormatSelection = 1,
    FormatOnEnter = 2,
    FormatOnSemicolon = 3,
    FormatOnOpeningCurlyBrace = 4,
    FormatOnClosingCurlyBrace = 5
  }
  class FormattingContext {
    readonly sourceFile: SourceFileLike;
    formattingRequestKind: FormattingRequestKind;
    options: FormatCodeSettings;
    currentTokenSpan: TextRangeWithKind;
    nextTokenSpan: TextRangeWithKind;
    contextNode: Node;
    currentTokenParent: Node;
    nextTokenParent: Node;
    private contextNodeAllOnSameLine;
    private nextNodeAllOnSameLine;
    private tokensAreOnSameLine;
    private contextNodeBlockIsOnOneLine;
    private nextNodeBlockIsOnOneLine;
    constructor(sourceFile: SourceFileLike, formattingRequestKind: FormattingRequestKind, options: FormatCodeSettings);
    updateContext(currentRange: TextRangeWithKind, currentTokenParent: Node, nextRange: TextRangeWithKind, nextTokenParent: Node, commonParent: Node): void;
    ContextNodeAllOnSameLine(): boolean;
    NextNodeAllOnSameLine(): boolean;
    TokensAreOnSameLine(): boolean;
    ContextNodeBlockIsOnOneLine(): boolean;
    NextNodeBlockIsOnOneLine(): boolean;
    private NodeIsOnOneLine;
    private BlockIsOnOneLine;
  }
}
declare namespace ts.formatting {
  interface FormattingScanner {
    advance(): void;
    isOnToken(): boolean;
    readTokenInfo(n: Node): TokenInfo;
    getCurrentLeadingTrivia(): TextRangeWithKind[] | undefined;
    lastTrailingTriviaWasNewLine(): boolean;
    skipToEndOf(node: Node): void;
  }
  function getFormattingScanner<T>(text: string, languageVariant: LanguageVariant, startPos: number, endPos: number, cb: (scanner: FormattingScanner) => T): T;
}
declare namespace ts.formatting {
  interface Rule {
    readonly debugName: string;
    readonly context: ReadonlyArray<ContextPredicate>;
    readonly action: RuleAction;
    readonly flags: RuleFlags;
  }
  type ContextPredicate = (context: FormattingContext) => boolean;
  const anyContext: ReadonlyArray<ContextPredicate>;
  enum RuleAction {
    Ignore = 1,
    Space = 2,
    NewLine = 4,
    Delete = 8
  }
  enum RuleFlags {
    None = 0,
    CanDeleteNewLines = 1
  }
  interface TokenRange {
    readonly tokens: ReadonlyArray<SyntaxKind>;
    readonly isSpecific: boolean;
  }
}
declare namespace ts.formatting {
  interface RuleSpec {
    readonly leftTokenRange: TokenRange;
    readonly rightTokenRange: TokenRange;
    readonly rule: Rule;
  }
  function getAllRules(): RuleSpec[];
}
declare namespace ts.formatting {
  function getFormatContext(options: FormatCodeSettings): FormatContext;
  type RulesMap = (context: FormattingContext) => Rule | undefined;
  enum RulesPosition {
    IgnoreRulesSpecific = 0,
    IgnoreRulesAny,
    ContextRulesSpecific,
    ContextRulesAny,
    NoContextRulesSpecific,
    NoContextRulesAny
  }
}
declare namespace ts.formatting {
  interface FormatContext {
    readonly options: FormatCodeSettings;
    readonly getRule: RulesMap;
  }
  interface TextRangeWithKind extends TextRange {
    kind: SyntaxKind;
  }
  interface TextRangeWithTriviaKind extends TextRange {
    kind: TriviaKind;
  }
  interface TokenInfo {
    leadingTrivia: TextRangeWithTriviaKind[] | undefined;
    token: TextRangeWithKind;
    trailingTrivia: TextRangeWithTriviaKind[] | undefined;
  }
  function formatOnEnter(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
  function formatOnSemicolon(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
  function formatOnOpeningCurly(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
  function formatOnClosingCurly(position: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
  function formatDocument(sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
  function formatSelection(start: number, end: number, sourceFile: SourceFile, formatContext: FormatContext): TextChange[];
  function formatNodeGivenIndentation(node: Node, sourceFileLike: SourceFileLike, languageVariant: LanguageVariant, initialIndentation: number, delta: number, formatContext: FormatContext): TextChange[];
  /**
   * @param precedingToken pass `null` if preceding token was already computed and result was `undefined`.
   */
  function getRangeOfEnclosingComment(sourceFile: SourceFile, position: number, precedingToken?: Node | null, // tslint:disable-line:no-null-keyword
                                      tokenAtPosition?: Node): CommentRange | undefined;
  function getIndentationString(indentation: number, options: EditorSettings): string;
}
declare namespace ts.formatting {
  namespace SmartIndenter {
    /**
     * @param assumeNewLineBeforeCloseBrace
     * `false` when called on text from a real source file.
     * `true` when we need to assume `position` is on a newline.
     *
     * This is useful for codefixes. Consider
     * ```
     * function f() {
     * |}
     * ```
     * with `position` at `|`.
     *
     * When inserting some text after an open brace, we would like to get indentation as if a newline was already there.
     * By default indentation at `position` will be 0 so 'assumeNewLineBeforeCloseBrace' overrides this behavior.
     */
    function getIndentation(position: number, sourceFile: SourceFile, options: EditorSettings, assumeNewLineBeforeCloseBrace?: boolean): number;
    function getIndentationForNode(n: Node, ignoreActualIndentationRange: TextRange, sourceFile: SourceFile, options: EditorSettings): number;
    function getBaseIndentation(options: EditorSettings): number;
    function isArgumentAndStartLineOverlapsExpressionBeingCalled(parent: Node, child: Node, childStartLine: number, sourceFile: SourceFileLike): boolean;
    function childStartsOnTheSameLineWithElseInIfStatement(parent: Node, child: TextRangeWithKind, childStartLine: number, sourceFile: SourceFileLike): boolean;
    function argumentStartsOnSameLineAsPreviousArgument(parent: Node, child: TextRangeWithKind, childStartLine: number, sourceFile: SourceFileLike): boolean;
    function getContainingList(node: Node, sourceFile: SourceFile): NodeArray<Node> | undefined;
    /**
     * Character is the actual index of the character since the beginning of the line.
     * Column - position of the character after expanding tabs to spaces.
     * "0\t2$"
     * value of 'character' for '$' is 3
     * value of 'column' for '$' is 6 (assuming that tab size is 4)
     */
    function findFirstNonWhitespaceCharacterAndColumn(startPos: number, endPos: number, sourceFile: SourceFileLike, options: EditorSettings): {
      column: number;
      character: number;
    };
    function findFirstNonWhitespaceColumn(startPos: number, endPos: number, sourceFile: SourceFileLike, options: EditorSettings): number;
    function nodeWillIndentChild(settings: FormatCodeSettings, parent: TextRangeWithKind, child: TextRangeWithKind | undefined, sourceFile: SourceFileLike | undefined, indentByDefault: boolean): boolean;
    /**
     * True when the parent node should indent the given child by an explicit rule.
     * @param isNextChild If true, we are judging indent of a hypothetical child *after* this one, not the current child.
     */
    function shouldIndentChildNode(settings: FormatCodeSettings, parent: TextRangeWithKind, child?: Node, sourceFile?: SourceFileLike, isNextChild?: boolean): boolean;
  }
}
declare namespace ts.textChanges {
  interface ConfigurableStart {
    leadingTriviaOption?: LeadingTriviaOption;
  }
  interface ConfigurableEnd {
    trailingTriviaOption?: TrailingTriviaOption;
  }
  enum LeadingTriviaOption {
    /** Exclude all leading trivia (use getStart()) */
    Exclude = 0,
    /** Include leading trivia and,
     * if there are no line breaks between the node and the previous token,
     * include all trivia between the node and the previous token
     */
    IncludeAll = 1
  }
  enum TrailingTriviaOption {
    /** Exclude all trailing trivia (use getEnd()) */
    Exclude = 0,
    /** Include trailing trivia */
    Include = 1
  }
  /**
   * Usually node.pos points to a position immediately after the previous token.
   * If this position is used as a beginning of the span to remove - it might lead to removing the trailing trivia of the previous node, i.e:
   * const x; // this is x
   *        ^ - pos for the next variable declaration will point here
   * const y; // this is y
   *        ^ - end for previous variable declaration
   * Usually leading trivia of the variable declaration 'y' should not include trailing trivia (whitespace, comment 'this is x' and newline) from the preceding
   * variable declaration and trailing trivia for 'y' should include (whitespace, comment 'this is y', newline).
   * By default when removing nodes we adjust start and end positions to respect specification of the trivia above.
   * If pos\end should be interpreted literally (that is, withouth including leading and trailing trivia), `leadingTriviaOption` should be set to `LeadingTriviaOption.Exclude`
   * and `trailingTriviaOption` to `TrailingTriviaOption.Exclude`.
   */
  interface ConfigurableStartEnd extends ConfigurableStart, ConfigurableEnd {
  }
  interface InsertNodeOptions {
    /**
     * Text to be inserted before the new node
     */
    prefix?: string;
    /**
     * Text to be inserted after the new node
     */
    suffix?: string;
    /**
     * Text of inserted node will be formatted with this indentation, otherwise indentation will be inferred from the old node
     */
    indentation?: number;
    /**
     * Text of inserted node will be formatted with this delta, otherwise delta will be inferred from the new node kind
     */
    delta?: number;
    /**
     * Do not trim leading white spaces in the edit range
     */
    preserveLeadingWhitespace?: boolean;
  }
  interface ReplaceWithMultipleNodesOptions extends InsertNodeOptions {
    readonly joiner?: string;
  }
  interface ChangeNodeOptions extends ConfigurableStartEnd, InsertNodeOptions {
  }
  interface TextChangesContext {
    host: LanguageServiceHost;
    formatContext: formatting.FormatContext;
  }
  type TypeAnnotatable = SignatureDeclaration | VariableDeclaration | ParameterDeclaration | PropertyDeclaration | PropertySignature;
  type ThisTypeAnnotatable = FunctionDeclaration | FunctionExpression;
  function isThisTypeAnnotatable(containingFunction: FunctionLike): containingFunction is ThisTypeAnnotatable;
  class ChangeTracker {
    private readonly newLineCharacter;
    private readonly formatContext;
    private readonly changes;
    private readonly newFiles;
    private readonly classesWithNodesInsertedAtStart;
    private readonly deletedNodes;
    static fromContext(context: TextChangesContext): ChangeTracker;
    static with(context: TextChangesContext, cb: (tracker: ChangeTracker) => void): FileTextChanges[];
    /** Public for tests only. Other callers should use `ChangeTracker.with`. */
    constructor(newLineCharacter: string, formatContext: formatting.FormatContext);
    deleteRange(sourceFile: SourceFile, range: TextRange): void;
    delete(sourceFile: SourceFile, node: Node | NodeArray<TypeParameterDeclaration>): void;
    deleteModifier(sourceFile: SourceFile, modifier: Modifier): void;
    deleteNodeRange(sourceFile: SourceFile, startNode: Node, endNode: Node, options?: ConfigurableStartEnd): void;
    deleteNodeRangeExcludingEnd(sourceFile: SourceFile, startNode: Node, afterEndNode: Node | undefined, options?: ConfigurableStartEnd): void;
    replaceRange(sourceFile: SourceFile, range: TextRange, newNode: Node, options?: InsertNodeOptions): void;
    replaceNode(sourceFile: SourceFile, oldNode: Node, newNode: Node, options?: ChangeNodeOptions): void;
    replaceNodeRange(sourceFile: SourceFile, startNode: Node, endNode: Node, newNode: Node, options?: ChangeNodeOptions): void;
    private replaceRangeWithNodes;
    replaceNodeWithNodes(sourceFile: SourceFile, oldNode: Node, newNodes: ReadonlyArray<Node>, options?: ChangeNodeOptions): void;
    replaceNodeWithText(sourceFile: SourceFile, oldNode: Node, text: string): void;
    replaceNodeRangeWithNodes(sourceFile: SourceFile, startNode: Node, endNode: Node, newNodes: ReadonlyArray<Node>, options?: ReplaceWithMultipleNodesOptions & ConfigurableStartEnd): void;
    private nextCommaToken;
    replacePropertyAssignment(sourceFile: SourceFile, oldNode: PropertyAssignment, newNode: PropertyAssignment): void;
    insertNodeAt(sourceFile: SourceFile, pos: number, newNode: Node, options?: InsertNodeOptions): void;
    private insertNodesAt;
    insertNodeAtTopOfFile(sourceFile: SourceFile, newNode: Statement, blankLineBetween: boolean): void;
    insertNodeBefore(sourceFile: SourceFile, before: Node, newNode: Node, blankLineBetween?: boolean): void;
    insertModifierBefore(sourceFile: SourceFile, modifier: SyntaxKind, before: Node): void;
    insertLastModifierBefore(sourceFile: SourceFile, modifier: SyntaxKind, before: Node): void;
    insertCommentBeforeLine(sourceFile: SourceFile, lineNumber: number, position: number, commentText: string): void;
    insertJsdocCommentBefore(sourceFile: SourceFile, node: HasJSDoc, tag: JSDoc): void;
    replaceRangeWithText(sourceFile: SourceFile, range: TextRange, text: string): void;
    insertText(sourceFile: SourceFile, pos: number, text: string): void;
    /** Prefer this over replacing a node with another that has a type annotation, as it avoids reformatting the other parts of the node. */
    tryInsertTypeAnnotation(sourceFile: SourceFile, node: TypeAnnotatable, type: TypeNode): void;
    tryInsertThisTypeAnnotation(sourceFile: SourceFile, node: ThisTypeAnnotatable, type: TypeNode): void;
    insertTypeParameters(sourceFile: SourceFile, node: SignatureDeclaration, typeParameters: ReadonlyArray<TypeParameterDeclaration>): void;
    private getOptionsForInsertNodeBefore;
    insertNodeAtConstructorStart(sourceFile: SourceFile, ctr: ConstructorDeclaration, newStatement: Statement): void;
    insertNodeAtConstructorEnd(sourceFile: SourceFile, ctr: ConstructorDeclaration, newStatement: Statement): void;
    private replaceConstructorBody;
    insertNodeAtEndOfScope(sourceFile: SourceFile, scope: Node, newNode: Node): void;
    insertNodeAtClassStart(sourceFile: SourceFile, cls: ClassLikeDeclaration | InterfaceDeclaration, newElement: ClassElement): void;
    insertNodeAtObjectStart(sourceFile: SourceFile, obj: ObjectLiteralExpression, newElement: ObjectLiteralElementLike): void;
    private insertNodeAtStartWorker;
    private getInsertNodeAtStartPrefixSuffix;
    insertNodeAfterComma(sourceFile: SourceFile, after: Node, newNode: Node): void;
    insertNodeAfter(sourceFile: SourceFile, after: Node, newNode: Node): void;
    insertNodeAtEndOfList(sourceFile: SourceFile, list: NodeArray<Node>, newNode: Node): void;
    insertNodesAfter(sourceFile: SourceFile, after: Node, newNodes: ReadonlyArray<Node>): void;
    private insertNodeAfterWorker;
    private getInsertNodeAfterOptions;
    private getInsertNodeAfterOptionsWorker;
    insertName(sourceFile: SourceFile, node: FunctionExpression | ClassExpression | ArrowFunction, name: string): void;
    insertExportModifier(sourceFile: SourceFile, node: DeclarationStatement | VariableStatement): void;
    /**
     * This function should be used to insert nodes in lists when nodes don't carry separators as the part of the node range,
     * i.e. arguments in arguments lists, parameters in parameter lists etc.
     * Note that separators are part of the node in statements and class elements.
     */
    insertNodeInListAfter(sourceFile: SourceFile, after: Node, newNode: Node, containingList?: NodeArray<Node> | undefined): void;
    parenthesizeExpression(sourceFile: SourceFile, expression: Expression): void;
    private finishClassesWithNodesInsertedAtStart;
    private finishDeleteDeclarations;
    /**
     * Note: after calling this, the TextChanges object must be discarded!
     * @param validate only for tests
     *    The reason we must validate as part of this method is that `getNonFormattedText` changes the node's positions,
     *    so we can only call this once and can't get the non-formatted text separately.
     */
    getChanges(validate?: ValidateNonFormattedText): FileTextChanges[];
    createNewFile(oldFile: SourceFile | undefined, fileName: string, statements: ReadonlyArray<Statement>): void;
  }
  type ValidateNonFormattedText = (node: Node, text: string) => void;
  function getNewFileText(statements: ReadonlyArray<Statement>, scriptKind: ScriptKind, newLineCharacter: string, formatContext: formatting.FormatContext): string;
  function applyChanges(text: string, changes: ReadonlyArray<TextChange>): string;
  function isValidLocationToAddComment(sourceFile: SourceFile, position: number): boolean;
  /** Warning: This deletes comments too. See `copyComments` in `convertFunctionToEs6Class`. */
  function deleteNode(changes: ChangeTracker, sourceFile: SourceFile, node: Node, options?: ConfigurableStartEnd): void;
}
declare namespace ts {
  interface CodeFixRegistration {
    errorCodes: ReadonlyArray<number>;
    getCodeActions(context: CodeFixContext): CodeFixAction[] | undefined;
    fixIds?: ReadonlyArray<string>;
    getAllCodeActions?(context: CodeFixAllContext): CombinedCodeActions;
  }
  interface CodeFixContextBase extends textChanges.TextChangesContext {
    sourceFile: SourceFile;
    program: Program;
    cancellationToken: CancellationToken;
    preferences: UserPreferences;
  }
  interface CodeFixAllContext extends CodeFixContextBase {
    fixId: {};
  }
  interface CodeFixContext extends CodeFixContextBase {
    errorCode: number;
    span: TextSpan;
  }
  namespace codefix {
    type DiagnosticAndArguments = DiagnosticMessage | [DiagnosticMessage, string] | [DiagnosticMessage, string, string];
    function createCodeFixActionNoFixId(fixName: string, changes: FileTextChanges[], description: DiagnosticAndArguments): CodeFixAction;
    function createCodeFixAction(fixName: string, changes: FileTextChanges[], description: DiagnosticAndArguments, fixId: {}, fixAllDescription: DiagnosticAndArguments, command?: CodeActionCommand): CodeFixAction;
    function registerCodeFix(reg: CodeFixRegistration): void;
    function getSupportedErrorCodes(): string[];
    function getFixes(context: CodeFixContext): ReadonlyArray<CodeFixAction>;
    function getAllFixes(context: CodeFixAllContext): CombinedCodeActions;
    function createCombinedCodeActions(changes: FileTextChanges[], commands?: CodeActionCommand[]): CombinedCodeActions;
    function createFileTextChanges(fileName: string, textChanges: TextChange[]): FileTextChanges;
    function codeFixAll(context: CodeFixAllContext, errorCodes: number[], use: (changes: textChanges.ChangeTracker, error: DiagnosticWithLocation, commands: Push<CodeActionCommand>) => void): CombinedCodeActions;
    function eachDiagnostic({ program, sourceFile, cancellationToken }: CodeFixAllContext, errorCodes: ReadonlyArray<number>, cb: (diag: DiagnosticWithLocation) => void): void;
  }
}
declare namespace ts {
  interface Refactor {
    /** Compute the associated code actions */
    getEditsForAction(context: RefactorContext, actionName: string): RefactorEditInfo | undefined;
    /** Compute (quickly) which actions are available here */
    getAvailableActions(context: RefactorContext): ReadonlyArray<ApplicableRefactorInfo>;
  }
  interface RefactorContext extends textChanges.TextChangesContext {
    file: SourceFile;
    startPosition: number;
    endPosition?: number;
    program: Program;
    cancellationToken?: CancellationToken;
    preferences: UserPreferences;
  }
  namespace refactor {
    /** @param name An unique code associated with each refactor. Does not have to be human-readable. */
    function registerRefactor(name: string, refactor: Refactor): void;
    function getApplicableRefactors(context: RefactorContext): ApplicableRefactorInfo[];
    function getEditsForRefactor(context: RefactorContext, refactorName: string, actionName: string): RefactorEditInfo | undefined;
  }
  function getRefactorContextSpan({ startPosition, endPosition }: RefactorContext): TextSpan;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
  type DeclarationWithType = FunctionLikeDeclaration | VariableDeclaration | PropertySignature | PropertyDeclaration;
  function parameterShouldGetTypeFromJSDoc(node: Node): node is DeclarationWithType;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
  const importFixId = "fixMissingImport";
  enum ImportKind {
    Named = 0,
    Default = 1,
    Namespace = 2,
    Equals = 3,
    ConstEquals = 4
  }
  function getImportCompletionAction(exportedSymbol: Symbol, moduleSymbol: Symbol, sourceFile: SourceFile, symbolName: string, host: LanguageServiceHost, program: Program, formatContext: formatting.FormatContext, position: number, preferences: UserPreferences): {
    readonly moduleSpecifier: string;
    readonly codeAction: CodeAction;
  };
  function forEachExternalModuleToImportFrom(checker: TypeChecker, from: SourceFile, allSourceFiles: ReadonlyArray<SourceFile>, cb: (module: Symbol) => void): void;
  function moduleSymbolToValidIdentifier(moduleSymbol: Symbol, target: ScriptTarget): string;
  function moduleSpecifierToValidIdentifier(moduleSpecifier: string, target: ScriptTarget): string;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
  /**
   * Finds members of the resolved type that are missing in the class pointed to by class decl
   * and generates source code for the missing members.
   * @param possiblyMissingSymbols The collection of symbols to filter and then get insertions for.
   * @returns Empty string iff there are no member insertions.
   */
  function createMissingMemberNodes(classDeclaration: ClassLikeDeclaration, possiblyMissingSymbols: ReadonlyArray<Symbol>, context: TypeConstructionContext, preferences: UserPreferences, out: (node: ClassElement) => void): void;
  function getNoopSymbolTrackerWithResolver(context: TypeConstructionContext): SymbolTracker;
  interface TypeConstructionContext {
    program: Program;
    host: ModuleSpecifierResolutionHost;
  }
  function createMethodFromCallExpression(context: CodeFixContextBase, call: CallExpression, methodName: string, inJs: boolean, makeStatic: boolean, preferences: UserPreferences, contextNode: Node): MethodDeclaration;
  function setJsonCompilerOptionValue(changeTracker: textChanges.ChangeTracker, configFile: TsConfigSourceFile, optionName: string, optionValue: Expression): undefined;
  function createJsonPropertyAssignment(name: string, initializer: Expression): PropertyAssignment;
  function findJsonProperty(obj: ObjectLiteralExpression, name: string): PropertyAssignment | undefined;
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.codefix {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.extractSymbol {
  /**
   * Compute the associated code actions
   * Exported for tests.
   */
  function getAvailableActions(context: RefactorContext): ReadonlyArray<ApplicableRefactorInfo>;
  function getEditsForAction(context: RefactorContext, actionName: string): RefactorEditInfo | undefined;
  namespace Messages {
    const cannotExtractRange: DiagnosticMessage;
    const cannotExtractImport: DiagnosticMessage;
    const cannotExtractSuper: DiagnosticMessage;
    const cannotExtractEmpty: DiagnosticMessage;
    const expressionExpected: DiagnosticMessage;
    const uselessConstantType: DiagnosticMessage;
    const statementOrExpressionExpected: DiagnosticMessage;
    const cannotExtractRangeContainingConditionalBreakOrContinueStatements: DiagnosticMessage;
    const cannotExtractRangeContainingConditionalReturnStatement: DiagnosticMessage;
    const cannotExtractRangeContainingLabeledBreakOrContinueStatementWithTargetOutsideOfTheRange: DiagnosticMessage;
    const cannotExtractRangeThatContainsWritesToReferencesLocatedOutsideOfTheTargetRangeInGenerators: DiagnosticMessage;
    const typeWillNotBeVisibleInTheNewScope: DiagnosticMessage;
    const functionWillNotBeVisibleInTheNewScope: DiagnosticMessage;
    const cannotExtractIdentifier: DiagnosticMessage;
    const cannotExtractExportedEntity: DiagnosticMessage;
    const cannotWriteInExpression: DiagnosticMessage;
    const cannotExtractReadonlyPropertyInitializerOutsideConstructor: DiagnosticMessage;
    const cannotExtractAmbientBlock: DiagnosticMessage;
    const cannotAccessVariablesFromNestedScopes: DiagnosticMessage;
    const cannotExtractToOtherFunctionLike: DiagnosticMessage;
    const cannotExtractToJSClass: DiagnosticMessage;
    const cannotExtractToExpressionArrowFunction: DiagnosticMessage;
  }
  enum RangeFacts {
    None = 0,
    HasReturn = 1,
    IsGenerator = 2,
    IsAsyncFunction = 4,
    UsesThis = 8,
    /**
     * The range is in a function which needs the 'static' modifier in a class
     */
    InStaticRegion = 16
  }
  /**
   * Represents an expression or a list of statements that should be extracted with some extra information
   */
  interface TargetRange {
    readonly range: Expression | Statement[];
    readonly facts: RangeFacts;
    /**
     * A list of symbols that are declared in the selected range which are visible in the containing lexical scope
     * Used to ensure we don't turn something used outside the range free (or worse, resolve to a different entity).
     */
    readonly declarations: Symbol[];
  }
  /**
   * Result of 'getRangeToExtract' operation: contains either a range or a list of errors
   */
  type RangeToExtract = {
    readonly targetRange?: never;
    readonly errors: ReadonlyArray<Diagnostic>;
  } | {
    readonly targetRange: TargetRange;
    readonly errors?: never;
  };
  /**
   * getRangeToExtract takes a span inside a text file and returns either an expression or an array
   * of statements representing the minimum set of nodes needed to extract the entire span. This
   * process may fail, in which case a set of errors is returned instead (these are currently
   * not shown to the user, but can be used by us diagnostically)
   */
  function getRangeToExtract(sourceFile: SourceFile, span: TextSpan): RangeToExtract;
  enum Usage {
    Read = 1,
    Write = 2
  }
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.generateGetAccessorAndSetAccessor {
}
declare namespace ts.refactor {
}
declare namespace ts.refactor.addOrRemoveBracesToArrowFunction {
}
declare namespace ts.refactor.convertParamsToDestructuredObject {
}
declare namespace ts {
  /** The version of the language service API */
  const servicesVersion = "0.8";
  interface DisplayPartsSymbolWriter extends EmitTextWriter {
    displayParts(): SymbolDisplayPart[];
  }
  function toEditorSettings(options: FormatCodeOptions | FormatCodeSettings): FormatCodeSettings;
  function toEditorSettings(options: EditorOptions | EditorSettings): EditorSettings;
  function displayPartsToString(displayParts: SymbolDisplayPart[] | undefined): string;
  function getDefaultCompilerOptions(): CompilerOptions;
  function getSupportedCodeFixes(): string[];
  function createLanguageServiceSourceFile(fileName: string, scriptSnapshot: IScriptSnapshot, scriptTarget: ScriptTarget, version: string, setNodeParents: boolean, scriptKind?: ScriptKind): SourceFile;
  let disableIncrementalParsing: boolean;
  function updateLanguageServiceSourceFile(sourceFile: SourceFile, scriptSnapshot: IScriptSnapshot, version: string, textChangeRange: TextChangeRange | undefined, aggressiveChecks?: boolean): SourceFile;
  /** A cancellation that throttles calls to the host */
  class ThrottledCancellationToken implements CancellationToken {
    private hostCancellationToken;
    private readonly throttleWaitMilliseconds;
    private lastCancellationCheckTime;
    constructor(hostCancellationToken: HostCancellationToken, throttleWaitMilliseconds?: number);
    isCancellationRequested(): boolean;
    throwIfCancellationRequested(): void;
  }
  function createLanguageService(host: LanguageServiceHost, documentRegistry?: DocumentRegistry, syntaxOnly?: boolean): LanguageService;
  /** Names in the name table are escaped, so an identifier `__foo` will have a name table entry `___foo`. */
  function getNameTable(sourceFile: SourceFile): UnderscoreEscapedMap<number>;
  /**
   * Returns the containing object literal property declaration given a possible name node, e.g. "a" in x = { "a": 1 }
   */
  function getContainingObjectLiteralElement(node: Node): ObjectLiteralElementWithName | undefined;
  type ObjectLiteralElementWithName = ObjectLiteralElement & {
    name: PropertyName;
    parent: ObjectLiteralExpression | JsxAttributes;
  };
  /** Gets all symbols for one property. Does not get symbols for every property. */
  function getPropertySymbolsFromContextualType(node: ObjectLiteralElementWithName, checker: TypeChecker, contextualType: Type, unionSymbolOk: boolean): ReadonlyArray<Symbol>;
  /**
   * Get the path of the default library files (lib.d.ts) as distributed with the typescript
   * node package.
   * The functionality is not supported if the ts module is consumed outside of a node module.
   */
  function getDefaultLibFilePath(options: CompilerOptions): string;
}
declare namespace ts.BreakpointResolver {
  /**
   * Get the breakpoint span in given sourceFile
   */
  function spanInSourceFileAtLocation(sourceFile: SourceFile, position: number): TextSpan | undefined;
}
declare namespace ts {
  /**
   * Transform one or more nodes using the supplied transformers.
   * @param source A single `Node` or an array of `Node` objects.
   * @param transformers An array of `TransformerFactory` callbacks used to process the transformation.
   * @param compilerOptions Optional compiler options.
   */
  function transform<T extends Node>(source: T | T[], transformers: TransformerFactory<T>[], compilerOptions?: CompilerOptions): TransformationResult<T>;
}
declare namespace ts {
  interface ScriptSnapshotShim {
    /** Gets a portion of the script snapshot specified by [start, end). */
    getText(start: number, end: number): string;
    /** Gets the length of this script snapshot. */
    getLength(): number;
    /**
     * Returns a JSON-encoded value of the type:
     *   { span: { start: number; length: number }; newLength: number }
     *
     * Or undefined value if there was no change.
     */
    getChangeRange(oldSnapshot: ScriptSnapshotShim): string | undefined;
    /** Releases all resources held by this script snapshot */
    dispose?(): void;
  }
  interface Logger {
    log(s: string): void;
    trace(s: string): void;
    error(s: string): void;
  }
  /** Public interface of the host of a language service shim instance. */
  interface LanguageServiceShimHost extends Logger {
    getCompilationSettings(): string;
    /** Returns a JSON-encoded value of the type: string[] */
    getScriptFileNames(): string;
    getScriptKind?(fileName: string): ScriptKind;
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): ScriptSnapshotShim;
    getLocalizedDiagnosticMessages(): string;
    getCancellationToken(): HostCancellationToken;
    getCurrentDirectory(): string;
    getDirectories(path: string): string;
    getDefaultLibFileName(options: string): string;
    getNewLine?(): string;
    getProjectVersion?(): string;
    useCaseSensitiveFileNames?(): boolean;
    getTypeRootsVersion?(): number;
    readDirectory(rootDir: string, extension: string, basePaths?: string, excludeEx?: string, includeFileEx?: string, includeDirEx?: string, depth?: number): string;
    readFile(path: string, encoding?: string): string | undefined;
    fileExists(path: string): boolean;
    getModuleResolutionsForFile?(fileName: string): string;
    getTypeReferenceDirectiveResolutionsForFile?(fileName: string): string;
    directoryExists(directoryName: string): boolean;
  }
  /** Public interface of the core-services host instance used in managed side */
  interface CoreServicesShimHost extends Logger {
    directoryExists(directoryName: string): boolean;
    fileExists(fileName: string): boolean;
    getCurrentDirectory(): string;
    getDirectories(path: string): string;
    /**
     * Returns a JSON-encoded value of the type: string[]
     *
     * @param exclude A JSON encoded string[] containing the paths to exclude
     *  when enumerating the directory.
     */
    readDirectory(rootDir: string, extension: string, basePaths?: string, excludeEx?: string, includeFileEx?: string, includeDirEx?: string, depth?: number): string;
    /**
     * Read arbitrary text files on disk, i.e. when resolution procedure needs the content of 'package.json' to determine location of bundled typings for node modules
     */
    readFile(fileName: string): string | undefined;
    realpath?(path: string): string;
    trace(s: string): void;
    useCaseSensitiveFileNames?(): boolean;
  }
  interface ShimsFileReference {
    path: string;
    position: number;
    length: number;
  }
  /** Public interface of a language service instance shim. */
  interface ShimFactory {
    registerShim(shim: Shim): void;
    unregisterShim(shim: Shim): void;
  }
  interface Shim {
    dispose(_dummy: {}): void;
  }
  interface LanguageServiceShim extends Shim {
    languageService: LanguageService;
    dispose(_dummy: {}): void;
    refresh(throwOnError: boolean): void;
    cleanupSemanticCache(): void;
    getSyntacticDiagnostics(fileName: string): string;
    getSemanticDiagnostics(fileName: string): string;
    getSuggestionDiagnostics(fileName: string): string;
    getCompilerOptionsDiagnostics(): string;
    getSyntacticClassifications(fileName: string, start: number, length: number): string;
    getSemanticClassifications(fileName: string, start: number, length: number): string;
    getEncodedSyntacticClassifications(fileName: string, start: number, length: number): string;
    getEncodedSemanticClassifications(fileName: string, start: number, length: number): string;
    getCompletionsAtPosition(fileName: string, position: number, preferences: UserPreferences | undefined): string;
    getCompletionEntryDetails(fileName: string, position: number, entryName: string, formatOptions: string | undefined, source: string | undefined, preferences: UserPreferences | undefined): string;
    getQuickInfoAtPosition(fileName: string, position: number): string;
    getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): string;
    getBreakpointStatementAtPosition(fileName: string, position: number): string;
    getSignatureHelpItems(fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { canRename: boolean, localizedErrorMessage: string, displayName: string, fullDisplayName: string, kind: string, kindModifiers: string, triggerSpan: { start; length } }
     */
    getRenameInfo(fileName: string, position: number, options?: RenameInfoOptions): string;
    getSmartSelectionRange(fileName: string, position: number): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { fileName: string, textSpan: { start: number, length: number } }[]
     */
    findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename?: boolean): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { fileName: string; textSpan: { start: number; length: number}; kind: string; name: string; containerKind: string; containerName: string }
     *
     * Or undefined value if no definition can be found.
     */
    getDefinitionAtPosition(fileName: string, position: number): string;
    getDefinitionAndBoundSpan(fileName: string, position: number): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { fileName: string; textSpan: { start: number; length: number}; kind: string; name: string; containerKind: string; containerName: string }
     *
     * Or undefined value if no definition can be found.
     */
    getTypeDefinitionAtPosition(fileName: string, position: number): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { fileName: string; textSpan: { start: number; length: number}; }[]
     */
    getImplementationAtPosition(fileName: string, position: number): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { fileName: string; textSpan: { start: number; length: number}; isWriteAccess: boolean, isDefinition?: boolean }[]
     */
    getReferencesAtPosition(fileName: string, position: number): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { definition: <encoded>; references: <encoded>[] }[]
     */
    findReferences(fileName: string, position: number): string;
    /**
     * @deprecated
     * Returns a JSON-encoded value of the type:
     * { fileName: string; textSpan: { start: number; length: number}; isWriteAccess: boolean }[]
     */
    getOccurrencesAtPosition(fileName: string, position: number): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { fileName: string; highlights: { start: number; length: number, isDefinition: boolean }[] }[]
     *
     * @param fileToSearch A JSON encoded string[] containing the file names that should be
     *  considered when searching.
     */
    getDocumentHighlights(fileName: string, position: number, filesToSearch: string): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { name: string; kind: string; kindModifiers: string; containerName: string; containerKind: string; matchKind: string; fileName: string; textSpan: { start: number; length: number}; } [] = [];
     */
    getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { text: string; kind: string; kindModifiers: string; bolded: boolean; grayed: boolean; indent: number; spans: { start: number; length: number; }[]; childItems: <recursive use of this type>[] } [] = [];
     */
    getNavigationBarItems(fileName: string): string;
    /** Returns a JSON-encoded value of the type ts.NavigationTree. */
    getNavigationTree(fileName: string): string;
    /**
     * Returns a JSON-encoded value of the type:
     * { textSpan: { start: number, length: number }; hintSpan: { start: number, length: number }; bannerText: string; autoCollapse: boolean } [] = [];
     */
    getOutliningSpans(fileName: string): string;
    getTodoComments(fileName: string, todoCommentDescriptors: string): string;
    getBraceMatchingAtPosition(fileName: string, position: number): string;
    getIndentationAtPosition(fileName: string, position: number, options: string): string;
    getFormattingEditsForRange(fileName: string, start: number, end: number, options: string): string;
    getFormattingEditsForDocument(fileName: string, options: string): string;
    getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: string): string;
    /**
     * Returns JSON-encoded value of the type TextInsertion.
     */
    getDocCommentTemplateAtPosition(fileName: string, position: number): string;
    /**
     * Returns JSON-encoded boolean to indicate whether we should support brace location
     * at the current position.
     * E.g. we don't want brace completion inside string-literals, comments, etc.
     */
    isValidBraceCompletionAtPosition(fileName: string, position: number, openingBrace: number): string;
    /**
     * Returns a JSON-encoded TextSpan | undefined indicating the range of the enclosing comment, if it exists.
     */
    getSpanOfEnclosingComment(fileName: string, position: number, onlyMultiLine: boolean): string;
    getEmitOutput(fileName: string): string;
    getEmitOutputObject(fileName: string): EmitOutput;
  }
  interface ClassifierShim extends Shim {
    getEncodedLexicalClassifications(text: string, lexState: EndOfLineState, syntacticClassifierAbsent?: boolean): string;
    getClassificationsForLine(text: string, lexState: EndOfLineState, syntacticClassifierAbsent?: boolean): string;
  }
  interface CoreServicesShim extends Shim {
    getAutomaticTypeDirectiveNames(compilerOptionsJson: string): string;
    getPreProcessedFileInfo(fileName: string, sourceText: IScriptSnapshot): string;
    getTSConfigFileInfo(fileName: string, sourceText: IScriptSnapshot): string;
    getDefaultCompilationSettings(): string;
    discoverTypings(discoverTypingsJson: string): string;
  }
  class LanguageServiceShimHostAdapter implements LanguageServiceHost {
    private shimHost;
    private loggingEnabled;
    private tracingEnabled;
    resolveModuleNames: ((moduleName: string[], containingFile: string) => (ResolvedModuleFull | undefined)[]) | undefined;
    resolveTypeReferenceDirectives: ((typeDirectiveNames: string[], containingFile: string) => (ResolvedTypeReferenceDirective | undefined)[]) | undefined;
    directoryExists: ((directoryName: string) => boolean) | undefined;
    constructor(shimHost: LanguageServiceShimHost);
    log(s: string): void;
    trace(s: string): void;
    error(s: string): void;
    getProjectVersion(): string;
    getTypeRootsVersion(): number;
    useCaseSensitiveFileNames(): boolean;
    getCompilationSettings(): CompilerOptions;
    getScriptFileNames(): string[];
    getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;
    getScriptKind(fileName: string): ScriptKind;
    getScriptVersion(fileName: string): string;
    getLocalizedDiagnosticMessages(): any;
    getCancellationToken(): HostCancellationToken;
    getCurrentDirectory(): string;
    getDirectories(path: string): string[];
    getDefaultLibFileName(options: CompilerOptions): string;
    readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: string[], include?: string[], depth?: number): string[];
    readFile(path: string, encoding?: string): string | undefined;
    fileExists(path: string): boolean;
  }
  class CoreServicesShimHostAdapter implements ParseConfigHost, ModuleResolutionHost, JsTyping.TypingResolutionHost {
    private shimHost;
    directoryExists: (directoryName: string) => boolean;
    realpath: (path: string) => string;
    useCaseSensitiveFileNames: boolean;
    constructor(shimHost: CoreServicesShimHost);
    readDirectory(rootDir: string, extensions: ReadonlyArray<string>, exclude: ReadonlyArray<string>, include: ReadonlyArray<string>, depth?: number): string[];
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string | undefined;
    getDirectories(path: string): string[];
  }
  interface RealizedDiagnostic {
    message: string;
    start: number;
    length: number;
    category: string;
    code: number;
    reportsUnnecessary?: {};
  }
  function realizeDiagnostics(diagnostics: ReadonlyArray<Diagnostic>, newLine: string): RealizedDiagnostic[];
  class TypeScriptServicesFactory implements ShimFactory {
    private _shims;
    private documentRegistry;
    getServicesVersion(): string;
    createLanguageServiceShim(host: LanguageServiceShimHost): LanguageServiceShim;
    createClassifierShim(logger: Logger): ClassifierShim;
    createCoreServicesShim(host: CoreServicesShimHost): CoreServicesShim;
    close(): void;
    registerShim(shim: Shim): void;
    unregisterShim(shim: Shim): void;
  }
}
declare namespace TypeScript.Services {
  const TypeScriptServicesFactory: typeof ts.TypeScriptServicesFactory;
}
declare const toolsVersion = "3.7";

export = ts