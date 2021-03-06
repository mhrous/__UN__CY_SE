import Certifcate from "./certifcate";
import HybridCryptography from "./HybridCryptography";
import publicKey from "../publicKey";
import privateKey from "../privateKey";
import User from "../model/user";
const hybrid = new HybridCryptography();
const certifcate = new Certifcate();
hybrid.setPublicKey(publicKey);
hybrid.setPrivateKey(privateKey);
export const singIn = async (req, res, next) => {
  try {
    const { dataEn, publicKey: userPublicKey } = req.body;
    hybrid.setReceiverPublicKey(userPublicKey);

    const data = hybrid.decrypt(dataEn);
    if (!data) {
      return res.status(400).send("someone distroed data pleas try again");
    }

    const { userName, password } = data;
    const user = await User.findOne({ userName }).exec();
    if (!user) {
      return res
        .status(400)
        .send(
          "We did not get to know you, please visit us soon and introduce yourself"
        );
    }
    const truePassword = user.checkPassword(password);
    if (!truePassword) return res.status(400).send("password worng");
    const result = certifcate.bulid(userPublicKey, { type: "user", userName });
    res.json(result);
  } catch (e) {
    console.log(e);
  }
};
export const singUp = () => {};
export const createServeCertifcate = () => {};
