const { generateKeyPairSync } = require("crypto");

const SymmetricCryptography = require("./assets/js/SymmetricCryptography");
const AsymmetricCryptography = require("./assets/js/AsymmetricCryptography");
const HybridCryptography = require("./assets/js/HybridCryptography");
const verifyCertifacte = require("./assets/js/verifyCertifacte");
const publicKeyCA = require("./publicKeyCA");
const { REQUEST, KEY, PASSPHRASE, CA_PORT, CA_IP } = require("./config");

const generateKeys = () => {
  return generateKeyPairSync("rsa", {
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
};

const data = generateKeys();
publicKey = data.publicKey;
privateKey = data.privateKey;

window.publicKey = publicKey;
window.privateKey = privateKey;

const asymmetric = new AsymmetricCryptography();
const symmetric = new SymmetricCryptography();
const hybrid = new HybridCryptography();
asymmetric.setPublicKey(publicKey);
asymmetric.setPrivateKey(privateKey);
hybrid.setPublicKey(publicKey);
hybrid.setPrivateKey(privateKey);

const key = Buffer.from(KEY, "hex");
symmetric.setKye(key);

window.SymmetricCryptography = symmetric;
window.AsymmetricCryptography = asymmetric;
window.HybridCryptography = hybrid;
window.verifyCertifacte = verifyCertifacte;

window.REQUEST = REQUEST;
window.key = Buffer.from(KEY, "hex");
window.PASSPHRASE = PASSPHRASE;
window.publicKeyCA = publicKeyCA;
window.CA_PORT = CA_PORT;
window.CA_IP = CA_IP;
