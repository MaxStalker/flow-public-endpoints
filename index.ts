import { CadenceParser } from "@onflow/cadence-parser";

(async () => {
	const parser = await CadenceParser.create("cadence-parser.wasm");

	const ast = parser.parse(`
  pub contract HelloWorld {
    pub fun hello() {
      log("Hello, world!")
    }
  }
`);
})();
