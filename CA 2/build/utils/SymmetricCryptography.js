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
  }

  setKye(key) {
    if (!Buffer.isBuffer(key)) this.key = Buffer.from(key.data);else this.key = key;
  }

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);

    const iv = _crypto.default.randomBytes(16);

    let cipher = _crypto.default.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: iv.toString("hex"),
      encryptedData: encrypted.toString("hex")
    };
  }

  decrypt(data, returnJson = true) {
    let encryptedText = Buffer.from(data.encryptedData, "hex");
    let iv = Buffer.from(data.iv, "hex");

    let decipher = _crypto.default.createDecipheriv(this.algorithm, this.key, iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return returnJson ? JSON.parse(decrypted.toString()) : decrypted.toString();
  }

}

var _default = SymmetricCryptography;
exports.default = _default;