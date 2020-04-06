# typescript-transform-paths

[![npm version](https://img.shields.io/npm/v/typescript-transform-paths.svg)](https://www.npmjs.com/package/typescript-transform-paths)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FLeDDGroup%2Ftypescript-transform-paths%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/LeDDGroup/typescript-transform-paths/goto?ref=master)
[![Appveyor Build status](https://ci.appveyor.com/api/projects/status/4i7egn9rn7iepg31/branch/master?svg=true)](https://ci.appveyor.com/project/danielpza/typescript-transform-paths/branch/master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors)

Transforms absolute imports to relative from `paths` in your tsconfig.json

## Install

npm:

```sh
npm i -D typescript-transform-paths
```

## Usage with [ttypescript](https://github.com/cevek/ttypescript/)

Add it to _plugins_ in your _tsconfig.json_

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@utils/*": ["utils/*"]
    },
    "plugins": [{ "transform": "typescript-transform-paths" }]
  }
}
```

### Transforming declaration paths

If you want to generate declaration (_.d.ts_) files with transformed paths you have to
modify your _tsconfig.json_ file:

```json
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@utils/*": ["utils/*"]
    },
    "declaration": true,
    "plugins": [
      { "transform": "typescript-transform-paths" },
      { "transform": "typescript-transform-paths", "afterDeclarations": true }
    ]
  }
```

See [issue4](https://github.com/LeDDGroup/typescript-transform-paths/issues/4#issuecomment-486380340) for more information.

## Example

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@utils/*": ["utils/*"]
    }
  }
}
```

```tsx
// core/index.ts
import { sum } from "@utils/sum";

sum(2, 3);
```

Gets compiled to:

```js
// core/index.js
var sum_1 = require("../utils/sum");
sum_1.sum(2, 3);
```

## Articles

- [Node Consumable Modules With Typescript Paths](https://medium.com/@ole.ersoy/node-consumable-modules-with-typescript-paths-ed88a5f332fa?postPublishedType=initial) by [oleersoy](https://github.com/oleersoy")

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
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
