import ts from "typescript";
import tsThree from "../declarations/typescript3";

/* ****************************************************************************************************************** */
// region: Types
/* ****************************************************************************************************************** */

type TypeMapping = [
  [ts.SourceFile, tsThree.SourceFile],
  [ts.StringLiteral, tsThree.StringLiteral],
  [ts.CompilerOptions, tsThree.CompilerOptions],
  [ts.EmitResolver, tsThree.EmitResolver],
  [ts.CallExpression, tsThree.CallExpression],
  [ts.ExternalModuleReference, tsThree.ExternalModuleReference],
  [ts.LiteralTypeNode, tsThree.LiteralTypeNode],
  [ts.ExternalModuleReference, tsThree.ExternalModuleReference],
  [ts.ImportTypeNode, tsThree.ImportTypeNode],
  [ts.LiteralTypeNode, tsThree.LiteralTypeNode],
  [ts.ImportDeclaration, tsThree.ImportDeclaration],
  [ts.ImportClause, tsThree.ImportClause],
  [ts.Identifier, tsThree.Identifier],
  [ts.NamedImportBindings, tsThree.NamedImportBindings],
  [ts.ImportDeclaration, tsThree.ImportDeclaration],
  [ts.ExportDeclaration, tsThree.ExportDeclaration],
  [ts.ExportDeclaration["exportClause"], tsThree.ExportDeclaration["exportClause"]]
];

type TsType = Exclude<TypeMapping[number][0], undefined>;
type TsThreeType = Exclude<TypeMapping[number][1], undefined>;

type TsTypeConversion<Tuple extends [...unknown[]]> = {
  [i in keyof Tuple]: Tuple[i] extends any[] ? TsTypeConversion<Tuple[i]> : DownSampleTsType<Tuple[i]>;
} & { length: Tuple["length"] };

type DownSampleTsType<T> = T extends TsType ? Extract<TypeMapping[number], [T, any]>[1] : T;

type UpSampleTsTypes<Tuple extends [...unknown[]]> = {
  [i in keyof Tuple]: Tuple[i] extends any[] ? UpSampleTsTypes<Tuple[i]> : UpSampleTsType<Tuple[i]>;
} & { length: Tuple["length"] };

type UpSampleTsType<T> = T extends TsThreeType ? Extract<TypeMapping[number], [any, T]>[0] : T;

// endregion

/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */

/**
 * Convert TS4 to TS3 types
 * @internal
*/
export function downSampleTsTypes<T extends [...unknown[]]>(...args: T): TsTypeConversion<T> {
  return args as TsTypeConversion<T>;
}

/**
 * Convert TS4 to TS3 type
 * @internal
 */
export function downSampleTsType<T>(v: T): DownSampleTsType<T> {
  return v as DownSampleTsType<T>;
}

/**
 * Convert TS3 to TS4 types
 * @internal
 */
export function upSampleTsTypes<T extends [...unknown[]]>(...args: T): UpSampleTsTypes<T> {
  return args as UpSampleTsTypes<T>;
}

/**
 * Convert TS3 to TS4 type
 * @internal
 */
export function upSampleTsType<T extends TsThreeType>(v: T): UpSampleTsType<T> {
  return v as UpSampleTsType<T>;
}

// endregion
