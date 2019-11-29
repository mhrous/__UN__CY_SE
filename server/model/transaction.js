const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    amount: {
      type: Number
    },
    reason: {
      type: String
    },
    ClientTransactionId: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("transaction", transactionSchema);
