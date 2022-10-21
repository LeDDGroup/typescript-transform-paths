export { packageAConst, PackageAType } from "#packages/pkg-a";
export { packageBConst, PackageBType } from "#packages/pkg-b";
export { packageCConst, PackageCType } from "#packages/pkg-c";
export { SubPackageType, subPackageConst } from "#packages/pkg-a/sub-pkg";

// This path should resolve to './packages/pkg-c/main'
export { packageCConst as C2 } from "#packages/pkg-c/main";
// This path should resolve to './packages/pkg-c/main.js', due to explicit extension
export { packageCConst as C3 } from "#packages/pkg-c/main.js";
// This path should resolve to './packages/pkg-a/sub-pkg/main'
export { subPackageConst as C4 } from "#packages/pkg-a/sub-pkg/main";
// This path should resolve to './packages/pkg-a/sub-pkg/main.js', due to explicit extension
export { subPackageConst as C5 } from "#packages/pkg-a/sub-pkg/main.js";

export type ImportWithChildren = import("#packages/pkg-a").PassThru<import("#packages/pkg-b").PackageBType>;
