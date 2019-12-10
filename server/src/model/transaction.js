import mongoose from "mongoose";
import User from "./user";

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
      type: Number,
      min: 0
    },
    reason: String,
    clientTransactionId: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: true
  }
);
transactionSchema.pre("save", async function(next) {
  const from = this.from;
  const to = this.to;
  const amount = this.amount;
  await User.findOneAndUpdate(
    { userName: from },
    { $inc: { amount: -1 * amount } }
  ).lean().exec();

  await User.findOneAndUpdate({ userName: to }, { $inc: { amount: amount } }).lean().exec();

  next();
});

export default mongoose.model("transaction", transactionSchema);
