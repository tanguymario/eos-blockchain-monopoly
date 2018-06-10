#include <monopoly.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/action.hpp>
#include <iostream>
#include <stdio.h>      /* printf, scanf, puts, NULL */
#include <time.h>       /* time */

using namespace std;

void Monopoly::clearcities(const account_name player) {
	require_auth(_self);

	auto iterator = m_cityTable.begin();
	while (iterator != m_cityTable.end()) {
		iterator = m_cityTable.erase(iterator);
	}
}

void Monopoly::clearplayers(const account_name player) {
	require_auth(_self);
	auto iterator = m_playerTable.begin();
	while (iterator != m_playerTable.end()) {
		iterator = m_playerTable.erase(iterator);
	}
}

void Monopoly::addtreasure(const uint64_t cityId, const uint64_t value) {
	require_auth(_self);
	auto cityItr = m_cityTable.find( cityId );
	eosio_assert( cityItr != m_cityTable.end(), "City doesn't exist." );

	m_cityTable.modify(cityItr, _self, [&](auto& p) {
	    p.treasure = 500;
    });
}

void Monopoly::addcity(const uint64_t cityId, const uint64_t price, const uint64_t treasure, const std::vector<uint64_t> neighbors) {
	require_auth(_self);
	eosio_assert(m_cityTable.find(cityId) == m_cityTable.end(), "City already exists");
	m_cityTable.emplace (_self, [&](auto& newCity) {
        newCity.id = cityId;
        newCity.price = price;
        newCity.treasure = treasure;
        newCity.neighbors = neighbors;
        newCity.owner = _self;
    });
}

void Monopoly::buy(const account_name player, const uint64_t cityId) {
	require_auth(player);

	auto cityItr = m_cityTable.find( cityId );
	eosio_assert( cityItr != m_cityTable.end(), "City doesn't exist." );

	auto playerItr = m_playerTable.find(player);  
	eosio_assert(playerItr != m_playerTable.end(), "Move to a city first.");

	eosio_assert(playerItr->currentCityId == cityId, "Move to this city first.");

	if (playerItr->balance >= cityItr->price) {
	  m_cityTable.modify(cityItr, _self, [&](auto& p) {
	    p.owner = player;
	    p.price *= 2;
	  });

	  m_playerTable.modify(playerItr, _self, [&](auto& p) {
	    p.balance -= cityItr->price;
	  });
	}
}  

void Monopoly::moveto(const account_name player, const uint64_t cityId) {
    require_auth(player);
    auto cityItr = m_cityTable.find( cityId );
    eosio_assert( cityItr != m_cityTable.end(), "City doesn't exist." );
  
    auto playerItr = m_playerTable.find(player);  
    if (playerItr == m_playerTable.end()) {
      m_playerTable.emplace (_self, [&](auto& newPlayer) {
        newPlayer.account = player;
        newPlayer.balance = 1000;
        newPlayer.currentCityId = cityId;
      });
    } else { 
      if (cityItr->owner != player) {
        auto currentCityId = playerItr->currentCityId;
        bool canMove = false;
        for (int i = 0; i < cityItr->neighbors.size(); i++) {
        	if (cityItr->neighbors[i] == currentCityId) {
        		canMove = true;
        		break;
        	}
        }
        // if (cityItr->neighbors.find(currentCityId) != cityItr->neighbors.end()) {
        //   canMove = true;
        // }
        eosio_assert( canMove, "Cannot move." ); 
      } 
      // deduct balance
      if (cityItr->owner != _self) {
	      uint64_t toll = cityItr->price * 0.01;
	      eosio_assert(playerItr->balance >= toll, "Not enough money.");
	      m_playerTable.modify(playerItr, _self, [&](auto& p) {
	        p.currentCityId = cityId;
	        p.balance -= toll;
	      });
  	  } else {
  	  	  m_playerTable.modify(playerItr, _self, [&](auto& p) {
	        p.currentCityId = cityId;
	      });
  	  }
    }
}

void Monopoly::claimtreasure(const account_name player, const uint64_t cityId) {
    require_auth(player);
    auto cityItr = m_cityTable.find( cityId );
    eosio_assert( cityItr != m_cityTable.end(), "City doesn't exist." );

    auto playerItr = m_playerTable.find(player);  
    eosio_assert(playerItr != m_playerTable.end(), "Move to a city first.");

    if (cityItr->treasure > 0) {
      m_cityTable.modify(cityItr, _self, [&](auto& p) {
        p.treasure = 0;
      });

      m_playerTable.modify(playerItr, _self, [&](auto& p) {
        p.balance += cityItr->treasure;
      });
    }
}
