// password for wallet
// PW5KZnNQ7n1tEYzFFFnQSnTtvoiQ4jsfFfJUVknXw2gyHq28mpmDJ

// Private key: 5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8
// Public key: EOS7aAYuDjo5hZFGR5MA2ErL5WAcwjfbjhDGeHyHhPWhhnHKmyR8X
// used for monopoly 

// Private key: 5JqCiws4qarUV1uuCqRBcE1pjRqA6wfEaNFZZY1WXp1kQSjW5hw
// Public key: EOS7TWDZGrZ3RuvLb9QZ9wsZ7whBvVt9SjJgLTJoJy2LuosYKrYSX
// used for playera

Eos = require("eosjs"); // Eos = require('./src')
binaryen = require("binaryen");

keyProvider = "5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8";
pubkey = "EOS7aAYuDjo5hZFGR5MA2ErL5WAcwjfbjhDGeHyHhPWhhnHKmyR8X";

// keyProvider = "5JqCiws4qarUV1uuCqRBcE1pjRqA6wfEaNFZZY1WXp1kQSjW5hw";
// pubkey = "EOS7TWDZGrZ3RuvLb9QZ9wsZ7whBvVt9SjJgLTJoJy2LuosYKrYSX";

eos = Eos({ keyProvider, binaryen });

//eos.getInfo({}).then(result => console.log(result))

const add0 = eos.transaction({
  actions: [
    {
      account: "monopoly",
      name: "addcity",
      authorization: [
        {
          actor: "monopoly",
          permission: "active"
        }
      ],
      data: {
        cityId: 0,
        price: 100,
        treasure: 0,
        neighbors: [1, 2]
      }
    }
  ]
});

const add1 = eos.transaction({
  actions: [
    {
      account: "monopoly",
      name: "addcity",
      authorization: [
        {
          actor: "monopoly",
          permission: "active"
        }
      ],
      data: {
        cityId: 1,
        price: 100,
        treasure: 0,
        neighbors: [0, 3]
      }
    }
  ]
});

const add2 = eos.transaction({
  actions: [
    {
      account: "monopoly",
      name: "addcity",
      authorization: [
        {
          actor: "monopoly",
          permission: "active"
        }
      ],
      data: {
        cityId: 2,
        price: 100,
        treasure: 0,
        neighbors: [0, 3]
      }
    }
  ]
});

const add3 = eos.transaction({
  actions: [
    {
      account: "monopoly",
      name: "addcity",
      authorization: [
        {
          actor: "monopoly",
          permission: "active"
        }
      ],
      data: {
        cityId: 3,
        price: 100,
        treasure: 0,
        neighbors: [1, 2]
      }
    }
  ]
});

const addCities = Promise.all([add0, add1, add2, add3])

addCities.then(result => {
  console.log(result)
}).catch(err => console.log(err))
