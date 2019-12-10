"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = require("./model");

const array = [{
  userName: "jod_123",
  name: "jod",
  password: "12345678",
  accountBalance: 1000
}, {
  userName: "mhamad_123",
  name: "mhamad",
  password: "12345678",
  accountBalance: 1000
}];

var _default = () => {
  _model.User.collection.drop();

  array.forEach(user => {
    _model.User.create(user);
  });
};

exports.default = _default;