import mongoose from "mongoose";
import hash from "object-hash";


const userSchema = new mongoose.Schema(
  {
    userName:{
      type:String,
      required:true,
      unique:true,
      trim:true,
      maxlength:50,
      minlength:4
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
    role:{
      type:String,

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
export default mongoose.model("user", userSchema);
