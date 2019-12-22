import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { readFileSync } from "fs";
import path from "path";

import config from "./config";
import { connect } from "./utils";

const publicKey = readFileSync(path.join(__dirname, "./publicKey.txt"));
const privateKey = readFileSync(path.join(__dirname, "./privateKey.txt"));

export const app = express();

app.disable("etag");

app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(morgan("dev"));

export const start = async () => {
  try {
    await connect();

    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/its`);
    });
  } catch (e) {}
};
