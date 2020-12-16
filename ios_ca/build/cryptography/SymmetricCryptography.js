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
    this.outputEncoding = 'hex';
    this.ivlength = 16;
    this.key = null;
  }

  setKye(key) {
    if (!Buffer.isBuffer(key)) this.key = Buffer.from(key);else this.key = key;
  }

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);

    const iv = _crypto.default.randomBytes(this.ivlength);

    let cipher = _crypto.default.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: iv.toString(this.outputEncoding),
      encryptedData: encrypted.toString(this.outputEncoding)
    };
  }

  decrypt(data, returnJson = true) {
    let encryptedText = Buffer.from(data.encryptedData, this.outputEncoding);
    let iv = Buffer.from(data.iv, this.outputEncoding);

    let decipher = _crypto.default.createDecipheriv(this.algorithm, this.key, iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return returnJson ? JSON.parse(decrypted.toString()) : decrypted.toString();
  }

}

var _default = SymmetricCryptography;
exports.default = _default;