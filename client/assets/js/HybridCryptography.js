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

    // const { key:_kye, iv:_iv } = JSON.parse(KEY);
    this.setKye(_kye);
    this.setIv(_iv);
    const dataEncrypt = this.symmetric.encrypt(data);
    const keyEncrypt = this.asymmetric.encrypt({ _kye, _iv });
    // strat signature
    const sign = crypto.createSign("SHA256");
    sign.write(data);
    sign.end();
    //incrypt the sign with orivate aassymetric 
    const signature = sign.sign(
      { key: this.asymmetric.privateKey, passphrase: PASSPHRASE },
      "hex"
    );
    return { dataEncrypt, keyEncrypt, signature };
  }
  decrypt(data, returnJson = true) {
    const { dataEncrypt, keyEncrypt, signature } = data;

    const { _kye, _iv } = this.asymmetric.decrypt(keyEncrypt);
    this.setKye(_kye);
    this.setIv(_iv);
    //
    const dataDecrupt = this.symmetric.decrypt(dataEncrypt, false);
    const verify = crypto.createVerify("SHA256");
    verify.write(dataDecrupt);
    verify.end();
    //
    const resSignature = verify.verify(
      { key: this.asymmetric.receiverPublicKey, passphrase: PASSPHRASE },
      signature,
      "hex"
    );
    // make the private verid-fy
    if (!resSignature) {
      swal("e`rror", "signature error", "error");
      return 
    }
    return returnJson ? JSON.parse(dataDecrupt) : dataDecrupt;
  }
}

module.exports = HybridCryptography;
