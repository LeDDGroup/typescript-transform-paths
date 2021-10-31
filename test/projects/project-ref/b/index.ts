_expect(_test_referenced, { path: "../a/index" });
export { AReffedConst } from "#a/index";

_expect(_test_local, { path: "./local/index" });
export { LocalConst } from "#b/local/index";
