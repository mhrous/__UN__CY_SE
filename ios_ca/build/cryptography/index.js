"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SymmetricCryptography", {
  enumerable: true,
  get: function () {
    return _SymmetricCryptography.default;
  }
});
Object.defineProperty(exports, "AsymmetricCryptography", {
  enumerable: true,
  get: function () {
    return _AsymmetricCryptography.default;
  }
});
Object.defineProperty(exports, "HybridCryptography", {
  enumerable: true,
  get: function () {
    return _HybridCryptography.default;
  }
});
Object.defineProperty(exports, "Certifcate", {
  enumerable: true,
  get: function () {
    return _certifcate.default;
  }
});
exports.generateKeyPairSync = exports.decrypt = exports.encrypt = exports.getHash = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _config = require("../config");

var _SymmetricCryptography = _interopRequireDefault(require("./SymmetricCryptography"));

var _AsymmetricCryptography = _interopRequireDefault(require("./AsymmetricCryptography"));

var _HybridCryptography = _interopRequireDefault(require("./HybridCryptography"));

var _certifcate = _interopRequireDefault(require("./certifcate"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getHash = pwd => _crypto.default.createHash('md5').update(pwd).digest('hex');

exports.getHash = getHash;

const generateKeyPairSync = () => _crypto.default.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem"
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: _config.PASSPHRASE
  }
});

exports.generateKeyPairSync = generateKeyPairSync;

const encrypt = ({
  data,
  hybridCryptography
}) => {
  console.log({
    data,
    hybridCryptography
  });

  switch (_config.TYPE_ACTIVE) {
    case _config.TYPE_LIST.SYMMETRIC:
      console.log((0, _utils.red)("error : "), "work only with hybrid cryptography");
      throw new Error();

    case _config.TYPE_LIST.ASYMMETRIC:
      console.log((0, _utils.red)("error : "), "work only with hybrid cryptography");
      throw new Error();

    case _config.TYPE_LIST.HYBRID:
      return hybridCryptography.encrypt(data);

    default:
      return data;
  }
};

exports.encrypt = encrypt;

const decrypt = ({
  data,
  hybridCryptography
}) => {
  switch (_config.TYPE_ACTIVE) {
    case _config.TYPE_LIST.SYMMETRIC:
      console.log((0, _utils.red)("error : "), "work only with hybrid cryptography");
      throw new Error();

    case _config.TYPE_LIST.ASYMMETRIC:
      console.log((0, _utils.red)("error : "), "work only with hybrid cryptography");
      throw new Error();

    case _config.TYPE_LIST.HYBRID:
      return hybridCryptography.decrypt(data);

    default:
      return data;
  }
};

exports.decrypt = decrypt;