"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_ACTIVE = exports.DB_URL = exports.TYPE_LIST = exports.PORT = exports.PASSPHRASE = void 0;

var _path = require("path");

const PASSPHRASE = "123456789";
exports.PASSPHRASE = PASSPHRASE;
const PORT = 4000;
exports.PORT = PORT;
const TYPE_LIST = {
  SYMMETRIC: "symmetric",
  ASYMMETRIC: "asymmetric",
  HYBRID: "hybrid"
};
exports.TYPE_LIST = TYPE_LIST;
const DB_URL = "mongodb://localhost:27017/ios_ca";
exports.DB_URL = DB_URL;
const TYPE_ACTIVE = TYPE_LIST.SYMMETRIC;
exports.TYPE_ACTIVE = TYPE_ACTIVE;