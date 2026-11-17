// vue-tsc patches TypeScript's JS compiler, which TypeScript 7 (native) no longer ships.
// Point it at the TypeScript 6 compiler from Microsoft's compatibility package instead.
const { createRequire } = require("node:module");

const ts6 = createRequire(require.resolve("@typescript/typescript6/package.json"));
require("vue-tsc").run(ts6.resolve("@typescript/old/lib/tsc"));
