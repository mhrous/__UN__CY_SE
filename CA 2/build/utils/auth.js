"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singIn = void 0;

var _certifcate = _interopRequireDefault(require("./certifcate"));

var _HybridCryptography = _interopRequireDefault(require("./HybridCryptography"));

var _myKey = require("../myKey");

var _model = require("../model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const singIn = async (req, res) => {
  try {
    const {
      dataEn,
      publicKey: userPublicKey
    } = req.body;
    const hybrid = new _HybridCryptography.default();
    const certifcate = new _certifcate.default();
    hybrid.setPublicKey(_myKey.publicKey);
    hybrid.setPrivateKey(_myKey.privateKey);
    hybrid.setReceiverPublicKey(userPublicKey);
    const data = hybrid.decrypt(dataEn);

    if (!data) {
      return res.status(400).send("someone distroed data pleas try again");
    }

    const {
      userName,
      password
    } = data;
    const user = await _model.User.findOne({
      userName
    }).exec();

    if (!user) {
      return res.status(400).send("We did not get to know you, please visit us soon and introduce yourself");
    }

    const truePassword = user.checkPassword(password);
    if (!truePassword) return res.status(400).send("password worng");
    const result = certifcate.bulid(userPublicKey, {
      type: "user",
      userName
    });
    res.json(result);
  } catch (e) {
    console.log(e);
  }
};

exports.singIn = singIn;