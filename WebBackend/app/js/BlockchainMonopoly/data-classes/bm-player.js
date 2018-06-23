var store = require('store');
var stringUtils = require('../../utils/string-utils.js');
var basics = require('../../utils/basics.js');
var exists = basics.exists;
var getPromptString = basics.getPromptString;

class BMPlayer {

  static StoreStringID() { return "bm-player-id"; }

  constructor (gameManager) {
    this.address = this._getAddress();
    this.data = undefined;
    this.currentCity = undefined;
    this.gameManager = gameManager;
    this.ownedCities = [];
  }

  _getAddress() {
    var address = store.get(BMPlayer.StoreStringID);
    while (address == null || address.length != 35) {
      address = getPromptString("Please enter your user 35-character-long account address");
    }
    store.set(BMPlayer.StoreStringID, address); 
    return address;
  }

  initialize(cities, playerJSON) {
    if (!exists(cities)) {
      console.error("[BMPlayer] Cities missing!");
      return;
    } else if (!exists(playerJSON)) {
      console.error("[BMPlayer] Player JSON missing");
      return;
    }

    this.ownedCities = [];
    this.data = playerJSON;

    var citiesKeys = Object.keys(cities);
    citiesKeys.forEach(
      (function(cityKey) {
        var city = cities[cityKey];
        if (city.data.owner === this.address) {
          city.setOwnedCity();
          this.ownedCities.push(city);
        } 
      }).bind(this)
    );

    var currentPlayerCity = cities[this.data.result];
    if (currentPlayerCity) {
      this.currentCity = currentPlayerCity;
      currentPlayerCity.setCurrentCity(this);
    }
  }
}

module.exports = BMPlayer;