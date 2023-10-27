# Introduction
Sometimes your app simply needs to read a value from one or several contracts and display it in UI.
Flow Public Endpoints provide you this information by pulling it from chain using available Access 
nodes.

Terminals can be used to fetch value without installing any extra dependencies.

# How to use
Send `POST` request with following fields in the body:
- ~~network~~ *(currently only mainnet supported)*
- contract name
- address
- list of arguments

```bash
    curl https://flow-public-endpoints.vercel.com/mainnet/contractName/address/field
```