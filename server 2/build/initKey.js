"use strict";

const {
  writeFileSync
} = require("fs");

const {
  generateKeyPairSync
} = require("crypto");

const path = require("path");

const PASSPHRASE = "1234567";
const {
  publicKey,
  privateKey
} = generateKeyPairSync("rsa", {
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
writeFileSync(path.join(__dirname, "/publicKey.txt"), publicKey);
writeFileSync(path.join(__dirname, "/privateKey.txt"), privateKey);