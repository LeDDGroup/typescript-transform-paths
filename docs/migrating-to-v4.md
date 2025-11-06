<h1 align="center">Migrating from v3 to v4</h1>

### Breaking Changes

- Package is now **ESM** only.
- Dropped support for old Node.js versions. It now **requires** Node.js `>=22`.
- Dropped support for old TypeScript versions. It now **requires** TypeScript `>=5.x`.
- Removed the `typescript-transform-paths/register` **ts-node** entrypoint.  
  See https://typestrong.org/ts-node/docs/compilers to understand how to configure **ts-node** to use custom transformers.
- Renamed the **Nx** transformer entrypoint from `typescript-transform-paths/nx-transformer` to `typescript-transform-paths/plugins/nx`.

  ```diff
     "transformers": [
       {
  -      "name": "typescript-transform-paths/nx-transformer",
  +      "name": "typescript-transform-paths/plugins/nx",
         "options": { "afterDeclarations": true },
       },
     ],
  ```
