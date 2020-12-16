"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _objectHash = _interopRequireDefault(require("object-hash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.default.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
    minlength: 4
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 4
  },
  role: {
    type: String
  }
}, {
  timestamps: true
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = (0, _objectHash.default)(this.password);
  next();
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  password = (0, _objectHash.default)(password);
  return password == passwordHash;
};

var _default = _mongoose.default.model("user", userSchema);

exports.default = _default;