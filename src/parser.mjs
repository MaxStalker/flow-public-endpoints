import { CadenceParser } from "@onflow/cadence-parser";
import { readFileSync } from "fs";

export default async function initParser() {
	let file = readFileSync("./src/wasm/cadence-parser.wasm");
	return CadenceParser.create(file);
}

export function isContract(item) {
	return item.CompositeKind === "CompositeKindContract";
}

export function isPublic(item) {
	return item.Access === "AccessPublic";
}

export function isFunction(item) {
	return item.Type === "FunctionDeclaration";
}

export function isFieldDeclaration(item) {
	return isPublic(item) && item.Type === "FieldDeclaration";
}

export function isPublicFunction(item) {
	if (!isPublic(item)) {
		return false;
	}

	if (isFunction(item)) {
		return !item.ReturnTypeAnnotation.IsResource;
	}

	return false;
}

export function getName(item) {
	return item.Identifier.Identifier;
}

export function getType(item) {
	return getName(item.TypeAnnotation.AnnotatedType);
}

export function getReturnType(item) {
	const type = item.ReturnTypeAnnotation.AnnotatedType;

	if (type.Type !== "NominalType") {

/*		if(getName(item) === "getComponent"){
			console.log(JSON.stringify(item))
		}*/

		let baseType = `${getName(type.ElementType)}`;

		if(type.Type === "OptionalType"){
			baseType += "?"
		}

		if (type.Type === "VariableSizedType") {
			return `[${baseType}]`;
		} else {
			return baseType;
		}
	}

	return getName(type);
}

export function getArgumentList(item) {
	if (item.ParameterList.Parameters) {
		const list = item.ParameterList.Parameters.reduce((acc, param) => {
			const name = getName(param);
			const type = getType(param);
			const label = param.Label
			acc.push({ name, type, label });
			return acc;
		}, []);

		return list;
	}
	return [];
}
