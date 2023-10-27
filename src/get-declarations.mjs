import fetchContract from "./fetch-contract.mjs";
import {
	getArgumentList,
	getName,
	getReturnType,
	getType,
	isContract,
	isFieldDeclaration,
	isFunction,
	isPublicFunction,
} from "./parser.mjs";

export function extractDeclarations(ast){
	const [declarations] = ast.program.Declarations.filter(isContract).map((obj) => {
		const filtered = obj.Members.Declarations.filter((item) => {
			return isFieldDeclaration(item) || isPublicFunction(item);
		});

		// TODO: Accumulate types on contract level or imported types
		return filtered.reduce((acc, item) => {
			const isFunc = isFunction(item);
			const name = getName(item);
			const type = isFunc ? getReturnType(item) : getType(item);

			let args = isFunc ? getArgumentList(item) : null;

			acc[name] = {
				name,
				type,
				isFunction: isFunc,
				args,
			};
			return acc;
		}, {});
	});

	return declarations
}

export default function getDeclarations(parser) {
	return async function (address, contractName) {
		const code = await fetchContract(address, contractName);
		const ast = parser.parse(code);

		return extractDeclarations(ast)
	};
}
