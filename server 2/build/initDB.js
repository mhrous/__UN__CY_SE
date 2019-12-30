"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = require("./model");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const array = [{
  userName: "jod_123",
  name: "jod",
  password: "11111111",
  accountBalance: 1000
}, {
  userName: "ali_123",
  name: "mhamad",
  password: "22222222",
  accountBalance: 1000
}];

var _default = async () => {
  try {
    await _model.User.collection.deleteMany({});
    console.log(_chalk.default.red.bold("Delete"), "All Users");
    await _model.Transaction.collection.deleteMany({});
    console.log(_chalk.default.red.bold("Delete"), "All Transaction");
    await _model.User.create(array);
    console.log(_chalk.default.green.bold("success"), "Init Users With Defalut Value Located inside the file:", _chalk.default.blue.bold("InitDB.js"));
  } catch (e) {
    console.error(e);
  }
};

exports.default = _default;