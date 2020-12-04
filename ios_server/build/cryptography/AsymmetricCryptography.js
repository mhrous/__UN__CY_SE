"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AsymmetricCryptography {
  constructor(publicKey = null, privateKey = null, receiverPublicKey = null) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.receiverPublicKey = receiverPublicKey;
  }

  setReceiverPublicKey(key) {
    this.receiverPublicKey = key;
  }

  setPublicKey(key) {
    this.publicKey = key;
  }

  setPrivateKey(key) {
    this.privateKey = key;
  }

  getPublicKey() {
    return this.publicKey;
  }

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);
    const buffer = Buffer.from(data, "utf8");

    const encrypted = _crypto.default.publicEncrypt(this.receiverPublicKey, buffer);

    return encrypted.toString("base64");
  }

  decrypt(data, returnJson = true) {
    const buffer = Buffer.from(data, "base64");

    const decrypted = _crypto.default.privateDecrypt({
      key: this.privateKey.toString(),
      passphrase: _config.PASSPHRASE
    }, buffer);

    return returnJson ? JSON.parse(decrypted.toString("utf8")) : decrypted.toString("utf8");
  }

}

var _default = AsymmetricCryptography;
exports.default = _default;