# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.3](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.2.2...v2.2.3) (2021-02-02)


### Bug Fixes

* Prevent `.json` extension being stripped in output (fixes [#95](https://github.com/LeDDGroup/typescript-transform-paths/issues/95)) ([bcca436](https://github.com/LeDDGroup/typescript-transform-paths/commit/bcca43677d23ddea0a409ec3daff008313d17342))

### [2.2.2](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.2.1...v2.2.2) (2021-01-11)


### Bug Fixes

* Corrected explicit extensions fix from previous patch ([a90e550](https://github.com/LeDDGroup/typescript-transform-paths/commit/a90e550a3d0c4804ef3a4e27cbc4e32ce6971296))

### [2.2.1](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.2.0...v2.2.1) (2021-01-10)


### Bug Fixes

* Preserve explicit file extensions (closes [#89](https://github.com/LeDDGroup/typescript-transform-paths/issues/89)) ([b0627f8](https://github.com/LeDDGroup/typescript-transform-paths/commit/b0627f8f6cd49681ff58ffad48e04e96a9e9ba27))
* Rely on original node for getting comment tags (closes [#90](https://github.com/LeDDGroup/typescript-transform-paths/issues/90)) ([fa978c2](https://github.com/LeDDGroup/typescript-transform-paths/commit/fa978c2651f74ba3ce7d7363ac5a0b3677a8e90c))

## [2.2.0](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.1.0...v2.2.0) (2021-01-04)


### Features

* Add overwriteNodeModules option ([b4a483e](https://github.com/LeDDGroup/typescript-transform-paths/commit/b4a483e880e348971c15dde697ec6813f678fde2))
* Added `@transform-path` and `@no-transform-path` tags for custom statement level transformation ([8cab30d](https://github.com/LeDDGroup/typescript-transform-paths/commit/8cab30d25415596f19b162bcf50cf984256012e6))
* Added `exclude` option to allow excluding transformation of matching resolved paths ([b1fdb54](https://github.com/LeDDGroup/typescript-transform-paths/commit/b1fdb545c2d963cd4d82a6a0bedfa2d7d0107398))


### Bug Fixes

* Certain edge cases existed where type elision improperly elided full import / export declarations without named bindings (closes [#87](https://github.com/LeDDGroup/typescript-transform-paths/issues/87)) ([84a7866](https://github.com/LeDDGroup/typescript-transform-paths/commit/84a7866d354b49a7d2e8abaadb89f24b8bff07bc))

## [2.1.0](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.0.3...v2.1.0) (2020-11-27)

### Features

* Added proper type elision (Closes [#77](https://github.com/LeDDGroup/typescript-transform-paths/issues/77) [#78](https://github.com/LeDDGroup/typescript-transform-paths/issues/78)) ([cee93ec](https://github.com/LeDDGroup/typescript-transform-paths/commit/cee93ecc3dceb90474239787c216a8d26089b417))

### Bug Fixes

* Ensure we use the same typescript instance that called the plugin (Fixes [#80](https://github.com/LeDDGroup/typescript-transform-paths/issues/80))

### Refactoring

* Heavily refactored code base for better scale and readability
* Refactored tests for modularity and multi-TS instance testing

### [2.0.4](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.0.3...v2.0.4) (2020-11-23)

* Refactored from requiring _both_ to _at least one_ tsConfig option: baseUrl, paths ([34e4963](https://github.com/LeDDGroup/typescript-transform-paths/commit/34e49639f7248e38475efd854670c11ea65fc76e))
  - Fixes issue [#39](https://github.com/LeDDGroup/typescript-transform-paths/issues/39)
  - Adds support for new [TS 4.1 - paths without baseUrl](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#paths-without-baseurl)

### [2.0.3](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.0.2...v2.0.3) (2020-11-17)


### Bug Fixes

* Updated to more sound workaround for TS type-elision issue ([fb33832](https://github.com/LeDDGroup/typescript-transform-paths/commit/fb338322e5fcd3b3ee7d45269287006ddec1bdb6))

### [2.0.2](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.0.1...v2.0.2) (2020-10-23)


### Bug Fixes

* Leading comments elided from async import ([d29c52a](https://github.com/LeDDGroup/typescript-transform-paths/commit/d29c52adb11532327889fe49539797b65ba78e86)), closes [#58](https://github.com/LeDDGroup/typescript-transform-paths/issues/58)

### [2.0.1](https://github.com/LeDDGroup/typescript-transform-paths/compare/v2.0.0...v2.0.1) (2020-09-17)


### Bug Fixes

* Support TS 4+ ([#69](https://github.com/LeDDGroup/typescript-transform-paths/issues/69)) ([2406346](https://github.com/LeDDGroup/typescript-transform-paths/commit/24063465c33c36a90d0ae8dd80374369d5f3ca8d)), closes [#68](https://github.com/LeDDGroup/typescript-transform-paths/issues/68)

## [2.0.0](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.15...v2.0.0) (2020-08-04)


### ⚠ BREAKING CHANGES

* Re-written to rely on TS API (#66)

### Bug Fixes

* Re-written to rely on TS API ([#66](https://github.com/LeDDGroup/typescript-transform-paths/issues/66)) ([e271f3e](https://github.com/LeDDGroup/typescript-transform-paths/commit/e271f3e973187743d5431b3582e44d553234d581))

### [1.1.15](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.14...v1.1.15) (2020-07-30)


### Bug Fixes

* multiple issue fixes ([#61](https://github.com/LeDDGroup/typescript-transform-paths/issues/61)) ([a4e2916](https://github.com/LeDDGroup/typescript-transform-paths/commit/a4e2916)), closes [#60](https://github.com/LeDDGroup/typescript-transform-paths/issues/60) [#24](https://github.com/LeDDGroup/typescript-transform-paths/issues/24) [#48](https://github.com/LeDDGroup/typescript-transform-paths/issues/48)



### [1.1.14](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.13...v1.1.14) (2019-12-27)


### Bug Fixes

* add support for dynamic imports ([#46](https://github.com/LeDDGroup/typescript-transform-paths/issues/46)) ([88b6001](https://github.com/LeDDGroup/typescript-transform-paths/commit/88b6001))



### [1.1.13](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.12...v1.1.13) (2019-11-11)


### Bug Fixes

* another edge case for implicit * path ([#43](https://github.com/LeDDGroup/typescript-transform-paths/issues/43)) ([d0f4eb7](https://github.com/LeDDGroup/typescript-transform-paths/commit/d0f4eb7)), closes [#42](https://github.com/LeDDGroup/typescript-transform-paths/issues/42)



### [1.1.12](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.11...v1.1.12) (2019-11-09)


### Bug Fixes

* handle tsconfig with out paths ([#41](https://github.com/LeDDGroup/typescript-transform-paths/issues/41)) ([1e936b8](https://github.com/LeDDGroup/typescript-transform-paths/commit/1e936b8))



### [1.1.11](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.10...v1.1.11) (2019-10-09)


### Bug Fixes

* not working with files with multiple extensions ([#37](https://github.com/LeDDGroup/typescript-transform-paths/issues/37)) ([97454c7](https://github.com/LeDDGroup/typescript-transform-paths/commit/97454c7))

### [1.1.10](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.9...v1.1.10) (2019-08-20)


### Bug Fixes

* do not transform relative paths ([dd57089](https://github.com/LeDDGroup/typescript-transform-paths/commit/dd57089)), closes [#30](https://github.com/LeDDGroup/typescript-transform-paths/issues/30)
* resolve only if file exists ([e6c51e0](https://github.com/LeDDGroup/typescript-transform-paths/commit/e6c51e0))



### [1.1.9](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.8...v1.1.9) (2019-08-20)


### Bug Fixes

* urls not working ([4f9fbfa](https://github.com/LeDDGroup/typescript-transform-paths/commit/4f9fbfa))



### [1.1.8](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.7...v1.1.8) (2019-08-01)


### Bug Fixes

* not updating external module reference ([2323637](https://github.com/LeDDGroup/typescript-transform-paths/commit/2323637))
* revert [#27](https://github.com/LeDDGroup/typescript-transform-paths/issues/27) ([2d2cbeb](https://github.com/LeDDGroup/typescript-transform-paths/commit/2d2cbeb))



### [1.1.7](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.6...v1.1.7) (2019-07-30)


### Bug Fixes

* require statements not being transformed ([#27](https://github.com/LeDDGroup/typescript-transform-paths/issues/27)) ([822b65e](https://github.com/LeDDGroup/typescript-transform-paths/commit/822b65e))



### [1.1.6](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.5...v1.1.6) (2019-07-09)


### Bug Fixes

* not working explicits exports for types on declaration files ([0263f06](https://github.com/LeDDGroup/typescript-transform-paths/commit/0263f06))



### [1.1.5](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.4...v1.1.5) (2019-07-09)


### Bug Fixes

* declaration files inconsistencies ([d7f4074](https://github.com/LeDDGroup/typescript-transform-paths/commit/d7f4074)), closes [#24](https://github.com/LeDDGroup/typescript-transform-paths/issues/24) [#23](https://github.com/LeDDGroup/typescript-transform-paths/issues/23) [#22](https://github.com/LeDDGroup/typescript-transform-paths/issues/22)


### Tests

* improve tests ([cf20a3f](https://github.com/LeDDGroup/typescript-transform-paths/commit/cf20a3f))



### [1.1.4](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.3...v1.1.4) (2019-06-08)


### Bug Fixes

* some exports not working ([cc2ba49](https://github.com/LeDDGroup/typescript-transform-paths/commit/cc2ba49))



### [1.1.3](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.2...v1.1.3) (2019-05-24)


### Bug Fixes

* not transforming declaration files ([bb269b5](https://github.com/LeDDGroup/typescript-transform-paths/commit/bb269b5)), closes [#13](https://github.com/LeDDGroup/typescript-transform-paths/issues/13) [#14](https://github.com/LeDDGroup/typescript-transform-paths/issues/14)


### Tests

* use release build for tests ([6069d24](https://github.com/LeDDGroup/typescript-transform-paths/commit/6069d24))



### [1.1.2](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.1...v1.1.2) (2019-05-21)


* add some keywords to package.json
* update license to MIT
* add all contributor



<a name="1.1.1"></a>
## [1.1.1](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.1.0...v1.1.1) (2019-05-18)


### Bug Fixes

* check for `paths` and `baseUrl` in tsconfig ([c3710c4](https://github.com/LeDDGroup/typescript-transform-paths/commit/c3710c4))
* type only import not deleted from result file ([73dd8e2](https://github.com/LeDDGroup/typescript-transform-paths/commit/73dd8e2)), closes [#9](https://github.com/LeDDGroup/typescript-transform-paths/issues/9)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.0.2...v1.1.0) (2019-05-01)


### Features

* exports expressions ([546e610](https://github.com/LeDDGroup/typescript-transform-paths/commit/546e610)), closes [#7](https://github.com/LeDDGroup/typescript-transform-paths/issues/7)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.0.1...v1.0.2) (2019-04-24)


### Bug Fixes

* produce posix path in windows ([5059c3d](https://github.com/LeDDGroup/typescript-transform-paths/commit/5059c3d)), closes [#5](https://github.com/LeDDGroup/typescript-transform-paths/issues/5)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/LeDDGroup/typescript-transform-paths/compare/v1.0.0...v1.0.1) (2019-04-12)


### Bug Fixes

* not working for same or lower directory level ([a748d6a](https://github.com/LeDDGroup/typescript-transform-paths/commit/a748d6a)), closes [#2](https://github.com/LeDDGroup/typescript-transform-paths/issues/2)



<a name="1.0.0"></a>
# 1.0.0 (2019-02-02)


### Features

* make it work ([e774cf7](https://github.com/LeDDGroup/typescript-transform-paths/commit/e774cf7))
