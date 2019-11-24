const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  number: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: mongoose.Types.ObjectId()
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  publicKey:{
      type:String

  },
  privateKey:{
    type:String
  
}
  
});

module.exports = mongoose.model("user", userSchema);
