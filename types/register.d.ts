import TSNode from "ts-node";
import type { REGISTER_INSTANCE } from "ts-node";

export function register(): TSNode.RegisterOptions | undefined;

export declare namespace register {
  function initialize(): {
    tsNode: typeof TSNode;
    instanceSymbol: typeof REGISTER_INSTANCE;
    tsNodeInstance: TSNode.Service;
  };
}

export default register;
