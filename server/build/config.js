"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PASSPHRASE = exports.REQUEST = exports.KEY = exports.dbUrl = exports.PORT = void 0;
const PORT = 4000;
exports.PORT = PORT;
const dbUrl = "mongodb://localhost:27017/its";
exports.dbUrl = dbUrl;
const KEY = '{"key":{"type":"Buffer","data":[131,104,130,92,57,223,71,59,43,3,145,46,133,108,122,189,11,53,206,37,12,243,143,25,21,37,23,197,42,161,107,215]},"iv":{"type":"Buffer","data":[254,14,69,209,230,157,178,180,82,146,43,110,2,86,161,164]}}';
exports.KEY = KEY;
const REQUEST = 1;
exports.REQUEST = REQUEST;
const PASSPHRASE = "1234567";
exports.PASSPHRASE = PASSPHRASE;