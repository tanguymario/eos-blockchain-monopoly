var store = require('store');
var stringUtils = require('../../utils/string-utils.js');
var basics = require('../../utils/basics.js');
var exists = basics.exists;

class BMPlayer {

  static StoreStringID() { return "bm-player"; }

  constructor (gameManager) {
    
    // Decomment this if we want to force client to type his ID each time
    store.remove(BMPlayer.StoreStringID);
    
    this.address = this._getAddress();
    this.data = undefined;
    this.currentCity = undefined;
    this.gameManager = gameManager;
    this.ownedCities = [];
  }

  _getAddress() {
    var address = store.get(BMPlayer.StoreStringID);
    while (stringUtils.isNullOrEmpty(address)) {
      address = prompt("Please enter your account address", "");
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

    var currentPlayerCity = cities[playerJSON.currentCityId];
    if (currentPlayerCity) {
      currentPlayerCity.setCurrentCity(this);
      this.currentCity = currentPlayerCity;
    }
  }
}

module.exports = BMPlayer;