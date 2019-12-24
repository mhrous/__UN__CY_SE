"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config");

class Certifcate {
  constructor() {
    this.validTo = new Date().getTime() + _config.duration * 24 * 60 * 60 * 1000;
    this.validFrom = new Date().getTime();
    this.signatureAlgorithim = "sha256RSA";
    this.signatureHashAlgorithim = "sha256";
    this.publicId = null;
    this.subject = null;
    this.signature = null;
  }

  bulid() {}

}

var _default = Certifcate;
exports.default = _default;