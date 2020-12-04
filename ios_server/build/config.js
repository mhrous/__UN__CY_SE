"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_ACTIVE = exports.TYPE_LIST = exports.PORT = exports.PASSPHRASE = exports.SOCKET_EVENT = exports.DATA_PATH = void 0;

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
  THIS_MY_PUBLIC_KEY: "this_my_public_Key"
};
exports.SOCKET_EVENT = SOCKET_EVENT;
const PASSPHRASE = "123456789";
exports.PASSPHRASE = PASSPHRASE;
const PORT = 3000;
exports.PORT = PORT;
const TYPE_LIST = {
  SYMMETRIC: "symmetric",
  ASYMMETRIC: "asymmetric",
  HYBRID: "hybrid"
};
exports.TYPE_LIST = TYPE_LIST;
const TYPE_ACTIVE = TYPE_LIST.SYMMETRIC;
exports.TYPE_ACTIVE = TYPE_ACTIVE;