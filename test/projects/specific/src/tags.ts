/* ****************************************************************************************************************** *
 * JSDoc
 * ****************************************************************************************************************** */

/**
 * @no-transform-path
 */
import * as skipTransform1 from "#root/index";

/**
 * @multi-tag1
 * @no-transform-path
 * @multi-tag2
 */
import * as skipTransform2 from "#root/index";

/**
 * @multi-tag1
 * @transform-path ./dir/src-file
 * @multi-tag2
 */
import * as explicitTransform1 from "./index";

/**
 * @multi-tag1
 * @transform-path http://www.go.com/react.js
 * @multi-tag2
 */
import * as explicitTransform2 from "./index";

/* ****************************************************************************************************************** *
 * JS Tag
 * ****************************************************************************************************************** */

// @no-transform-path
import * as skipTransform3 from "#root/index";

// @multi-tag1
// @no-transform-path
// @multi-tag2
import * as skipTransform4 from "#root/index";

// @multi-tag1
// @transform-path ./dir/src-file
// @multi-tag2
import * as explicitTransform3 from "./index";

// @multi-tag1
// @transform-path http://www.go.com/react.js
// @multi-tag2
import * as explicitTransform4 from "./index";

export {
  skipTransform1,
  skipTransform2,
  skipTransform3,
  skipTransform4,
  explicitTransform1,
  explicitTransform2,
  explicitTransform3,
  explicitTransform4,
};
