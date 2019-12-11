import express from "express";
import http from "http";
import socket from "socket.io";
import chalk from "chalk";

import { User, Transaction } from "./model";
import { PORT, REQUEST, KEY } from "./config";
import {
  NO_ERROR,
  ERROR,
  THIS_IS_MY_PUBLIC_KEY,
  SEND_TRANSACTION,
  SymmetricCryptography,
  AsymmetricCryptography,
  HybridCryptography,
  generateKeys
} from "./utils";

const printLine = () => console.log("-".repeat(75));

const app = express();
const server = http.Server(app);
const io = socket(server);
class Socket {
  constructor() {
    const { publicKey, privateKey } = generateKeys();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.init();
  }
  async validate({ from, password, amount, to, clientTransactionId }) {
    try {
      //
      const user = await User.findOne({ userName: from }).exec();
      if (user == null) return { validate: "this acount dont exist" };
      //
      const truePassword = user.checkPassword(password);
      if (!truePassword) return { validate: "password is error" };
      //
      const isSame = to == from;
      if (isSame) return { validate: "cont transform to your self" };

      //
      const resiver = await User.findOne({ userName: to })
        .lean()
        .exec();
      if (resiver == null) return { validate: "this no resever accont" };

      //
      const haveMony = user.accountBalance >= amount;
      if (!haveMony) return { validate: "dont have envf mony" };

      const negativAmount = 0 >= amount;
      if (negativAmount)
        return { validate: "Negative trainsaction cannot be transferred" };

      const TransactionId = await Transaction.findOne({
        from: user._id,
        clientTransactionId
      })
        .lean()
        .exec();

      if (TransactionId)
        return {
          validate:
            "A transfer has been added with this id. You cannot add it again"
        };

      return {
        validate: NO_ERROR,
        _from: user._id,
        _to: resiver._id,
        rest: `Done ...\nYour account remains ${user.accountBalance - amount}`
      };
    } catch (e) {
      console.error(e);
      return { validate: "error" };
    }
  }

  init() {
    io.use(async (socket, next) => {
      // console.log(socket.handshake.query);
      // for authentication
      next();
    }).on("connection", socket => {
      console.log("\n");

      console.log(
        chalk.bgCyan.bold(" New Connection "),
        "Socket id:",
        chalk.blue.bold(socket.id)
      );
      console.log("\n");

      printLine();
      const symmetric = new SymmetricCryptography();
      const asymmetric = new AsymmetricCryptography();
      asymmetric.setPrivateKey(this.privateKey);
      asymmetric.setPublicKey(this.publicKey);
      const hybrid = new HybridCryptography();
      hybrid.setPrivateKey(this.privateKey);
      hybrid.setPublicKey(this.publicKey);

      const { key, iv } = JSON.parse(KEY);
      symmetric.setKye(key);
      symmetric.setIv(iv);

      socket.emit(THIS_IS_MY_PUBLIC_KEY, this.publicKey);

      socket.on(THIS_IS_MY_PUBLIC_KEY, data => {
        console.log("\n");

        console.log(
          chalk.bgCyan.bold(" Get Public key for "),
          "Socket id:",
          chalk.blue.bold(socket.id)
        );
        console.log("\n");

        console.log(chalk.bgGray.blue(data.toString()));
        console.log("\n");

        printLine();

        asymmetric.setReceiverPublicKey(data);
        hybrid.setReceiverPublicKey(data);
      });

      socket.on(SEND_TRANSACTION, async data => {
        console.log("\n");
        console.log(
          chalk.bgCyan.bold(" Send Transaction for "),
          "Socket id:",
          chalk.blue.bold(socket.id)
        );
        if (REQUEST == 1) {
          console.log(
            chalk.blue.bold("info"),
            "Cryptography Type :",
            chalk.blue.bold("Symmetric")
          );
          console.log(
            chalk.blue.bold("info"),
            "kye:",
            chalk.blue.bold(Buffer.from(key.data).toString("hex"))
          );
          console.log(
            chalk.blue.bold("info"),
            "iv:",
            chalk.blue.bold(Buffer.from(iv.data).toString("hex"))
          );
          console.log("\n");

          console.log(chalk.blue.bold("info"), "Encrypt Data");
          console.log(data);
          console.log("\n");

          symmetric.setKye(key);
          symmetric.setIv(iv);
          data = symmetric.decrypt(data);
        } else if (REQUEST == 2) {
          console.log(
            chalk.blue.bold("info"),
            "Cryptography Type :",
            chalk.blue.bold("Hybrid")
          );
          console.log("1 _ get Symmetric Key and iv from keyEncrypt")
          console.log("2 _ decrypt dataEncrypt by  Key and iv")

          console.log("\n");
          console.log(chalk.blue.bold("info"), "Encrypt Data");
          console.log(data);
          console.log("\n");

       
          data = hybrid.decrypt(data);
          symmetric.setKye(hybrid.symmetric.key);
          symmetric.setIv(hybrid.symmetric.iv);
          console.log(
            chalk.blue.bold("info"),
            "kye:",
            chalk.blue.bold(Buffer.from(hybrid.symmetric.key).toString("hex"))
          );
          console.log(
            chalk.blue.bold("info"),
            "iv:",
            chalk.blue.bold(Buffer.from(hybrid.symmetric.iv).toString("hex"))
          );
        }
        console.log(chalk.blue.bold("info"), "Decrypt Data");
        console.table(data);
        console.log("\n");
        let { validate, _from, _to, rest } = await this.validate(data);

        console.log(chalk.blue.bold("info"), "response");

        if (validate == NO_ERROR) {
          try {
            console.log(chalk.green.bold("scusses"), rest);

            await Transaction.create({ ...data, to: _to, from: _from });
            rest = symmetric.encrypt(rest);
            socket.emit(NO_ERROR, rest);
          } catch (e) {
            console.error(e);
          }
        } else {
          console.log(chalk.red.bold("error"), validate);
          validate = symmetric.encrypt(validate);
          socket.emit(ERROR, validate);
        }

        printLine()
      });

      socket.on("disconnect", reason => {
        console.log("\n");

        console.log(
          chalk.bgCyan.bold("disconnect "),
          " Socket close:",
          chalk.red.bold(socket.id)
        );
        console.log("\n");
        printLine();
      });
    });
  }

  start() {
    server.close();
    server.listen(PORT, () => {
      console.log("\n");

      console.log(
        chalk.green.bold("success"),
        `socket run on port:`,
        chalk.blue.bold(PORT)
      );
      console.log("\n");

      printLine();
    });
  }
}
export default new Socket();
