const publicKeyCA = require("../../publicKeyCA");
const PASSPHRASE = "1234567";
console.log(
  publicKeyCA,
  9999999999999999999999999999999999999999999999999999999999999999
);

const crypto = require("crypto");
module.exports = certifcateObj => {
  const {
    validTo,
    validFrom,
    signatureAlgorithim,
    signature,
    signatureHashAlgorithim,
    publicId,
    subject
  } = certifcateObj;

  if (
    !validFrom ||
    !validTo ||
    !signatureAlgorithim ||
    !signatureHashAlgorithim ||
    !signature ||
    !publicId ||
    !subject
  ) {
    return { error: "The format of the certificate is invalid" };
  }
  if (validTo < new Date().getTime()) {
    return { error: "The certificate has expired" };
  }
  const data = {
    validTo,
    validFrom,
    signatureAlgorithim,
    signature,
    signatureHashAlgorithim,
    publicId
  };
console.log(data)
  const verify = crypto.createVerify("SHA256");
  verify.write(JSON.stringify(data));
  verify.end();
  console.log(publicKeyCA);
  const resSignature = verify.verify(
    { key: publicKeyCA, passphrase: PASSPHRASE },
    signature,
    "hex"
  );
  if (!resSignature) {
    return { error: "Error in Signature" };
  }

  return {};
};
