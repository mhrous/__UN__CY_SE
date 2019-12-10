const crypto = require("crypto");

class AsymmetricCryptography {
  constructor() {
    this.publicKey = null;
    this.privateKey = null;
    this.receiverPublicKey = null;
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

    const encrypted = crypto.publicEncrypt(this.receiverPublicKey, buffer);

    return encrypted.toString("base64");
  }

  decrypt(data, returnJson = true) {
    const buffer = Buffer.from(data, "base64");
    const decrypted = crypto.privateDecrypt(
      { key: this.privateKey.toString(), passphrase: PASSPHRASE },
      buffer
    );
    return returnJson
      ? JSON.parse(decrypted.toString("utf8"))
      : decrypted.toString("utf8");
  }
}

module.exports = AsymmetricCryptography;
