const crypto = require("crypto");

// const { generateKeyPairSync } = require("crypto");

// function encrypt(toEncrypt, publicKey) {
//   const buffer = Buffer.from(toEncrypt, "utf8");
//   const encrypted = crypto.publicEncrypt(publicKey, buffer);
//   return encrypted.toString("base64");
// }

// function decrypt(toDecrypt, privateKey) {
//   const buffer = Buffer.from(toDecrypt, "base64");
//   const decrypted = crypto.privateDecrypt(
//     {
//       key: privateKey.toString(),
//       passphrase: ""
//     },
//     buffer
//   );
//   return decrypted.toString("utf8");
// }

// function generateKeys() {
//   const { privateKey, publicKey } = generateKeyPairSync("rsa", {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//       type: "pkcs1",
//       format: "pem"
//     },
//     privateKeyEncoding: {
//       type: "pkcs1",
//       format: "pem",
//       cipher: "aes-256-cbc",
//       passphrase: ""
//     }
//   });
//   const e = encrypt("hi i amm tall", publicKey);
//   const d = decrypt(e, privateKey);
//   console.log(publicKey, "\n\n\n\n", privateKey);
//   return e;
// }

const algorithm = "aes-256-cbc";

function encrypt(text, key, iv) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(text, key, iv) {
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
const array = [];
for (let i = 0; i < 1000; i++) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  array.push({ key, iv });
}
const str = JSON.stringify(array);

for (let i = 0; i < 1000; i++) {
  let { iv, key } = JSON.parse(str)[i];
  iv = Buffer.from(iv.data);
  key = Buffer.from(key.data);
  e=encrypt(JSON.stringify({ hi: "how are you" }),key,iv);
  console.log(JSON.parse(decrypt(e,key,iv)))
}

// generateKeys();
