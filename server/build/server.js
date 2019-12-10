"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var _socket = _interopRequireDefault(require("./socket"));

var _utils = require("./utils");

var _initFakeDB = _interopRequireDefault(require("./initFakeDB"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const start = async () => {
  await (0, _utils.connect)(); // initDb();

  _socket.default.start();
};

exports.start = start;