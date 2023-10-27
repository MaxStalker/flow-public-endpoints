// TODO: Rework into proper solution THIS IS SUPER SIMPLIFICATION
const simpleType = (type) =>
	type.includes("Int") ||
	type.includes("String") ||
	type.includes("Address") ||
	type.includes("UFix") ||
	type.includes("Bool");

const prependContract = (type, contractName) =>
	simpleType(type) ? type : `${contractName}.${type}`;

const fixType = (type, contractName) => {
	if (!(type[0] === "[")) {
		return prependContract(type, contractName);
	} else {
		const baseType = type.slice(1, -1);
		const fixedType = prependContract(baseType, contractName);
		return `[${fixedType}]`;
	}
};

export const makeCall = (argList) => {
	return argList
		? `(${argList
				.map((item) => {
					const { name, label } = item;
					if (label) {
						return name;
					} else {
						return `${name}:${name}`;
					}
				})
				.join(",")})`
		: "";
};

const makeArguments = (argList) => {
	if (!argList || argList.length === 0) {
		return "";
	} else {
		return argList
			.map((item) => {
				const { name, type } = item;
				return `${name}: ${type}`;
			})
			.join(",");
	}
};

const cadenceTemplate = (contractName, address, fieldName, returnType, argList) => `
	import ${contractName} from ${address}
		
	pub fun main(${makeArguments(argList)}): ${fixType(returnType, contractName)}{
		return ${contractName}.${fieldName}${makeCall(argList)}
	}
`;

export default async function fetchValue(contractDetails, fieldDetails, short = true) {
	const { contractName, address } = contractDetails;
	const { name, type, isFunction = false, argList = [], argValues = [] } = fieldDetails;

	const cadence = cadenceTemplate(contractName, address, name, type, argList);
	const script = btoa(cadence);

	const url = `https://rest-mainnet.onflow.org/v1/scripts`;

	const mapped = argValues.map((arg) => btoa(JSON.stringify(arg)));

	try {
		return fetch(url, {
			method: "POST",
			body: JSON.stringify({
				script,
				arguments: mapped,
			}),
		})
			.then((t) => t.json())
			.then(atob)
			.then((result) => {
				const { value } = JSON.parse(result);
				if (short) {
					return value;
				}
				return {
					[name]: value,
				};
			});

	} catch (e) {
		console.error(e);
	}

	return null;
}
