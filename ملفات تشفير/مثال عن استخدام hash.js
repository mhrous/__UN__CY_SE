const crypto = require("crypto");
const hash = crypto.createHash("sha256");

hash.update("one");
console.log(hash.copy().digest("hex"));

hash.update("two");
console.log(hash.copy().digest("hex"));

hash.update("three");
console.log(hash.copy().digest("hex"));
