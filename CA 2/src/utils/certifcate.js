import crypto from "crypto";
import { duration, PASSPHRASE } from "../config";
import { publicKey, privateKey } from "../myKey";

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
  bulid(publicId, subject, is_org = false) {
    this.validTo = new Date().getTime() + duration * 24 * 60 * 60 * 1000;
    this.validFrom = new Date().getTime();
    this.subject = subject;
    this.publicId = publicId;
    const data = {
      validTo: this.validTo,
      validFrom: this.validFrom,
      signatureAlgorithim: this.signatureAlgorithim,
      signatureHashAlgorithim: this.signatureHashAlgorithim,
      publicId: this.publicId,
      subject: this.subject
    };
    const sign = crypto.createSign("SHA256");
    sign.write(JSON.stringify(data));
    sign.end();
    const signature = sign.sign(
      { key: privateKey, passphrase: PASSPHRASE },
      "hex"
    );

    data.signature = signature;

    return data;
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
