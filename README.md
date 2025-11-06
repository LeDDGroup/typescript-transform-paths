<h1 align="center">typescript-transform-paths</h1>
<p align="center">Transform compiled source module resolution paths using TypeScript's <code>paths</code> config, and/or custom resolution paths</p>
<div align="center">

[![npm version](https://img.shields.io/npm/v/typescript-transform-paths.svg)](https://www.npmjs.com/package/typescript-transform-paths)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FLeDDGroup%2Ftypescript-transform-paths%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/LeDDGroup/typescript-transform-paths/goto?ref=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

</div>

> [!TIP]  
> Upgrading from v3 to v4? See the [migration](./docs/migrating-to-v4.md) documentation.

> [!IMPORTANT]  
> We are [looking for maintainers][issue-439].  
> Explore [alternatives][issue-438].

## Setup Steps

### 1. Install

```sh
<yarn|npm|pnpm> add -D typescript-transform-paths
```

### 2. Configure

Add it to `plugins` in your `tsconfig.json` file.

#### Example Configuration

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./",
    // Configure your path mapping here
    "paths": {
      "@utils/*": ["utils/*"],
    },
    // Note: to transform paths for both the output .js and .d.ts files,
    //       you need both of the below entries
    "plugins": [
      // Transform paths in output .js files
      { "transform": "typescript-transform-paths" },

      // Transform paths in output .d.ts files (include this line if you output declarations files)
      { "transform": "typescript-transform-paths", "afterDeclarations": true },
    ],
  },
}
```

#### Example Result

`core/index.ts`

```ts
// The following import path is transformed to '../utils/sum'
import { sum } from "@utils/sum";
```

### 3. Use

- Compile with **`tsc`** — Use [ts-patch][ts-patch].
- Run with **`ts-node`** — See the [Wiki][ts-node-wiki].
- Integrate with **Nx** — Add the `typescript-transform-paths/plugins/nx` transformer to the project configuration.

  `project.json`

  ```jsonc
  {
    /* ... */
    "targets": {
      "build": {
        /* ... */
        "options": {
          /* ... */
          "transformers": [
            {
              "name": "typescript-transform-paths/plugins/nx",
              "options": { "afterDeclarations": true },
            },
          ],
        },
      },
    },
  }
  ```

## Virtual Directories

TypeScript allows defining [Virtual Directories][virtual-directories] via the `rootDirs` compiler option.  
To enable Virtual Directory mapping, use the `useRootDirs` plugin option.

`tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "rootDirs": ["src", "generated"],
    "baseUrl": ".",
    "paths": {
      "#root/*": ["./src/*", "./generated/*"],
    },
    "plugins": [
      { "transform": "typescript-transform-paths", "useRootDirs": true },
      { "transform": "typescript-transform-paths", "useRootDirs": true, "afterDeclarations": true },
    ],
  },
}
```

#### Example

```text
├src/
├─ subdir/
│  └─ sub-file.ts
├─ file1.ts
├generated/
├─ file2.ts
```

`src/file1.ts`

```ts
import "#root/file2.ts"; // Resolves to './file2'
```

`src/subdir/sub-file.ts`

```ts
import "#root/file2.ts"; // Resolves to '../file2'
import "#root/file1.ts"; // Resolves to '../file1'
```

## Custom Control

### Exclusion Patterns

You can disable transformation for paths based on the resolved file path.  
The `exclude` option allows specifying Glob patterns to match against those resolved file paths.

For an example context in which this would be useful, see [issue #83][issue-83].

`tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "paths": {
      "sub-module1/*": ["../../node_modules/sub-module1/*"],
      "sub-module2/*": ["../../node_modules/sub-module2/*"],
    },
    "plugins": [
      {
        "transform": "typescript-transform-paths",
        "exclude": ["**/node_modules/**"],
      },
    ],
  },
}
```

```ts
// This path will NOT be transformed
import * as sm1 from "sub-module1/index";
```

### @transform-path

Use the `@transform-path` tag to explicitly specify the output path for a single statement.

```ts
// @transform-path https://cdnjs.cloudflare.com/ajax/libs/react/17.0.1/umd/react.production.min.js
import react from "react"; // Output path will be the URL defined above
```

### @no-transform-path

Use the `@no-transform-path` tag to explicitly disable transformation for a single statement.

```ts
// @no-transform-path
import "normally-transformed"; // This will remain 'normally-transformed' even though
                               // it has a different value in paths config
```

## Version Compatibility

|  typescript-transform-paths  | TypeScript            | Node.js |
|------------------------------|-----------------------|---------|
| ^4.0.0                       | >=5.x                 | >=22    |
| ^3.5.2                       | >=3.6.5, >=4.x, >=5.x | >=18    |

## Project Guidelines for Contributors

- Package Manager: `yarn` (`yarn install`)
- Format and lint the code before commit: `prettier` (`yarn format && yarn lint`)
- Commit messages: [Conventional Commit Specs](https://www.conventionalcommits.org/en/v1.0.0/)
- Releases: `changelogen` (`yarn release`)

```shell
GH_TOKEN=$(gh auth token) yarn release
```

## Alternatives

- [Node.js Subpath imports][subpath-imports]
- [Yarn Link Protocol][yarn-link-protocol]

## Maintainers

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nonara"><img src="https://avatars0.githubusercontent.com/u/1427565?v=4" width="100px;" alt=""/><br /><sub><b>Ron S.</b></sub></a></td>
    <td align="center"><a href="https://github.com/danielpza"><img src="https://avatars2.githubusercontent.com/u/17787042?v=4" width="100px;" alt=""/><br /><sub><b>Daniel Perez</b></sub></a></td>
  </tr>
</table>

[ts-patch]: https://github.com/nonara/ts-patch
[ts-node-wiki]: https://github.com/LeDDGroup/typescript-transform-paths/wiki/Integration-with-ts%E2%80%90node
[virtual-directories]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs
[issue-83]: https://github.com/LeDDGroup/typescript-transform-paths/issues/83
[issue-438]: https://github.com/LeDDGroup/typescript-transform-paths/issues/438
[issue-439]: https://github.com/LeDDGroup/typescript-transform-paths/issues/439
[subpath-imports]: https://nodejs.org/api/packages.html#subpath-imports
[yarn-link-protocol]: https://yarnpkg.com/protocol/link
