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
import fetchValue from "./src/fetch-value.mjs";
let parser = null;

(async () => {
	console.log("Start");
	parser = await initParser();
	console.log("Parser initialized");
	// const code = await fetchContract("0xf233dcee88fe0abe", "FungibleToken");

	const address = "0x921ea449dffec68a";
	const contractName = "FlovatarComponent";

	const code = await fetchContract(address, contractName);
	console.log("Contract fetched");

	/*
	const manualCode = `
		pub contract Hello{
			pub let total: UFix64

			pub fun getTotal():UFix64{
				return self.total
			}

			init(){
				self.total = 42
			}
		}
	`
*/

	const ast = parser.parse(code);

	// TODO:
	// - provide info about extra types and imports. For example, FlovatarComponent.ComponentData is a struct
	// on FlovatarComponent contract

	console.log("Filtering Declarations");
	const declarations = ast.program.Declarations.filter(isContract).map((obj) => {
		const filtered = obj.Members.Declarations.filter((item) => {
			return isFieldDeclaration(item) || isPublicFunction(item);
		});

		// TODO: Accumulate types on contract level or imported types

		return filtered.map((item) => {
			const isFunc = isFunction(item);
			const name = getName(item);
			const type = isFunc ? getReturnType(item) : getType(item);

			let args = isFunc ? getArgumentList(item) : null;

			return {
				name,
				type,
				isFunction: isFunc,
				args,
			};
		});

		return [];
	});

	declarations[0].forEach(async (item) => {
		console.log(item);
	});

	/*
		declarations[0].forEach(async (item) => {
			console.log(item);
			// const value = await fetchValue({ contractName, address }, { name, type });
			// console.log(value);
			//console.log(`${name} (${type}:`, value)
		});
		 */
})();
