"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SymmetricCryptography {
  constructor() {
    this.algorithm = "aes-256-cbc";
    this.key = null;
    this.iv = null;
  }

  setKye(key) {
    if (!Buffer.isBuffer(key)) this.key = Buffer.from(key.data);else this.key = key;
  }

  setIv(iv) {
    if (!Buffer.isBuffer(iv)) this.iv = Buffer.from(iv.data);else this.iv = iv;
  }

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);

    let cipher = _crypto.default.createCipheriv(this.algorithm, this.key, this.iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString("hex"),
      encryptedData: encrypted.toString("hex")
    };
  }

  decrypt(data, returnJson = true) {
    let encryptedText = Buffer.from(data.encryptedData, "hex");

    let decipher = _crypto.default.createDecipheriv(this.algorithm, this.key, this.iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return returnJson ? JSON.parse(decrypted.toString()) : decrypted.toString();
  }

}

var _default = SymmetricCryptography;
exports.default = _default;