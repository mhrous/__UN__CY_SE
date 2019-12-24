const publicKeyCA = require("../../publicKeyCA");

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

  const verify = crypto.createVerify("SHA256");
  verify.write(JSON.stringify(data));
  verify.end();
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
