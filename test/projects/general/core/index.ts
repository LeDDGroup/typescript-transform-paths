// @ts-ignore
import sum = require("@utils/sum");
export { sum } from "@utils/index";
export { g } from "#utils/hello";
export { sum as sum2 } from "#utils/sum";
export { NoRuntimecodeHere } from "@utils/types-only";
import { subs, NoRuntimecodeHere } from "@utils/index";
import "@circular/b";
import { A } from "@circular/a";
import * as path from "path";
import * as b from "circular/a";
import * as c from "../circular/a";
import { myNative } from "@utils/utils.native";

c.A;
b.A;
path.sep;
myNative();

sum.sum(2, 3);

const n: NoRuntimecodeHere = null as any;

subs(2, 3);
const a = new A("");

(async function () {
  const Logger = await (await import("@dynamic/logger")).Logger;
  const logger = new Logger();

  logger.log("hi");
})();

(async function () {
  const Tester = (await import("@dynamic/tester")).Tester;

  const testerConst = (await import("@dynamic/tester")).tester;
  const testerClass = new Tester();

  testerClass.test(12);
  testerConst.test("12");
})();
