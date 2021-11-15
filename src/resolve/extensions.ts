import { extName } from '../utils';

/* ****************************************************************************************************************** *
 * Locals
 * ****************************************************************************************************************** */

const implicitExtensions = ['.js', '.d.ts', '.ts'];

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export function isImplicitExtension(ext: string) {
  return implicitExtensions.includes(ext);
}

export function stripImplicitExtension(fileName: string) {
  const ext = extName(fileName);
  return isImplicitExtension(ext) ? fileName.slice(0, fileName.length - ext.length) : fileName;
}

// endregion
