// Keeping register here in the root for backwards compatibiliy, TODO remove in the next major version
console.warn(
  "typescript-transform-paths: Calling the top level nx-transformer file is deprecated and will be removed in the future. Use a tool that supports package.json exports",
);

module.exports = require("./dist/plugins/nx-transfomer-plugin").default;
