import express from "express";

import initParser from "./src/parser.mjs";
import getDeclarations from "./src/get-declarations.mjs";
import fetchValue from "./src/fetch-value.mjs";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

let parser, server;

// Routes
app.get("/mainnet/:address/:contractName", async (req, res) => {
	const { address, contractName } = req.params;

	const declarations = await getDeclarations(parser)(address, contractName);

	res.json(declarations);
});

app.post("/mainnet/:address/:contractName/:field", async (req, res) => {
	const { address, contractName, field } = req.params;

	const declarations = await getDeclarations(parser)(address, contractName);

	const fieldParams = declarations[field];
	if (fieldParams) {
		const { name, type, isFunction} = fieldParams;

		if (isFunction) {
			const { args } = req.body;
			const value = await fetchValue(
				{ contractName, address },
				{ name, type, isFunction, argValues: args, argList: fieldParams.args },
			);
			res.json(value);
		} else {
			const value = await fetchValue({ contractName, address }, { name, type });
			res.json(value);
		}
	} else {
		res.status(404).send("Field not found");
	}
});

// Init
(async () => {
	console.clear()
	console.log("Starting service");
	try {
		console.log("Initializing parser");
		parser = await initParser();
	} catch (e) {
		console.error("[Error]", e);
		return;
	}

	console.log("[Success] Parser initialized!");

	console.log("Launching Express server");
	server = app.listen(port, () => console.log(`[Success] Server is running on ${port}!`));
})();
