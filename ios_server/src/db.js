import mongoose from "mongoose";
import { DB_URL } from "./config";

export const connect = (url = DB_URL, opts = {}) => {
  return mongoose.connect(url, {
    ...opts,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
};
