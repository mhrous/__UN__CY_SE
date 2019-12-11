import chalk from "chalk";
import { dbUrl } from "./config";
import socket from "./socket";
import { connect } from "./utils";
import initDB from "./initDB";

export const start = async () => {
  console.log("-".repeat(75));
  console.log("\n");

  await connect();
  console.log(
    chalk.greenBright.bold("success"),
    "connect with DB:",
    chalk.blueBright.bold(`${dbUrl}`)
  );

  await initDB();
  console.log("\n");

  console.log("-".repeat(75));

  socket.start();
};
