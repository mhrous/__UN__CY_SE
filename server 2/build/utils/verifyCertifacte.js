"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _publicKeyCA = _interopRequireDefault(require("../publicKeyCA"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = certifcateObj => {
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
    key: _publicKeyCA.default,
    passphrase: _config.PASSPHRASE
  }, signature, "hex");

  if (!resSignature) {
    return {
      error: "Error in Signature"
    };
  }

  return {
    susses: "no Error"
  };
};

exports.default = _default;