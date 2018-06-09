var Eos = require('eosjs');
var binaryen = require("binaryen");

var keyProvider = "5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8";
var pubkey = "EOS7aAYuDjo5hZFGR5MA2ErL5WAcwjfbjhDGeHyHhPWhhnHKmyR8X";
var accountName = "";

var eos = Eos({ keyProvider, binaryen });

var JSONLoader = require('../../utils/json-loader.js');

class BlockchainInterface {
  constructor() {
    // TODO
  }

  getCities() {
    return new Promise((resolve, reject) => {
      eos.getTableRows({
        json: true,
        code: "monopoly",
        scope: "monopoly",
        table: "cities",
      }).then(result => {
        resolve(result.rows);  
      }).catch(reject)
    })
  }

  getPlayer() {
    return new Promise((resolve, reject) => {
      eos.getTableRows({
        json: true,
        code: "monopoly",
        scope: "monopoly",
        table: "players",
      }).then(result => {
        resolve(result.rows);  
      }).catch(reject)
    })
  }

  buyCity(city, player) { // NOTICE: player argument needed?
    return new Promise((resolve, reject) => {
      eos.transaction({
        actions: [
          {
            account: "monopoly",
            name: "buy",
            authorization: [
              {
                actor: accountName,
                permission: "active"
              }
            ],
            data: {
              player: accountName,
              cityId: city
            }
          }
        ]
      }).then(result => resolve(result))
      .catch(reject)
    })
  }

  moveToCity(city, player) {
    return new Promise((resolve, reject) => {
      eos.transaction({
        actions: [
          {
            account: "monopoly",
            name: "moveto",
            authorization: [
              {
                actor: accountName,
                permission: "active"
              }
            ],
            data: {
              player: accountName,
              cityId: city
            }
          }
        ]
      }).then(result => resolve(result))
      .catch(reject)
    })
  }

  collectTreasure(city, player) {
    return new Promise((resolve, reject) => {
      eos.transaction({
        actions: [
          {
            account: "monopoly",
            name: "claimtreasure",
            authorization: [
              {
                actor: accountName,
                permission: "active"
              }
            ],
            data: {
              player: accountName,
              cityId: city
            }
          }
        ]
      }).then(result => resolve(result))
      .catch(reject)
    })
  }
}

module.exports = BlockchainInterface;