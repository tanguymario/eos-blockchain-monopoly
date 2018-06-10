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

// keyProvider = "5J9UGDfqqjdKh5waZqp8cc1pUFBguvF4xtg5QNicCaRgugn9Ta8";
// pubkey = "EOS7aAYuDjo5hZFGR5MA2ErL5WAcwjfbjhDGeHyHhPWhhnHKmyR8X";

keyProvider = "5JqCiws4qarUV1uuCqRBcE1pjRqA6wfEaNFZZY1WXp1kQSjW5hw";
pubkey = "EOS7TWDZGrZ3RuvLb9QZ9wsZ7whBvVt9SjJgLTJoJy2LuosYKrYSX";

eos = Eos({ keyProvider, binaryen });


eos.getTableRows({
    json: true,
    code: "monopoly",
    scope: "monopoly",
    table: "players",
    table_key: "playerb"
}).then(res => console.log(res))

// eos.transaction({
//   actions: [
//     {
//       account: "monopoly",
//       name: "moveto",
//       authorization: [
//         {
//           actor: "playerb",
//           permission: "active"
//         }
//       ],
//       data: {
//         player: "playerb",
//         cityId: 0
//       }
//     }
//   ]
// }).then(result => {
//   return eos.getTableRows({
//     json: true,
//     code: "monopoly",
//     scope: "monopoly",
//     table: "players",
//     table_key: "playerb"
//   })
// }).then(result => console.log(result))
// .catch(err => console.log(err))


