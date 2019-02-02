# typescript-transform-paths

[![npm version](https://img.shields.io/npm/v/typescript-transform-paths.svg)](https://www.npmjs.com/package/typescript-transform-jsx)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Built with Spacemacs](https://cdn.rawgit.com/syl20bnr/spacemacs/442d025779da2f62fc86c2082703697714db6514/assets/spacemacs-badge.svg)](http://spacemacs.org)

Transforms absolute imports to relative

## Install

```sh
$ npm i -D typescript-transform-paths
```

## Usage with [ttypescript](https://github.com/cevek/ttypescript/)

Add it to _plugins_ in your _tsconfig.json_

```json
{
  "compilerOptions": {
    "plugins": [{ "transform": "typescript-transform-paths" }]
  }
}
```

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

## Contributing

If you have any question or idea of a feature create an issue in github or make an PR.
