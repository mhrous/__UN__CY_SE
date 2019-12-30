"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _config = require("./config");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
exports.app = app;
app.disable("etag");
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _cors.default)());
app.use((0, _morgan.default)("dev"));
app.post("/its/singin", _utils.singIn);

const start = async () => {
  try {
    await (0, _utils.connect)();
    app.listen(_config.port, () => {
      console.log(`REST API on http://localhost:${_config.port}/its`);
    });
  } catch (e) {}
};

exports.start = start;