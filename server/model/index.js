const mongoose = require("mongoose");

const User = require("./user");
const Transaction = require("./transaction");
const { dbUrl } = require("../config");


const connect = (url = dbUrl, opts = {}) => {
  return mongoose.connect(url, {
    ...opts,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
};

module.exports = {
  User,
  Transaction,
  connect
};
