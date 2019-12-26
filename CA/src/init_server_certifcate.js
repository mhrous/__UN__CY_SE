import { writeFileSync } from "fs";
import path from "path";
import Certifcate from "./utils/certifcate";

import serverPublicKey from "./serverPublicKey";
const certifcate = new Certifcate();

const serverCertifcate = certifcate.bulid(serverPublicKey, { type: "server" });
console.log(serverCertifcate);
writeFileSync(
  path.join(__dirname, "serverCertifcate.txt"),
  JSON.stringify(serverCertifcate),
  {
    encoding: "utf8"
  }
);
