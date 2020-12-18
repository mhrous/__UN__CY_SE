"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _config = require("./config");

var _utils = require("./utils");

var _cryptography = require("./cryptography");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const app = (0, _express.default)();

const server = _http.default.Server(app);

const io = (0, _socket.default)(server);

class Socket {
  constructor() {
    _defineProperty(this, "errorHandel", ({
      socketEvent = null,
      data = {},
      type = null,
      error = null,
      socket = null
    }) => {
      if (socketEvent && socket) {
        socket.emit(socketEvent, data);
      }

      if (error) {
        console.log((0, _utils.red)("error"));
        console.log(error);
        console.log(_utils.line);
      }
    });

    _defineProperty(this, "eventStartHandel", ({
      socketEvent,
      data = null,
      socket,
      hybridCryptography,
      symmetricCryptography,
      asymmetricCryptography
    }) => {
      let decryptData = null;
      console.log((0, _utils.blue)(socketEvent), (0, _utils.green)("SOCKEt ID :"), socket.id);

      if (!data) {
        console.log(_utils.line);
      } else {
        console.log((0, _utils.green)("DATA ENCRYPT"));
        console.log(data);

        try {
          decryptData = (0, _cryptography.decrypt)({
            data,
            hybridCryptography,
            symmetricCryptography,
            asymmetricCryptography
          });
        } catch (error) {
          console.log(error);
          this.errorHandel({
            socketEvent: _config.SOCKET_EVENT.CRYPTOGRAPHY_ERROR,
            socket,
            error
          });
          return null;
        }

        console.log((0, _utils.green)("DATA DECRYPT"));
        console.log(decryptData);
        console.log(_utils.line);
      }

      return decryptData;
    });

    _defineProperty(this, "emitResultHandle", ({
      socketEvent,
      data,
      socket,
      hybridCryptography,
      symmetricCryptography,
      asymmetricCryptography
    }) => {
      const resultEncrypt = (0, _cryptography.encrypt)({
        data,
        hybridCryptography,
        symmetricCryptography,
        asymmetricCryptography
      });
      socket.emit(socketEvent, resultEncrypt);
    });

    const {
      publicKey,
      privateKey
    } = (0, _cryptography.generateKeyPairSync)();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.init();
  }

  init() {
    io.use((socket, next) => {
      //
      //
      //
      //
      //
      //
      next();
    }).on("connection", socket => {
      this.eventStartHandel({
        socketEvent: "NEW CONNECTION",
        socket
      });
      const hybridCryptography = new _cryptography.HybridCryptography(this.publicKey, this.privateKey);
      const symmetricCryptography = new _cryptography.SymmetricCryptography();
      const asymmetricCryptography = new _cryptography.AsymmetricCryptography(this.publicKey, this.privateKey);
      const symmetricCryptographyKey = (0, _cryptography.getHash)(socket.id);
      symmetricCryptography.setKye(symmetricCryptographyKey); // symmetricCryptography.setKye("errorerrorerrorerrorerrorerrorer")

      if (_config.TYPE_ACTIVE !== _config.TYPE_LIST.SYMMETRIC) {
        socket.emit(_config.SOCKET_EVENT.THIS_MY_PUBLIC_KEY, {
          publicKey: this.publicKey
        });
      }

      socket.on(_config.SOCKET_EVENT.THIS_MY_PUBLIC_KEY, data => {
        this.eventStartHandel({
          socketEvent: "received socket public key",
          socket
        });
        console.log(data);
        console.log(_utils.line);
        asymmetricCryptography.setReceiverPublicKey(data.publicKey);
        hybridCryptography.setReceiverPublicKey(data.publicKey);
      });
      socket.on(_config.SOCKET_EVENT.READ_FILE, data => {
        const decryptData = this.eventStartHandel({
          socketEvent: _config.SOCKET_EVENT.READ_FILE,
          socket,
          data,
          hybridCryptography,
          symmetricCryptography,
          asymmetricCryptography
        });
        if (!decryptData) return;
        const result = (0, _utils.readFile)({
          fileName: decryptData.title
        });

        if (result === "error") {
          this.emitResultHandle({
            socket,
            data: {
              data: "this file not fount"
            },
            socketEvent: _config.SOCKET_EVENT.ERROR,
            hybridCryptography,
            symmetricCryptography,
            asymmetricCryptography
          });
        } else {
          this.emitResultHandle({
            socket,
            data: result,
            socketEvent: _config.SOCKET_EVENT.READ_FILE,
            hybridCryptography,
            symmetricCryptography,
            asymmetricCryptography
          });
        }
      });
      socket.on(_config.SOCKET_EVENT.CREATE_FILE, data => {
        const decryptData = this.eventStartHandel({
          socketEvent: _config.SOCKET_EVENT.CREATE_FILE,
          socket,
          data,
          hybridCryptography,
          symmetricCryptography,
          asymmetricCryptography
        });
        if (!decryptData) return;
        const result = (0, _utils.createFile)({
          text: decryptData.content,
          fileName: decryptData.title
        });

        if (result === 'error') {
          this.emitResultHandle({
            socket,
            data: {
              data: "Sorry This File Is Exit"
            },
            socketEvent: _config.SOCKET_EVENT.ERROR,
            hybridCryptography,
            symmetricCryptography,
            asymmetricCryptography
          });
        } else {
          this.emitResultHandle({
            socket,
            data: {
              data: "Done"
            },
            socketEvent: _config.SOCKET_EVENT.SUCCESS,
            hybridCryptography,
            symmetricCryptography,
            asymmetricCryptography
          });
        }
      });
      socket.on(_config.SOCKET_EVENT.DELETE_FILE, data => {
        const decryptData = this.eventStartHandel({
          socketEvent: _config.SOCKET_EVENT.DELETE_FILE,
          socket,
          data,
          hybridCryptography,
          symmetricCryptography,
          asymmetricCryptography
        });
        if (!decryptData) return;
        const result = (0, _utils.deleteFile)({
          fileName: decryptData.title
        });

        if (result === "success") {
          this.emitResultHandle({
            socket,
            data: {
              data: "Delete success"
            },
            socketEvent: _config.SOCKET_EVENT.SUCCESS,
            hybridCryptography,
            symmetricCryptography,
            asymmetricCryptography
          });
        }
      });
      socket.on(_config.SOCKET_EVENT.UPDATE_FILE, data => {
        const decryptData = this.eventStartHandel({
          socketEvent: _config.SOCKET_EVENT.UPDATE_FILE,
          socket,
          data,
          hybridCryptography,
          symmetricCryptography,
          asymmetricCryptography
        });
        if (!decryptData) return;
        (0, _utils.updateFile)({
          lastFileName: decryptData.lastTitle,
          newFileName: decryptData.title,
          newText: decryptData.content
        });
        this.emitResultHandle({
          socket,
          data: {
            data: "Update success"
          },
          socketEvent: _config.SOCKET_EVENT.SUCCESS,
          hybridCryptography,
          symmetricCryptography,
          asymmetricCryptography
        });
      });
      socket.on("disconnect", () => {
        this.eventStartHandel({
          socketEvent: "DISCONNECT",
          socket,
          hybridCryptography,
          symmetricCryptography,
          asymmetricCryptography
        });
      });
    });
  }

  start() {
    server.close();
    server.listen(_config.PORT, () => {
      console.log(_utils.line);
      console.log((0, _utils.green)("success"), `socket run on port:`, (0, _utils.blue)(_config.PORT));
      console.log(_utils.line);
    });
  }

}

var _default = new Socket();

exports.default = _default;