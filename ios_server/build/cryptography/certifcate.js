"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _config = require("../config");

var _CA_KEY = require("../../CA_KEY");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    if (!validFrom || !validTo || !signatureAlgorithim || !signatureHashAlgorithim || !signature || !publicId || !subject) {
      return {
        error: "The format of the certificate is invalid"
      };
    }

    if (validTo < new Date().getTime()) {
      return {
        error: "The certificate has expired"
      };
    }

    const data = {
      validTo,
      validFrom,
      signatureAlgorithim,
      signatureHashAlgorithim,
      publicId,
      subject
    };

    const verify = _crypto.default.createVerify("SHA256");

    verify.write(JSON.stringify(data));
    verify.end();
    const resSignature = verify.verify({
      key: _CA_KEY.publicKey,
      passphrase: _config.PASSPHRASE
    }, signature, "hex");

    if (!resSignature) {
      return {
        error: "Error in Signature"
      };
    }

    return {};
  }

}

var _default = Certifcate;
exports.default = _default;