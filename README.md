# Introduction

Sometimes your app simply needs to read a value from one or several contracts and display it in UI.
Flow Public Endpoints provide you this information by pulling it from chain using available Access
nodes.

Terminals can be used to fetch value without installing any extra dependencies.

# How to use

Send `POST` request with following fields in the body:

- ~~network~~ _(currently only mainnet supported)_
- contract name
- address
- list of arguments

## Flovatar `getComponent`

```bash
curl --request POST \
  --url https://flow-public-endpoints.onrender.com/mainnet/0x921ea449dffec68a/FlovatarComponent/getComponent \
  --header 'Content-Type: application/json' \
  --data '{
	"args": [
		{
			"type": "Address",
			"value": "0x309c72eaa414cdc5"
		},
				{
			"type": "UInt64",
			"value": "62028"
		}
	]
}'
```


## FlovatarComponent `totalSupply`
```bash
curl --request POST \
  --url https://flow-public-endpoints.onrender.com/mainnet/0x921ea449dffec68a/FlovatarComponent/totalSupply \
  --header 'Content-Type: application/json' \
  --data '{}'
```