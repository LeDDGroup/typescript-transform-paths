# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
