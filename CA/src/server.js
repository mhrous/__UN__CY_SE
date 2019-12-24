import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";

import {port} from "./config";
import { connect, singIn } from "./utils";
import publicKey from "./publicKey";
import privateKey from "./privateKey";

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
app.post("/its/singin", singIn);

export const start = async () => {
  try {
    await connect();

    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}/its`);
    });
  } catch (e) {}
};
