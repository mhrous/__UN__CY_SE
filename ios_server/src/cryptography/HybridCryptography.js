import crypto from "crypto";
import SymmetricCryptography from "./SymmetricCryptography";
import AsymmetricCryptography from "./AsymmetricCryptography";
import { PASSPHRASE } from "../config";
class HybridCryptography {
    constructor(publicKey=null,privateKey = null,receiverPublicKey =  null) {
        this.symmetric = new SymmetricCryptography();
        this.asymmetric = new AsymmetricCryptography(publicKey,privateKey,receiverPublicKey);
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

    encrypt(data) {
        if (typeof data == "object") data = JSON.stringify(data);
        const _kye = crypto.randomBytes(32);

        this.setKye(_kye);
        console.log(1)
        const dataEncrypt = this.symmetric.encrypt(data);
        console.log(2)

        const keyEncrypt = this.asymmetric.encrypt({ _kye });
        console.log(3)

        const sign = crypto.createSign("SHA256");
        sign.write(data);
        sign.end();
        const signature = sign.sign(
            { key: this.asymmetric.privateKey, passphrase: PASSPHRASE },
            "hex"
        );
        return { dataEncrypt, keyEncrypt, signature };
    }
    decrypt(data, returnJson = true) {

        const { dataEncrypt, keyEncrypt, signature } = data;
        const { _kye } = this.asymmetric.decrypt(keyEncrypt);
        this.setKye(_kye);

        // console.log(2,this.symmetric.receiverPublicKey,this.asymmetric.privateKey,this.asymmetric.publicKey,)

        const dataDecrupt = this.symmetric.decrypt(dataEncrypt, false);
        // console.log({dataDecrupt,key: this.asymmetric.receiverPublicKey, passphrase: PASSPHRASE,signature})

        const verify = crypto.createVerify("SHA256");
        verify.write(dataDecrupt);
        verify.end();
        const resSignature = verify.verify(
            { key: this.asymmetric.receiverPublicKey, passphrase: PASSPHRASE },
            signature,
            "hex"
        );
        if (!resSignature) {
            return null;
        }
        return returnJson ? JSON.parse(dataDecrupt) : dataDecrupt;
    }
}

export default HybridCryptography;
