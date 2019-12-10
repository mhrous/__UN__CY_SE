"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateKeys = void 0;

var _crypto = require("crypto");

var _config = require("../config");

const generateKeys = () => (0, _crypto.generateKeyPairSync)("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem"
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: _config.PASSPHRASE
  }
});

exports.generateKeys = generateKeys;