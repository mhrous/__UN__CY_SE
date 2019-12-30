import { User, Transaction } from "./model";
import chalk from "chalk";

const array = [
  {
    userName: "jod_123",
    name: "jod",
    password: "11111111",
    accountBalance: 1000
  },
  {
    userName: "ali_123",

    name: "mhamad",
    password: "22222222",
    accountBalance: 1000
  }
];

export default async () => {
  try {
    await User.collection.deleteMany({});
    console.log(chalk.red.bold("Delete"), "All Users");
    await Transaction.collection.deleteMany({});
    console.log(chalk.red.bold("Delete"), "All Transaction");

    await User.create(array);
    console.log(
      chalk.green.bold("success"),
      "Init Users With Defalut Value Located inside the file:",
      chalk.blue.bold("InitDB.js"),
      
    );
  } catch (e) {
    console.error(e);
  }
};
