
const crypto = require("crypto")
const SymmetricCryptography = require("./js/cryptography/SymmetricCryptography")
const AsymmetricCryptography = require("./js/cryptography/AsymmetricCryptography")
const HybridCryptography = require("./js/cryptography/HybridCryptography")
const Certifcate = require('./js/cryptography/certifcate')
const { publicKey: CA_BUBLIC_KEY } = require("./CA_KEY")


const getHash = (pwd) => crypto.createHash('md5').update(pwd).digest('hex');


const PASSPHRASE = "1234567"

const getKeys = () => {
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
    return { publicKey, privateKey }
}

window.symmetricCryptography = new SymmetricCryptography()
window.asymmetricCryptography = new AsymmetricCryptography()
window.hybridCryptography = new HybridCryptography()
window.certifcate = new Certifcate()
window.CA_BUBLIC_KEY = CA_BUBLIC_KEY
window.getHash = getHash
window.getKeys = getKeys