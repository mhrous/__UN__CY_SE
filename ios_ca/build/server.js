"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _db = require("./db");

var _utils = require("./utils");

var _config = require("./config");

var _model = require("./model");

var _cryptography = require("./cryptography");

var _CA_KEY = require("./CA_KEY");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const start = async () => {
  await (0, _db.connect)();
  console.log((0, _utils.blue)("connect to DB"));
  console.log(_utils.line); // 

  const app = (0, _express.default)();
  app.use(_bodyParser.default.json());
  app.use((0, _cors.default)());
  const hybridCryptography = new _cryptography.HybridCryptography(_CA_KEY.publicKey, _CA_KEY.privateKey);
  const certifcate = new _cryptography.Certifcate();
  app.post("/certificate", async (req, res) => {
    try {
      const {
        body
      } = req;
      hybridCryptography.setReceiverPublicKey(body.publicKey);
      const decryptData = (0, _cryptography.decrypt)({
        data: body.encryptData,
        hybridCryptography
      });
      const {
        password,
        userName
      } = decryptData;

      if (decryptData == null) {
        return res.status(500).json({
          error: "someone play with data"
        });
      }

      const user = await _model.Users.findOne({
        userName
      }).exec();

      if (!user) {
        const encryptData = (0, _cryptography.encrypt)({
          hybridCryptography,
          data: {
            error: "error in userName or password"
          }
        });
        return res.status(400).json(encryptData);
      }

      const correctPassword = await user.checkPassword(password);

      if (!correctPassword) {
        const encryptData = (0, _cryptography.encrypt)({
          hybridCryptography,
          data: {
            error: "error in userName or password"
          }
        });
        return res.status(400).json(encryptData);
      }

      const {
        role,
        name,
        can
      } = user;
      const data = certifcate.bulid(body.publicKey, {
        userName,
        name,
        role,
        can
      });
      const encryptData = (0, _cryptography.encrypt)({
        hybridCryptography,
        data
      });
      return res.status(200).json(encryptData);
    } catch (e) {
      console.log(e);
      const encryptData = (0, _cryptography.encrypt)({
        hybridCryptography,
        data: {
          error: " "
        }
      });
      return res.status(400).json(encryptData);
    }
  }); //

  app.listen(_config.PORT, () => {
    console.log("server CA run in port : ", (0, _utils.blue)(_config.PORT));
    console.log(_utils.line);
  });
};

exports.start = start;