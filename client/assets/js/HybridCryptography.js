const crypto = require("crypto");

const SymmetricCryptography = require("./SymmetricCryptography");
const AsymmetricCryptography = require("./AsymmetricCryptography");
class HybridCryptography {
  constructor() {
    this.symmetric = new SymmetricCryptography();
    this.asymmetric = new AsymmetricCryptography();
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
    const _kye = crypto.randomBytes(32);
    const _iv = crypto.randomBytes(16);
    this.setKye(_kye);
    this.setIv(_iv);
    const dataEncrypt = this.symmetric.encrypt(data);
    const keyEncrypt = this.asymmetric.encrypt({ _kye, _iv });

    return { dataEncrypt, keyEncrypt };
  }
  decrypt(data, returnJson = true) {
    const { dataEncrypt, keyEncrypt } = data;

    const { _kye, _iv } = this.asymmetric.decrypt(keyEncrypt);
    this.setKye(_kye);
    this.setIv(_iv);
    return returnJson
      ? this.symmetric.decrypt(dataEncrypt)
      : this.symmetric.decrypt(dataEncrypt, false);
  }
}

module.exports = HybridCryptography;
