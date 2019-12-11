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
transactionSchema.post("save", async function() {
  const from = this.from;
  const to = this.to;
  const amount = this.amount;
  try {
    await User.findByIdAndUpdate(from, {
      $inc: { accountBalance: -1 * amount }
    })
      .lean()
      .exec();

    await User.findByIdAndUpdate(to, { $inc: { accountBalance: amount } })
      .lean()
      .exec();
  } catch (e) {
    console.error(e);
  }
});

export default mongoose.model("transaction", transactionSchema);
