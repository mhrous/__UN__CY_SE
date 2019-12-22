import { duration } from "../config";
class Certifcate {
  constructor() {
    this.validTo = new Date().getTime() + duration * 24 * 60 * 60 * 1000;
    this.validFrom = new Date().getTime();
    this.signatureAlgorithim = "sha256RSA";
    this.signatureHashAlgorithim = "sha256";
    this.publicId = null;
    this.subject = null;
    this.signature= null
  }
  bulid() {}
}

export default Certifcate;
