/** Mimicks a module not found nodejs error, see https://nodejs.org/docs/v20.16.0/api/errors.html */
export class ModuleNotFoundError extends Error {
  code = "MODULE_NOT_FOUND";

  constructor(packageName: string, options?: ErrorOptions) {
    super(`Uncaught Error: Cannot find module '${packageName}'`, options);
  }
}
