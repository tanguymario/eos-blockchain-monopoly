var Eos = require('eosjs');
var binaryen = require("binaryen");

var keyProvider = "5JqCiws4qarUV1uuCqRBcE1pjRqA6wfEaNFZZY1WXp1kQSjW5hw";
var pubkey = "EOS7TWDZGrZ3RuvLb9QZ9wsZ7whBvVt9SjJgLTJoJy2LuosYKrYSX";
var accountName = "playera";

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
    var cityId = parseInt(city.id);

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
              cityId: cityId
            }
          }
        ]
      }).then(result => resolve(result))
      .catch(reject)
    })
  }

  moveToCity(city, player) {
    var cityId = parseInt(city.id);

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
              cityId: cityId
            }
          }
        ]
      }).then(result => resolve(result))
      .catch(reject)
    })
  }

  collectTreasure(city, player) {
    var cityId = parseInt(city.id);

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
              cityId: cityId
            }
          }
        ]
      }).then(result => resolve(result))
      .catch(reject)
    })
  }
}

module.exports = BlockchainInterface;