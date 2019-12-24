const { generateKeyPairSync } = require("crypto");

const { readFileSync } = require("fs");
const path = require("path");
const SymmetricCryptography = require("./assets/js/SymmetricCryptography");
const AsymmetricCryptography = require("./assets/js/AsymmetricCryptography");
const HybridCryptography = require("./assets/js/HybridCryptography");

const KEY =
  '{"key":{"type":"Buffer","data":[131,104,130,92,57,223,71,59,43,3,145,46,133,108,122,189,11,53,206,37,12,243,143,25,21,37,23,197,42,161,107,215]},"iv":{"type":"Buffer","data":[254,14,69,209,230,157,178,180,82,146,43,110,2,86,161,164]}}';
const REQUEST = 2;
const PASSPHRASE = "1234567";

const generateKeys = () =>
  generateKeyPairSync("rsa", {
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

const { publicKey, privateKey } = generateKeys();
const asymmetric = new AsymmetricCryptography();
const symmetric = new SymmetricCryptography();
const hybrid = new HybridCryptography();
asymmetric.setPublicKey(publicKey);
asymmetric.setPrivateKey(privateKey);
hybrid.setPublicKey(publicKey);
hybrid.setPrivateKey(privateKey);

const { key, iv } = JSON.parse(KEY);
symmetric.setKye(key);
symmetric.setIv(iv);
localStorage.setItem("_PUBLIC_KEY_", publicKey);

const publicKeyCA = readFileSync(path.join(__dirname, "./publicKeyCA.txt"), {
  encoding: "utf8"
});
window.SymmetricCryptography = symmetric;
window.AsymmetricCryptography = asymmetric;
window.HybridCryptography = hybrid;
window.REQUEST = REQUEST;
window.PASSPHRASE = PASSPHRASE;
window.KEY = KEY;

window.publicKeyCA = publicKeyCA;
