"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Operations = new _mongoose.default.Schema({
  user: {
    type: Object
  },
  type: {
    type: String
  },
  data: {
    type: Object
  },
  signature: {
    type: String
  }
}, {
  timestamps: true
});

var _default = _mongoose.default.model("operations", Operations);

exports.default = _default;