"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServeCertifcate = exports.singUp = exports.singIn = void 0;

var _certifcate = _interopRequireDefault(require("./certifcate"));

var _HybridCryptography = _interopRequireDefault(require("./HybridCryptography"));

var _publicKey = _interopRequireDefault(require("../publicKey"));

var _privateKey = _interopRequireDefault(require("../privateKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const singIn = (req, res, next) => {
  try {
    const dataEn = req.body;
    const hybrid = new _HybridCryptography.default();
    hybrid.setPublicKey(_publicKey.default);
    hybrid.setPrivateKey(_privateKey.default);
    const data = hybrid.decrypt(dataEn);
    console.log(data);
    res.json({
      hi: 76543
    });
  } catch (e) {
    console.log(e);
  }
};

exports.singIn = singIn;

const singUp = () => {};

exports.singUp = singUp;

const createServeCertifcate = () => {};

exports.createServeCertifcate = createServeCertifcate;