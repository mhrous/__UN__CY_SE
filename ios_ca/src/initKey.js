const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");
const path = require("path");

const PASSPHRASE = "1234567";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem"
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: PASSPHRASE
  }
});

writeFileSync(
    path.join(__dirname, "/CA_KEY.js"),
    `
const publicKey =\`${publicKey}\` 

const privateKey =\`${privateKey}\`

module.exports={publicKey,privateKey}
 `
);


writeFileSync(path.join(__dirname,'../..',"ios_client/CA_KEY.js"),    `
const publicKey =\`${publicKey}\` 
module.exports={publicKey}
 `);
writeFileSync(path.join( __dirname,'../..',"ios_server/CA_KEY.js"),    `
const publicKey =\`${publicKey}\` 
module.exports={publicKey}
 `);
