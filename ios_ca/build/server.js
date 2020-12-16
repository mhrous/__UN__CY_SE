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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const start = async () => {
  await (0, _db.connect)();
  console.log((0, _utils.blue)("connect to DB"));
  console.log(_utils.line);
  const app = (0, _express.default)();
  app.use(_bodyParser.default.json());
  app.use((0, _cors.default)());
  app.post("/certificate", async (req, res) => {
    const {
      body: {
        userName,
        password,
        publicKey
      }
    } = req; // Users.create({
    //     userName,
    //     password,
    //     name:userName,
    //     role:"user"
    // })

    const user = await _model.Users.findOne({
      userName
    }).exec();

    if (!user) {
      return res.status(400).json({
        error: "error in userName or password"
      });
    }

    const correctPassword = await user.checkPassword(password);

    if (!correctPassword) {
      return res.status(400).json({
        error: "error in userName or password"
      });
    }

    return {};
  }); //

  app.listen(_config.PORT, () => {
    console.log("server CA run in port : ", (0, _utils.blue)(_config.PORT));
    console.log(_utils.line);
  });
};

exports.start = start;