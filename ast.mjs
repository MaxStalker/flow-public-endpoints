import { CadenceParser } from "@onflow/cadence-parser";
import * as fs from "fs";

import fetchContract from "./src/fetch-contract.mjs";
import initParser, {
	isFieldDeclaration,
	isContract,
	getName,
	getType,
	isPublicFunction,
	isFunction,
	getReturnType,
	getArgumentList,
} from "./src/parser.mjs";
import fetchValue, { makeCall } from "./src/fetch-value.mjs";
import getDeclarations, { extractDeclarations } from "./src/get-declarations.mjs";
let parser = null;

(async () => {
	console.log("Start");
	parser = await initParser();
	console.log("Parser initialized");

	const code = `
		pub contract Hello{
			pub let total: UFix64

			pub fun getTotal(address: Address):UFix64{
				return self.total
			}
			
			pub fun calc(_ a: Int, b: Int): Int{
				return a + b
			}

			init(){
				self.total = 42
			}
		}
	`;

	const ast = parser.parse(code);
	const declarations = extractDeclarations(ast);
	console.log(declarations);
	console.log("done");

	console.log(
		makeCall([
			{
				name: "a",
				type: "Int",
				label: "_",
			},
			{
				name: "b",
				type: "Int",
				label: "",
			},
		]),
	);
	// const declarations = await getDeclarations(parser)(address, contractName);
})();
