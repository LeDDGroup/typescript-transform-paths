# typescript-transform-paths

[![npm version](https://img.shields.io/npm/v/typescript-transform-paths.svg)](https://www.npmjs.com/package/typescript-transform-paths)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FLeDDGroup%2Ftypescript-transform-paths%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/LeDDGroup/typescript-transform-paths/goto?ref=master)
[![Appveyor Build status](https://ci.appveyor.com/api/projects/status/4i7egn9rn7iepg31/branch/master?svg=true)](https://ci.appveyor.com/project/danielpza/typescript-transform-paths/branch/master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors)

Transform module resolution paths in compiled output source to conform with `TypeScript` internal resolution via `tsconfig.json` settings (`paths`, `rootDirs`, `baseUrl`)

## Install

```sh
# NPM
npm i -D typescript-transform-paths

# Yarn
yarn add -D typescript-transform-paths
```

## Usage with [ttypescript](https://github.com/cevek/ttypescript/) or [ts-patch](https://github.com/nonara/ts-patch)

Add it to _plugins_ in your _tsconfig.json_

### Example Config

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@utils/*": ["utils/*"]
    },
    "plugins": [
      // Transform paths in output .js files
      { "transform": "typescript-transform-paths" },

      // Transform paths in output .d.ts files (Include this line if you output declarations files)
      { "transform": "typescript-transform-paths", "afterDeclarations": true }
    ]
  }
}
```
`core/index.ts`
```tsx
import { sum } from "@utils/sum";
sum(2, 3);
```

`core/index.js` (compiled output)
```js
// core/index.js
var sum_1 = require("../utils/sum");
sum_1.sum(2, 3);
```

### Virtual Directories
TS allows defining
[virtual directories](https://www.typescriptlang.org/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs)
via the `rootDirs` compiler option.  
To enable virtual directory mapping, use the `useRootDirs` plugin option.

```jsonc
{
  "compilerOptions": {
    "rootDirs": [ "src", "generated" ],
    "baseUrl": ".",
    "paths": {
      "#root/*": [ "./src/*", "./generated/*" ]
    },
    "plugins": [
      { "transform": "typescript-transform-paths", "useRootDirs": true },
      { "transform": "typescript-transform-paths", "useRootDirs": true, "afterDeclarations": true }
    ]
  }
}
```

#### Example

```
- src/
    - subdir/
      - sub-file.ts
    - file1.ts
- generated/
    - file2.ts
```

`src/file1.ts`
```ts
import '#root/file2.ts' // resolves to './file2'
```
`src/subdir/sub-file.ts`
```ts
import '#root/file2.ts' // resolves to '../file2'
import '#root/file1.ts' // resolves to '../file1'
```

## Custom Control

### Exclusion patterns

You can disable transformation for paths based on the resolved file path. The `exclude` option allows specifying glob
patterns to match against resolved file path. 

For an example context in which this would be useful, see [Issue #83](https://github.com/LeDDGroup/typescript-transform-paths/issues/83)

Example:
```jsonc
{
  "compilerOptions": {
    "paths": {
      "sub-module1/*": [ "../../node_modules/sub-module1/*" ],
      "sub-module2/*": [ "../../node_modules/sub-module2/*" ],
    },
    "plugins": [
      { 
        "transform": "typescript-transform-paths", 
        "exclude": [ "**/node_modules/**" ]
      }
    ]
  }
}
```

```ts
// This path will not be transformed
import * as sm1 from 'sub-module1/index'
```

### @transform-path tag

Use the `@transform-path` tag to explicitly specify the output path for a single statement.

```ts
// @transform-path https://cdnjs.cloudflare.com/ajax/libs/react/17.0.1/umd/react.production.min.js
import react from 'react' // Output path will be the url above
```

### @no-transform-path

Use the `@no-transform-path` tag to explicitly disable transformation for a single statement.

```ts
// @no-transform-path
import 'normally-transformed' // This will remain 'normally-transformed', even though it has a different value in paths config
```

## Articles

- [Node Consumable Modules With Typescript Paths](https://medium.com/@ole.ersoy/node-consumable-modules-with-typescript-paths-ed88a5f332fa?postPublishedType=initial) by [oleersoy](https://github.com/oleersoy)

## Project Guidelines for Contributors

- Package Manager: `yarn` (`yarn install`)
- Commit messages: [Conventional Commit Specs](https://www.conventionalcommits.org/en/v1.0.0/)
- Format before commit: `prettier` (`yarn run format`)
- Releases: `standard-version` (`yarn run release`)

## Maintainers

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nonara"><img src="https://avatars0.githubusercontent.com/u/1427565?v=4" width="100px;" alt=""/><br /><sub><b>Ron S.</b></sub></a></td>
    <td align="center"><a href="https://github.com/danielpza"><img src="https://avatars2.githubusercontent.com/u/17787042?v=4" width="100px;" alt=""/><br /><sub><b>Daniel Perez Alvarez</b></sub></a></td>
  </tr>
</table>

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/danielpza"><img src="https://avatars2.githubusercontent.com/u/17787042?v=4" width="100px;" alt=""/><br /><sub><b>Daniel Perez Alvarez</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=danielpza" title="Code">💻</a> <a href="#maintenance-danielpza" title="Maintenance">🚧</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=danielpza" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/anion155"><img src="https://avatars1.githubusercontent.com/u/4786672?v=4" width="100px;" alt=""/><br /><sub><b>Михайлов Антон</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=anion155" title="Code">💻</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Aanion155" title="Bug reports">🐛</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=anion155" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://joshuaavalon.io"><img src="https://avatars0.githubusercontent.com/u/7152420?v=4" width="100px;" alt=""/><br /><sub><b>Joshua Avalon</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Ajoshuaavalon" title="Bug reports">🐛</a> <a href="#platform-joshuaavalon" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://roblav96.github.io/resume"><img src="https://avatars1.githubusercontent.com/u/1457327?v=4" width="100px;" alt=""/><br /><sub><b>Robert Laverty</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Aroblav96" title="Bug reports">🐛</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=roblav96" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/oleersoy"><img src="https://avatars3.githubusercontent.com/u/1163873?v=4" width="100px;" alt=""/><br /><sub><b>Ole Ersoy</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Aoleersoy" title="Bug reports">🐛</a> <a href="#blog-oleersoy" title="Blogposts">📝</a></td>
    <td align="center"><a href="https://github.com/sbmw"><img src="https://avatars0.githubusercontent.com/u/30099628?v=4" width="100px;" alt=""/><br /><sub><b>sbmw</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Asbmw" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/richardspence"><img src="https://avatars2.githubusercontent.com/u/9914123?v=4" width="100px;" alt=""/><br /><sub><b>richardspence</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Arichardspence" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://codepen.io/viT-1/"><img src="https://avatars1.githubusercontent.com/u/19496430?v=4" width="100px;" alt=""/><br /><sub><b>Vitaly Pinchuk</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3AviT-1" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/laij84"><img src="https://avatars0.githubusercontent.com/u/18145822?v=4" width="100px;" alt=""/><br /><sub><b>laij84</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Alaij84" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/dko-slapdash"><img src="https://avatars0.githubusercontent.com/u/46383452?v=4" width="100px;" alt=""/><br /><sub><b>dko-slapdash</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Adko-slapdash" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/hedwiggggg"><img src="https://avatars1.githubusercontent.com/u/42947316?v=4" width="100px;" alt=""/><br /><sub><b>hedwiggggg</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Ahedwiggggg" title="Bug reports">🐛</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=hedwiggggg" title="Tests">⚠️</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=hedwiggggg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kuskoman"><img src="https://avatars3.githubusercontent.com/u/15456923?v=4" width="100px;" alt=""/><br /><sub><b>kuskoman</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=kuskoman" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/booninite"><img src="https://avatars3.githubusercontent.com/u/13647495?v=4" width="100px;" alt=""/><br /><sub><b>alex weidner</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Abooninite" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/nonara"><img src="https://avatars0.githubusercontent.com/u/1427565?v=4" width="100px;" alt=""/><br /><sub><b>Ron S.</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Anonara" title="Bug reports">🐛</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=nonara" title="Tests">⚠️</a> <a href="https://github.com/LeDDGroup/typescript-transform-paths/commits?author=nonara" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/vladimiry"><img src="https://avatars2.githubusercontent.com/u/1560781?v=4" width="100px;" alt=""/><br /><sub><b>Vladimir Yakovlev</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Avladimiry" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/vwpo"><img src="https://avatars3.githubusercontent.com/u/57674261?v=4" width="100px;" alt=""/><br /><sub><b>vwpo</b></sub></a><br /><a href="https://github.com/LeDDGroup/typescript-transform-paths/issues?q=author%3Avwpo" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
