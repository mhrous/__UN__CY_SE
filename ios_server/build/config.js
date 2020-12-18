"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_ACTIVE = exports.CA_GET_CERTIFICATE_URL = exports.DB_URL = exports.TYPE_LIST = exports.PORT = exports.PASSPHRASE = exports.SOCKET_EVENT = exports.DATA_PATH = void 0;

var _path = require("path");

const DATA_PATH = (0, _path.join)(__dirname, "..", "/src/data");
exports.DATA_PATH = DATA_PATH;
const SOCKET_EVENT = {
  CREATE_FILE: "create_file",
  DELETE_FILE: "delete_file",
  UPDATE_FILE: "update_file",
  READ_FILE: "read_file",
  CRYPTOGRAPHY_ERROR: "cryptography_error",
  ERROR: "ERROR",
  SUCCESS: "success",
  THIS_MY_PUBLIC_KEY: "this_my_public_Key",
  THIS_MY_CERTIFCATE: "this_my_certifcate"
};
exports.SOCKET_EVENT = SOCKET_EVENT;
const PASSPHRASE = "1234567";
exports.PASSPHRASE = PASSPHRASE;
const PORT = 3000;
exports.PORT = PORT;
const TYPE_LIST = {
  SYMMETRIC: "symmetric",
  ASYMMETRIC: "asymmetric",
  HYBRID: "hybrid"
};
exports.TYPE_LIST = TYPE_LIST;
const DB_URL = "mongodb://localhost:27017/ios_server";
exports.DB_URL = DB_URL;
const CA_GET_CERTIFICATE_URL = "http://localhost:4000/certificate";
exports.CA_GET_CERTIFICATE_URL = CA_GET_CERTIFICATE_URL;
const TYPE_ACTIVE = TYPE_LIST.HYBRID;
exports.TYPE_ACTIVE = TYPE_ACTIVE;