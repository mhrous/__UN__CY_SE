
const crypto =require("crypto")
const SymmetricCryptography = require("./js/cryptography/SymmetricCryptography")
const AsymmetricCryptography = require("./js/cryptography/AsymmetricCryptography")
const HybridCryptography = require("./js/cryptography/HybridCryptography")


const getHash = (pwd) => crypto.createHash('md5').update(pwd).digest('hex');


const PASSPHRASE = "123456789"
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: PASSPHRASE
    }
});

window.symmetricCryptography = new SymmetricCryptography()
window.asymmetricCryptography =new AsymmetricCryptography(publicKey,privateKey)
window.hybridCryptography = new HybridCryptography(publicKey,privateKey)
window.PUBLIC_KYE = publicKey
window.getHash = getHash