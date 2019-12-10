const mongoose = require("mongoose");
const hash = require("object-hash");

const userSchema = new mongoose.Schema(
  {
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
      minlength: 8
    },

    accountBalance: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = hash(this.password);
  next();
});
userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password;
  password = hash(password);
  return password == passwordHash;
};
module.exports = mongoose.model("user", userSchema);
