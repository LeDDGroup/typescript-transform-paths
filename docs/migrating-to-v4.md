# Migrating from v3 to v4

## Breaking Changes

### Package is now ESM only

### Dropped support for older Node.js versions. Requires Node.js >22

### Dropped support for older typescript versions. Requires typescript >5.8.x

### Removed `typescript-transform-paths/register` ts-node entrypoint

See https://typestrong.org/ts-node/docs/compilers/ for how to configure ts-node to use custom transformers.

### Renamed `nx` transformer entrypoint

The nx plugin entrypoint was renamed from `typescript-transform-paths/nx-transformer` to `typescript-transform-paths/plugins/nx`:

```diff
          "transformers": [
            {
-              "name": "typescript-transform-paths/nx-transformer",
+              "name": "typescript-transform-paths/plugins/nx",
              "options": { "afterDeclarations": true },
            },
          ],
```
