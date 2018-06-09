var Eos = require('eosjs');
var JSONLoader = require('../../utils/json-loader.js');

class BlockchainInterface {
  constructor() {
    // TODO
  }

  getCities(callbackSuccess, callbackError) {
    // TODO
    new JSONLoader('assets/json/blockchainLocalTest.json', {
      callbackSuccess: callbackSuccess,
      callbackError: callbackError
    }).load();
  }

  getPlayer(callbackSuccess, callbackError) {
    // TODO
    new JSONLoader('assets/json/blockchainPlayer.json', {
      callbackSuccess: callbackSuccess,
      callbackError: callbackError
    }).load();
  }

  buyCity(city, player) {
    // TODO
    console.log("TODO");
    console.log(city);
    console.log(player);
  }

  moveToCity(city, player) {
    // TODO
    console.log("TODO");
    console.log(city);
    console.log(player);
  }

  collectTreasure(city, player) {
    // TODO
    console.log("TODO");
    console.log(city);
    console.log(player);
  }
}

module.exports = BlockchainInterface;