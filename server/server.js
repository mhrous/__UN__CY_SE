const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

class Socket {
  constructor() {
    this.users = {};
    this.init();
  }
  init() {
    io.use(async (socket, next) => {
      next();
    }).on("connection", socket => {
      console.log("CONNECTED");

      socket.on("player move", function(data) {});
    });
  }

  start() {
    server.close();
    server.listen(4000);
  }
}
module.exports = new Socket();
