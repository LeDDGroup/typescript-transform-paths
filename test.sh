#!/usr/bin/env bash

set -e

npx tsc -p tests/__fixtures/with-path/tsconfig.json --outDir tests/__result/with-path/original
npx ttsc -p tests/__fixtures/with-path/tsconfig.json --outDir tests/__result/with-path/generated
npx tsc -p tests/__fixtures/without-path/tsconfig.json --outDir tests/__result/without-path/original
npx ttsc -p tests/__fixtures/without-path/tsconfig.json --outDir tests/__result/without-path/generated
npx jest
