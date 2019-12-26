import sum = require("@utils/sum");
export { sum } from "@utils";
export { NoRuntimecodeHere } from "@utils/types-only";
import { subs, NoRuntimecodeHere } from "@utils";
import "@circular/b";
import { A } from "@circular/a";
import * as path from "path";
import * as b from "circular/a";
import * as c from "../circular/a";
import { myNative } from "@utils/utils.native";
import { Logger } from "@dynamic/logger";
import { LogLevel } from "@dynamic/logger-types";

type LoggerManager = import("@dynamic/manager").LoggerManager;

c.A;
b.A;
path.sep;
myNative();

sum.sum(2, 3);

const n: NoRuntimecodeHere = null as any;

subs(2, 3);
const a = new A("");

const manager: LoggerManager = {
  loggers: [
    new Logger(),
    new Logger(),
  ]
};

manager.loggers.forEach((logger) => {
  logger.log({
    level: LogLevel.DEBUG,
    text: 'test',
  })
})