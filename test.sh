#!/usr/bin/env bash

set -e

npm run build
npx ttsc -p tests/tsconfig.json
node tests/out/core/index.js
if fgrep '@utils' tests/out/*/* ;
then
  false
fi
