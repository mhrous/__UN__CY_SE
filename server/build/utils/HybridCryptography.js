"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _SymmetricCryptography = _interopRequireDefault(require("./SymmetricCryptography"));

var _AsymmetricCryptography = _interopRequireDefault(require("./AsymmetricCryptography"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HybridCryptography {
  constructor() {
    this.symmetric = new _SymmetricCryptography.default();
    this.asymmetric = new _AsymmetricCryptography.default();
  }

  setReceiverPublicKey(key) {
    this.asymmetric.setReceiverPublicKey(key);
  }

  setPublicKey(key) {
    this.asymmetric.setPublicKey(key);
  }

  setPrivateKey(key) {
    this.asymmetric.setPrivateKey(key);
  }

  getPublicKey() {
    return this.asymmetric.getPublicKey();
  }

  setKye(key) {
    this.symmetric.setKye(key);
  }

  setIv(iv) {
    this.symmetric.setIv(iv);
  }

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);

    const _kye = _crypto.default.randomBytes(32);

    const _iv = _crypto.default.randomBytes(16);

    this.setKye(_kye);
    this.setIv(_iv);
    const dataEncrypt = this.symmetric.encrypt(data);
    const keyEncrypt = this.asymmetric.encrypt({
      _kye,
      _iv
    });
    return {
      dataEncrypt,
      keyEncrypt
    };
  }

  decrypt(data, returnJson = true) {
    const {
      dataEncrypt,
      keyEncrypt
    } = data;
    const {
      _kye,
      _iv
    } = this.asymmetric.decrypt(keyEncrypt);
    this.setKye(_kye);
    this.setIv(_iv);
    return returnJson ? this.symmetric.decrypt(dataEncrypt) : this.symmetric.decrypt(dataEncrypt, false);
  }

}

var _default = HybridCryptography;
exports.default = _default;