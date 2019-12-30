const crypto = require("crypto");

class SymmetricCryptography {
  constructor() {
    this.algorithm = "aes-256-cbc";
    this.key = null;
  }
  setKye(key) {
    if (!Buffer.isBuffer(key)) this.key = Buffer.from(key.data);
    else this.key = key;
  }

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);
    const iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
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

    let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return returnJson ? JSON.parse(decrypted.toString()) : decrypted.toString();
  }
}

module.exports = SymmetricCryptography;
