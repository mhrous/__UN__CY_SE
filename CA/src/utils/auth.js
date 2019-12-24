import Certifcate from "./certifcate";
import HybridCryptography from "./HybridCryptography";
import publicKey from "../publicKey";
import privateKey from "../privateKey";

export const singIn = (req, res, next) => {
  try {
    const dataEn = req.body;
    const hybrid = new HybridCryptography();
    hybrid.setPublicKey(publicKey);
    hybrid.setPrivateKey(privateKey);
    const data = hybrid.decrypt(dataEn);

    console.log(data);
    res.json({ hi: 76543 });
  } catch (e) {
    console.log(e);
  }
};
export const singUp = () => {};
export const createServeCertifcate = () => {};
