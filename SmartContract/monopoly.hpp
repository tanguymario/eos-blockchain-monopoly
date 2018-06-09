#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <set>
#include <string>

using namespace eosio;
using std::string;

class Monopoly: public contract {
public:
  Monopoly(account_name self) : 
  contract (self), 
  m_cityTable(_self, _self),
  m_playerTable(_self, _self) {}

  // @abi action
  void addcity(const uint64_t cityId, const uint64_t price, const uint64_t treasure, const std::vector<uint64_t> neighbors);

  // @abi action
  void addtreasure(const uint64_t cityId, const uint64_t value);

  // @abi action
  void buy(const account_name player, const uint64_t cityId);

  // @abi action
  void moveto(const account_name player, const uint64_t cityId);

  // @abi action
  void claimtreasure(const account_name player, const uint64_t cityId);

  // @abi action
  void clearcities(const account_name player);

  // @abi action
  void clearplayers(const account_name player);

private:
    // @abi table cities i64
    struct city {
      uint64_t id;
      uint64_t price;
      uint64_t treasure;
      account_name owner;
      std::vector<uint64_t> neighbors;

      uint64_t primary_key() const { return id; }

      EOSLIB_SERIALIZE(city, (id)(price)(treasure)(owner)(neighbors));
    };

    typedef eosio::multi_index<N(cities), city> CityTable;

    // @abi table players i64
    struct player {
      account_name    account;
      uint64_t balance;
      uint64_t currentCityId;

      account_name primary_key() const { return  account; }
      EOSLIB_SERIALIZE(player, (account)(balance)(currentCityId));
    };

    typedef eosio::multi_index<N(players), player> PlayerTable;

    CityTable m_cityTable;
    PlayerTable m_playerTable;
};

EOSIO_ABI(Monopoly, (buy)(moveto)(claimtreasure)(addtreasure)(addcity)(clearcities)(clearplayers))
