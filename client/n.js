const HybridCryptography = require("./assets/js/HybridCryptography");
const { generateKeyPairSync } = require("crypto");
const PASSPHRASE = "1234567";

const generateKeys = async () =>
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
// console.log(generateKeys());
generateKeys().then(data => {
  const { publicKey: publicKey1, privateKey: privateKey1 } = data;
  generateKeys().then(data => {
    const { publicKey: publicKey2, privateKey: privateKey2 } = data;
    const hybrid1 = new HybridCryptography();
    hybrid1.setReceiverPublicKey(publicKey2);
    hybrid1.setPublicKey(publicKey1);
    hybrid1.setPrivateKey(privateKey1);


    const hybrid2 = new HybridCryptography();
    hybrid2.setReceiverPublicKey(publicKey1);
    hybrid2.setPublicKey(publicKey2);
    hybrid2.setPrivateKey(privateKey2);

    const data1 = "hi how are you";
    const dataEn = hybrid1.encrypt(data1);
    const dataDe = hybrid2.decrypt(dataEn, false);
    console.log(dataDe);
  });
});
