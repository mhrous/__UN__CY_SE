"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _chalk = _interopRequireDefault(require("chalk"));

var _serverCertifcate = _interopRequireDefault(require("./serverCertifcate"));

var _model = require("./model");

var _config = require("./config");

var _utils = require("./utils");

var _privateKey = _interopRequireDefault(require("./privateKey"));

var _publicKey = _interopRequireDefault(require("./publicKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const printLine = () => console.log("-".repeat(75));

const app = (0, _express.default)();

const server = _http.default.Server(app);

const io = (0, _socket.default)(server);

class Socket {
  constructor() {
    this.publicKey = _publicKey.default;
    this.privateKey = _privateKey.default;
    this.sessions = {};
    this.init();
  }

  async validate({
    from,
    password,
    amount,
    to,
    clientTransactionId
  }) {
    try {
      //
      const user = await _model.User.findOne({
        userName: from
      }).exec();
      if (user == null) return {
        validate: "this acount dont exist"
      }; //

      const truePassword = user.checkPassword(password);
      if (!truePassword) return {
        validate: "password is error"
      }; //

      const isSame = to == from;
      if (isSame) return {
        validate: "cont transform to your self"
      }; //

      const resiver = await _model.User.findOne({
        userName: to
      }).lean().exec();
      if (resiver == null) return {
        validate: "this no resever accont"
      }; //

      const haveMony = user.accountBalance >= amount;
      if (!haveMony) return {
        validate: "dont have envf mony"
      };
      const negativAmount = 0 >= amount;
      if (negativAmount) return {
        validate: "Negative trainsaction cannot be transferred"
      };
      const TransactionId = await _model.Transaction.findOne({
        from: user._id,
        clientTransactionId
      }).lean().exec();
      if (TransactionId) return {
        validate: "A transfer has been added with this id. You cannot add it again"
      };
      return {
        validate: _utils.NO_ERROR,
        _from: user._id,
        _to: resiver._id,
        rest: `Done ...\nYour account remains ${user.accountBalance - amount}`
      };
    } catch (e) {
      console.error(e);
      return {
        validate: "error"
      };
    }
  }

  init() {
    io.use(async (socket, next) => {
      let {
        certifcate
      } = socket.handshake.query;
      certifcate = JSON.parse(certifcate);
      const res = (0, _utils.verifyCertifacte)(certifcate);
      console.log(res);

      if (res.error) {
        return;
      }

      socket.certifcate = certifcate;
      next();
    }).on("connection", socket => {
      console.log("\n");
      console.log(_chalk.default.bgCyan.bold(" New Connection "), "Socket id:", _chalk.default.blue.bold(socket.id));
      console.log("\n");
      this.sessions[socket.id] = {};
      printLine();
      const symmetric = new _utils.SymmetricCryptography();
      const asymmetric = new _utils.AsymmetricCryptography();
      asymmetric.setPrivateKey(this.privateKey);
      asymmetric.setPublicKey(this.publicKey);
      const hybrid = new _utils.HybridCryptography();
      hybrid.setPrivateKey(this.privateKey);
      hybrid.setPublicKey(this.publicKey);
      const {
        key,
        iv
      } = JSON.parse(_config.KEY);
      symmetric.setKye(key);
      symmetric.setIv(iv);
      console.log(socket.certifcate.publicId);
      asymmetric.setReceiverPublicKey(socket.certifcate.publicId);
      hybrid.setReceiverPublicKey(socket.certifcate.publicId);
      socket.emit(_utils.THIS_IS_MY_PUBLIC_KEY, this.publicKey);
      socket.emit("serverCertifcatej", _serverCertifcate.default);
      socket.on(_utils.SEND_TRANSACTION, async data => {
        const {
          signature
        } = data;
        console.log("\n");
        console.log(_chalk.default.bgCyan.bold(" Send Transaction for "), "Socket id:", _chalk.default.blue.bold(socket.id));

        if (_config.REQUEST == 1) {
          console.log(_chalk.default.blue.bold("info"), "Cryptography Type :", _chalk.default.blue.bold("Symmetric"));
          console.log(_chalk.default.blue.bold("info"), "kye:", _chalk.default.blue.bold(Buffer.from(key.data).toString("hex")));
          console.log(_chalk.default.blue.bold("info"), "iv:", _chalk.default.blue.bold(Buffer.from(iv.data).toString("hex")));
          console.log("\n");
          console.log(_chalk.default.blue.bold("info"), "Encrypt Data");
          console.log(data);
          console.log("\n");
          symmetric.setKye(key);
          symmetric.setIv(iv);
          data = symmetric.decrypt(data);
        } else if (_config.REQUEST == 2) {
          // console.log(
          //   chalk.blue.bold("info"),
          //   "Cryptography Type :",
          //   chalk.blue.bold("Hybrid")
          // );
          // console.log("1 _ get Symmetric Key and iv from keyEncrypt");
          // console.log("2 _ decrypt dataEncrypt by  Key and iv");
          // console.log("\n");
          // console.log(chalk.blue.bold("info"), "Encrypt Data");
          // console.log(data);
          // console.log("\n");
          // if (this.sessions[socket.id][keyEncrypt]) {
          //   socket.emit(SESSION_ERROR, "");
          //   return;
          // } else {
          //   this.sessions[socket.id][keyEncrypt] = true;
          // }
          data = hybrid.decrypt(data);

          if (!data) {
            socket.emit(_utils.SIGNATURE_ERROR, "");
            return;
          }

          const sessionId = Buffer.from(hybrid.symmetric.key).toString("hex");

          if (this.sessions[socket.id][sessionId]) {
            socket.emit(_utils.SESSION_ERROR, "");
            return;
          } else {
            this.sessions[socket.id][sessionId] = true;
          }

          symmetric.setKye(hybrid.symmetric.key);
          symmetric.setIv(hybrid.symmetric.iv); // console.log(
          //   chalk.blue.bold("info"),
          //   "kye:",
          //   chalk.blue.bold(Buffer.from(hybrid.symmetric.key).toString("hex"))
          // );
          // console.log(
          //   chalk.blue.bold("info"),
          //   "iv:",
          //   chalk.blue.bold(Buffer.from(hybrid.symmetric.iv).toString("hex"))
          // );
        } // console.log(chalk.blue.bold("info"), "Decrypt Data");
        // console.table(data);
        // console.log("\n");


        let {
          validate,
          _from,
          _to,
          rest
        } = await this.validate(data);
        console.log(signature); // console.log(chalk.blue.bold("info"), "response");

        if (validate == _utils.NO_ERROR) {
          try {
            // console.log(chalk.green.bold("scusses"), rest);
            await _model.Transaction.create(_objectSpread({}, data, {
              to: _to,
              from: _from,
              signature: signature
            }));
            rest = symmetric.encrypt(rest);
            socket.emit(_utils.NO_ERROR, rest);
          } catch (e) {
            console.error(e);
          }
        } else {
          // console.log(chalk.red.bold("error"), validate);
          validate = symmetric.encrypt(validate);
          socket.emit(_utils.ERROR, validate);
        }

        printLine();
      });
      socket.on("disconnect", () => {
        console.log("\n");
        console.log(_chalk.default.bgCyan.bold("disconnect "), " Socket close:", _chalk.default.red.bold(socket.id));
        console.log("\n");
        printLine();
        delete this.sessions[socket.id];
      });
      socket.on(_utils.THIS_IS_MY_PUBLIC_KEY, data => {
        // console.log("\n");
        // console.log(
        //   chalk.bgCyan.bold(" Get Public key for "),
        //   "Socket id:",
        //   chalk.blue.bold(socket.id)
        // );
        // console.log("\n");
        // console.log(chalk.bgGray.blue(data.toString()));
        // console.log("\n");
        // printLine();
        asymmetric.setReceiverPublicKey(data);
        hybrid.setReceiverPublicKey(data);
      });
    });
  }

  start() {
    server.close();
    server.listen(_config.PORT, () => {
      console.log("\n");
      console.log(_chalk.default.green.bold("success"), `socket run on port:`, _chalk.default.blue.bold(_config.PORT));
      console.log("\n");
      printLine();
    });
  }

}

var _default = new Socket();

exports.default = _default;