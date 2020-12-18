"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_ACTIVE = exports.DB_URL = exports.TYPE_LIST = exports.PORT = exports.duration = exports.PASSPHRASE = void 0;
const PASSPHRASE = "1234567";
exports.PASSPHRASE = PASSPHRASE;
const duration = 1;
exports.duration = duration;
const PORT = 4000;
exports.PORT = PORT;
const TYPE_LIST = {
  HYBRID: "hybrid"
};
exports.TYPE_LIST = TYPE_LIST;
const DB_URL = "mongodb://localhost:27017/ios_ca";
exports.DB_URL = DB_URL;
const TYPE_ACTIVE = TYPE_LIST.HYBRID;
exports.TYPE_ACTIVE = TYPE_ACTIVE;