"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.line = exports.emptyLine = exports.red = exports.blue = exports.green = exports.createFile = exports.updateFile = exports.deleteFile = exports.readFile = void 0;

var _fs = require("fs");

var _uuid = require("uuid");

var _config = require("./config");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getFilePath = fileName => `${_config.DATA_PATH}/${fileName}.txt`;

const readFile = ({
  fileName
}) => {
  const filePath = getFilePath(fileName);
  const exists = (0, _fs.existsSync)(filePath);

  if (!exists) {
    return "error";
  }

  const text = (0, _fs.readFileSync)(filePath, "utf8");
  return {
    title: fileName,
    content: text
  };
};

exports.readFile = readFile;

const deleteFile = ({
  fileName
}) => {
  const filePath = getFilePath(fileName);
  (0, _fs.unlinkSync)(filePath);
  return "success";
};

exports.deleteFile = deleteFile;

const updateFile = ({
  lastFileName,
  newText,
  newFileName
}) => {
  deleteFile({
    fileName: lastFileName
  });
  createFile({
    text: newText,
    fileName: newFileName
  });
};

exports.updateFile = updateFile;

const createFile = ({
  text,
  fileName = undefined
}) => {
  fileName = fileName || (0, _uuid.v4)();
  const filePath = getFilePath(fileName);
  const exists = (0, _fs.existsSync)(filePath);

  if (exists) {
    return "error";
  }

  (0, _fs.writeFileSync)(filePath, text);
  return {
    text,
    fileName
  };
  return "success";
};

exports.createFile = createFile;
const green = _chalk.default.green.bold;
exports.green = green;
const blue = _chalk.default.blue.bold;
exports.blue = blue;
const red = _chalk.default.red.bold;
exports.red = red;
const emptyLine = "\n";
exports.emptyLine = emptyLine;
const line = "-".repeat(75);
exports.line = line;