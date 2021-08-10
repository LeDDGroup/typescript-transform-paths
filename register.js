let tsNode;
try {
  tsNode = require('ts-node');
} catch {}

if (!tsNode) throw new Error(`Cannot register transformer without ts-node.`);

tsNode.register();
require('./').register();
