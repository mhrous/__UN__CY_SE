import socket from "./socket";
import { connect } from "./utils";
import initDb from "./initFakeDB";

export const start = async () => {
  await connect();
  // initDb();
  socket.start();
};
