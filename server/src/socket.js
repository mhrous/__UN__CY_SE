import express from "express";
import http from "http";
import socket from "socket.io";

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
      if (user == null) return "this acount dont exist";
      //
      const truePassword = user.checkPassword(password);
      if (!truePassword) return "password is error";
      //
      const isSame = to == from;
      if (isSame) return "cont transform to your self";

      //
      const resiver = await User.findOne({ userName: to })
        .lean()
        .exec();
      if (resiver == null) return "this no resever accont";

      //
      const haveMony = user.accountBalance >= amount;
      if (!haveMony) return "dont have envf mony";

      const negativAmount = 0 >= amount;
      if (negativAmount) return "Negative trainsaction cannot be transferred";

      const TransactionId = await Transaction.findOne({
        from,
        clientTransactionId
      })
        .lean()
        .exec();

      if (!TransactionId)
        return "A transfer has been added with this id. You cannot add it again";

      return NO_ERROR;
    } catch (e) {
      return "error";
    }
  }

  init() {
    io.use(async (socket, next) => {
      console.log(socket.handshake.query);
      // for authentication
      next();
    }).on("connection", socket => {
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
        asymmetric.setReceiverPublicKey(data);
        hybrid.setReceiverPublicKey(data);
      });
      socket.on(SEND_TRANSACTION, async data => {
        if (REQUEST == 1) {
          symmetric.setKye(key);
          symmetric.setIv(iv);
          data = symmetric.decrypt(data);
        } else if (REQUEST == 2) {
          symmetric.setKye(hybrid.symmetric.key);
          symmetric.setIv(hybrid.symmetric.iv);
          data = hybrid.decrypt(data);
        }
        let validate = await this.validate(data);

        if (validate == NO_ERROR) socket.emit(NO_ERROR);
        else {
          await Transaction.create(data);
          validate = symmetric.encrypt(validate);
          socket.emit(ERROR, validate);
        }
      });
    });
  }

  start() {
    server.close();
    server.listen(PORT, () => {
      console.log(`soket run on port ${PORT}`);
    });
  }
}
export default new Socket();
