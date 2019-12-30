"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _config = require("./config");

var _socket = _interopRequireDefault(require("./socket"));

var _utils = require("./utils");

var _initDB = _interopRequireDefault(require("./initDB"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const start = async () => {
  console.log("-".repeat(75));
  console.log("\n");
  await (0, _utils.connect)();
  console.log(_chalk.default.greenBright.bold("success"), "connect with DB:", _chalk.default.blueBright.bold(`${_config.dbUrl}`));
  await (0, _initDB.default)();
  console.log("\n");
  console.log("-".repeat(75));

  _socket.default.start();
};

exports.start = start;