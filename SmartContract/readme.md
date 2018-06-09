- setup accounts (do only once at beginning)
	- cleos create wallet (remember the password)
	- cleos wallet import 5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8
	- cleos wallet import 5JqCiws4qarUV1uuCqRBcE1pjRqA6wfEaNFZZY1WXp1kQSjW5hw
	- cleos create account eosio monopoly 5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8 5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8

- deploy contract
	- create a new directory called monopoly under contracts
	- copy monopoly.hpp monopoly.cpp to the newly created directory
	- eosiocpp -o monopoly.wasm monopoly.cpp
	- eosiocpp -g monopoly.abi monopoly.hpp
	- cleos set contract monopoly /contracts/monopoly -p monopoly 

