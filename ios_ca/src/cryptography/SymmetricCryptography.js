import  crypto from"crypto";

class SymmetricCryptography {
    constructor() {
        this.algorithm = "aes-256-cbc";
        this.outputEncoding ='hex'
        this.ivlength =16
        this.key = null;
    }
    setKye(key) {
        if (!Buffer.isBuffer(key)) this.key = Buffer.from(key);
        else this.key = key;
    }

    encrypt(data) {
        if (typeof data == "object") data = JSON.stringify(data);
        const iv = crypto.randomBytes(this.ivlength );
        let cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
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
        let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return returnJson ? JSON.parse(decrypted.toString()) : decrypted.toString();
    }
}

export default SymmetricCryptography;
