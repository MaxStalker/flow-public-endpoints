/**
 * @param {string} address
 * @param {string} name
 * */

export default async function fetchContract(address, name) {
	const accessNode = `https://rest-mainnet.onflow.org/v1`;
	const filter = `expand=contracts&select=contracts.${name}`;
	const url = `${accessNode}/accounts/${address}?${filter}`;
	const data = await fetch(url).then((t) => t.json());

	if(data){
		return atob(data.contracts[name])
	}

	return null
}
