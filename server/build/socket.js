"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _model = require("./model");

var _config = require("./config");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

const server = _http.default.Server(app);

const io = (0, _socket.default)(server);

class Socket {
  constructor() {
    const {
      publicKey,
      privateKey
    } = (0, _utils.generateKeys)();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
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
      if (user == null) return "this acount dont exist"; //

      const truePassword = user.checkPassword(password);
      if (!truePassword) return "password is error"; //

      const isSame = to == from;
      if (isSame) return "cont transform to your self"; //

      const resiver = await _model.User.findOne({
        userName: to
      }).lean().exec();
      if (resiver == null) return "this no resever accont"; //

      const haveMony = user.accountBalance >= amount;
      if (!haveMony) return "dont have envf mony";
      const negativAmount = 0 >= amount;
      if (negativAmount) return "Negative trainsaction cannot be transferred";
      const TransactionId = await _model.Transaction.findOne({
        from,
        clientTransactionId
      }).lean().exec();
      if (!TransactionId) return "A transfer has been added with this id. You cannot add it again";
      return _utils.NO_ERROR;
    } catch (e) {
      return "error";
    }
  }

  init() {
    io.use(async (socket, next) => {
      console.log(socket.handshake.query); // for authentication

      next();
    }).on("connection", socket => {
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
      socket.emit(_utils.THIS_IS_MY_PUBLIC_KEY, this.publicKey);
      socket.on(_utils.THIS_IS_MY_PUBLIC_KEY, data => {
        asymmetric.setReceiverPublicKey(data);
        hybrid.setReceiverPublicKey(data);
      });
      socket.on(_utils.SEND_TRANSACTION, async data => {
        if (_config.REQUEST == 1) {
          symmetric.setKye(key);
          symmetric.setIv(iv);
          data = symmetric.decrypt(data);
        } else if (_config.REQUEST == 2) {
          symmetric.setKye(hybrid.symmetric.key);
          symmetric.setIv(hybrid.symmetric.iv);
          data = hybrid.decrypt(data);
        }

        let validate = await this.validate(data);
        if (validate == _utils.NO_ERROR) socket.emit(_utils.NO_ERROR);else {
          await _model.Transaction.create(data);
          validate = symmetric.encrypt(validate);
          socket.emit(_utils.ERROR, validate);
        }
      });
    });
  }

  start() {
    server.close();
    server.listen(_config.PORT, () => {
      console.log(`soket run on port ${_config.PORT}`);
    });
  }

}

var _default = new Socket();

exports.default = _default;