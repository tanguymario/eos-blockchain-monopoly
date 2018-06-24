
var nebulas = require("nebulas"),
Account = nebulas.Account,
Unit = nebulas.Unit,
neb = new nebulas.Neb();
var api = neb.api;
//neb.setRequest(new nebulas.HttpRequest("http://localhost:8685"))
//neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"))
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))

var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;

var gasPrice = 1000000;
var gasLimit = 2000000;

api.gasPrice().then(function(result) {
    if (result) {
        console.log(result)
        gasPrice = result.gas_price;
    }
});

function nebPayCallPromise(to, value, callFunction, callArgs, cb) {
    return new Promise(function(resolve, reject) {
        nebPay.call(to, value, callFunction, callArgs, {
            listener: cb 
        });
        resolve()
    });
}

class BlockchainInterface {
    constructor() {
        //this.dappAddress = "n1qgXx1XhejG4SrMCe6oZBe2E8sf4SY4gM8"; //local
        //this.dappAddress = "n22FPNrDvDz6zJUBteX5jCMxWjgcgR6Toq6"; //testnet
        this.dappAddress = "n22FPNrDvDz6zJUBteX5jCMxWjgcgR6Toq6"; //mainnet
        this.assistantAccount = Account.NewAccount()
    }

    getCities() {
        var self = this;
        return new Promise((resolve, reject) => {
            neb.api.getAccountState(self.assistantAccount.getAddressString()).then(function(state){
                var assistanceState = state
                var contract = {
                    "function": "getCities",
                    "args": "[]"
                }

                return neb.api.call(
                    self.assistantAccount.getAddressString(), 
                    self.dappAddress, 
                    0, 
                    parseInt(assistanceState.nonce) + 1,
                    gasPrice,
                    gasLimit,
                    contract
                )
            }).then(function (resp) {
                resolve(resp)
            }).catch(reject)
        })
    }

    getPlayerPositions() {
        var self = this;
        return new Promise((resolve, reject) => {
            neb.api.getAccountState(self.assistantAccount.getAddressString()).then(function(state){
                var assistanceState = state
                var contract = {
                    "function": "getPlayerPositions",
                    "args": "[]"
                }

                return neb.api.call(
                    self.assistantAccount.getAddressString(), 
                    self.dappAddress, 
                    0, 
                    parseInt(assistanceState.nonce) + 1,
                    gasPrice,
                    gasLimit,
                    contract
                )
            }).then(function (resp) {
                resolve(resp)
            }).catch(reject)
        })
    }

    getPlayerPosition(address, callback) {
        var self = this;
        return new Promise((resolve, reject) => {
            neb.api.getAccountState(self.assistantAccount.getAddressString()).then(function(state){
                var assistanceState = state
                var contract = {
                    "function": "getPlayerPosition",
                    "args": "[\"" + address + "\"]"
                }

                return neb.api.call(
                    self.assistantAccount.getAddressString(), 
                    self.dappAddress, 
                    0, 
                    parseInt(assistanceState.nonce) + 1,
                    gasPrice,
                    gasLimit,
                    contract
                )
            }).then(function (resp) {
                resolve(resp)
            }).catch(reject)
        })
    }

    moveTo(city, player, callback) {
        var to = this.dappAddress;
        var value = city.data.price * 0.01;
        if (city.ownedByPlayer || city.data.owner == null) {
          value = 0;
        }
        var callFunction = "move"
        var callArgs = "[" + city.id + "]"

        

        nebPay.call(to, value, callFunction, callArgs, {
            listener: callback 
        });
    }

    claimTreasure(cityId, callback) {
        var to = this.dappAddress;
        var value = "0";
        var callFunction = "claimTreasure"
        var callArgs = "[" + cityId + "]"

        nebPay.call(to, value, callFunction, callArgs, {
            listener: callback 
        });
    }

    buy(cityId, money, callback) {
        var to = this.dappAddress;
        var value = money;
        var callFunction = "buy"
        var callArgs = "[" + cityId + "]"

        nebPay.call(to, value, callFunction, callArgs, {
            listener: callback 
        });
    }

    static basicToNas(val) {
        return Unit.fromBasic(val)
    }

    static nasToBasic(val) {
        return Unit.toBasic(val)
    }
}

module.exports = BlockchainInterface;