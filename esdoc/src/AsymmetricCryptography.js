import crypto from "crypto";
import { PASSPHRASE } from "../config";

/**
 *  Node js الموجودة داخل  crypto  تشفير البيانات بطريقة غير متناظرة تم بناءه بالاعتماد على مكتبة
 * <br/>
 *  decrypt وتابع فك التشفير encrypt يحتوي تابعين رئيسين تابع تشفير
 * <br/>
 *الخاص بي private key  للشخص المراد ارسال الحوالة له وعملية فك التشفير تتم با  Public key عملية التشفير تتم ب
 *<br>
 *
 * @example
 * const asymmetric = new AsymmetricCryptography();
 * asymmetric.setPublicKey(MyPublickey);
 * asymmetric.setPrivateKey(MyPrivetKey);
 * asymmetric.setReceiverPublicKey(ReceiverPublicKey);
 * // can encrypt plain text or json object
 * const data = "...."
 * const enc = asymmetric.encrypt(data)
 * // default return data as json object if you wont return as text we have add option pramiter false
 * const dec = asymmetric.decrypt(enc)
 *
 *
 */

class AsymmetricCryptography {
  constructor() {
    /**
     * @type {String}
     */
    this.publicKey = null;
    /**
     * @type {String}
     */
    this.privateKey = null;
    /**
     * @type {String}
     */
    this.receiverPublicKey = null;
  }
  /**
   * @param {String} key  المفتاح العام بالمستقبل الذي سيتم التشفير بواستطه
   */
  setReceiverPublicKey(key) {
    this.receiverPublicKey = key;
  }
  /**
   * @param {String} key  المفتاح العام لي  الذي سيتم اعطائه للمستقبل اتشفير البيانات وارسالها الي
   */
  setPublicKey(key) {
    this.publicKey = key;
  }
  /**
   * @param {String} key  المفتاح الخاص لي  الذي سيتم عن طريقه فك المعلومات المشفرة المرسلة الي
   */
  setPrivateKey(key) {
    this.privateKey = key;
  }

  /**
   * @return {String} المفتاح العام لي  الذي سيتم اعطائه للمستقبل لتشفير البيانات وارسالها الي
   */
  getPublicKey() {
    return this.publicKey;
  }

  /**
   * للمستقبل public key تابع لتشفير الداتا حسب
   * <br>
   * stringify نقوم بتحويله الى نص عن طريق عملية  json object وتوابع التشفير المدعومة بالمكتبة لا تسطيع تشفير سوا النصوص لذلك عند ادخل josn object  نظامنا يعتمد على تبادل البيانات بشكل
   * @param {String} data -النص المراد تشفيره
   * @return {String} الداتا المشفرة ((يتم فك التشفير بالمفتاح الخاص بالمستقبل حصرا )) 
   */
  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);
    const buffer = Buffer.from(data, "utf8");

    const encrypted = crypto.publicEncrypt(this.receiverPublicKey, buffer);

    return encrypted.toString("base64");
  }

    /**
   *  prive key تابع لفك تشفير الداتا حسب
   * <br>
   * @param {Object} data - الابجيكت المراد فك تشفيره
   * @param {Boolean} returnJson -والا يرده كنص Json يرد الخرج   True متغير افتراضي في حال  
   * @return {Object} ; نتيجة فك التشفير
   */

  decrypt(data, returnJson = true) {
    const buffer = Buffer.from(data, "base64");
    const decrypted = crypto.privateDecrypt(
      { key: this.privateKey.toString(), passphrase: PASSPHRASE },
      buffer
    );
    return returnJson
      ? JSON.parse(decrypted.toString("utf8"))
      : decrypted.toString("utf8");
  }
}

export default AsymmetricCryptography;
