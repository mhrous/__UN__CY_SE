"use strict";

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _certifcate = _interopRequireDefault(require("./utils/certifcate"));

var _serverPublicKey = _interopRequireDefault(require("./serverPublicKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const certifcate = new _certifcate.default();
const serverCertifcate = certifcate.bulid(_serverPublicKey.default, {
  type: "server"
});
console.log(serverCertifcate);
(0, _fs.writeFileSync)(_path.default.join(__dirname, "serverCertifcate.txt"), JSON.stringify(serverCertifcate), {
  encoding: "utf8"
});