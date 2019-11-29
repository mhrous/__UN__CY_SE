const { connect, User, Transaction } = require("./model");
const socket = require("./server");
socket.start();
const start = async () => {
  await connect();
};
window.$UserDB = User;
window.$TransactionDB = Transaction;
window.$socket = socket;

start();
