"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("./user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transactionSchema = new _mongoose.default.Schema({
  from: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  to: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  amount: {
    type: Number,
    min: 0
  },
  reason: String,
  clientTransactionId: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
});
transactionSchema.post("save", async function () {
  const from = this.from;
  const to = this.to;
  const amount = this.amount;

  try {
    await _user.default.findByIdAndUpdate(from, {
      $inc: {
        accountBalance: -1 * amount
      }
    }).lean().exec();
    await _user.default.findByIdAndUpdate(to, {
      $inc: {
        accountBalance: amount
      }
    }).lean().exec();
  } catch (e) {
    console.error(e);
  }
});

var _default = _mongoose.default.model("transaction", transactionSchema);

exports.default = _default;