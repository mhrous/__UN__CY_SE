"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _SymmetricCryptography = _interopRequireDefault(require("./SymmetricCryptography"));

var _AsymmetricCryptography = _interopRequireDefault(require("./AsymmetricCryptography"));

var _config = require("../config");

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

    const _iv = _crypto.default.randomBytes(16); // const { key:_kye, iv:_iv } = JSON.parse(KEY);


    this.setKye(_kye);
    this.setIv(_iv);
    const dataEncrypt = this.symmetric.encrypt(data);
    const keyEncrypt = this.asymmetric.encrypt({
      _kye,
      _iv
    });

    const sign = _crypto.default.createSign("SHA256");

    sign.write(data);
    sign.end();
    const signature = sign.sign({
      key: this.asymmetric.privateKey,
      passphrase: _config.PASSPHRASE
    }, "hex");
    return {
      dataEncrypt,
      keyEncrypt,
      signature
    };
  }

  decrypt(data, returnJson = true) {
    console.log(_config.PASSPHRASE);
    const {
      dataEncrypt,
      keyEncrypt,
      signature
    } = data;
    const {
      _kye,
      _iv
    } = this.asymmetric.decrypt(keyEncrypt);
    this.setKye(_kye);
    this.setIv(_iv);
    const dataDecrupt = this.symmetric.decrypt(dataEncrypt, false);

    const verify = _crypto.default.createVerify("SHA256");

    verify.write(dataDecrupt);
    verify.end();
    const resSignature = verify.verify({
      key: this.asymmetric.receiverPublicKey,
      passphrase: _config.PASSPHRASE
    }, signature, "hex");

    if (!resSignature) {
      return null;
    }

    return returnJson ? JSON.parse(dataDecrupt) : dataDecrupt;
  }

}

var _default = HybridCryptography;
exports.default = _default;