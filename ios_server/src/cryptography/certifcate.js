import crypto from "crypto";
import {  PASSPHRASE } from "../config";
import { publicKey } from "../../CA_KEY";

class Certifcate {
  constructor() {
    this.validTo = null;
    this.validFrom = null;
    this.signatureAlgorithim = "sha256RSA";
    this.signatureHashAlgorithim = "sha256";
    this.publicId = null;
    this.subject = null;
    this.signature = null;
  }


  verify(certifcateObj) {
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
      signatureHashAlgorithim,
      publicId,
      subject
    };

    const verify = crypto.createVerify("SHA256");
    verify.write(JSON.stringify(data));
    verify.end();
    const resSignature = verify.verify(
      { key: publicKey, passphrase: PASSPHRASE },
      signature,
      "hex"
    );
    if (!resSignature) {
      return { error: "Error in Signature" };
    }

    return {};
  }
}

export default Certifcate;
