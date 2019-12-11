import crypto from "crypto";

/**
 *  Node js الموجودة داخل  crypto  تشفير البيانات بطريقة متناظرة تم بناءه بالاعتماد على مكتبة
 * <br/>
 *  decrypt وتابع فك التشفير encrypt يحتوي تابعين رئيسين تابع تشفير
 * <br/>
 * iv و key لتشفير والتي تحتاج الى متغيران رئسيين   "aes-256-cbc" قمنا باستخدام خورزمية
 *<br>
 *
 * @example
 * const symmetric = new SymmetricCryptography();
 * const kye = crypto.randomBytes(32);
 * const iv = crypto.randomBytes(16);
 * symmetric.setKye(key);
 * symmetric.setIv(iv);
 * // can encrypt plain text or json object
 * const data = "...."
 * const enc = symmetric.encrypt(data)
 * // default return data as json object if you wont return as text we have add option pramiter false
 * const dec = symmetric.decrypt(enc)
 *
 *
 */

class SymmetricCryptography {
  constructor() {
    this.algorithm = "aes-256-cbc";
    /**
     * @type {Buffer}
     */
    this.key = null;
    /**
     * @type {Buffer}
     */
    this.iv = null;
  }
  /**
   * @param {Buffer} key -Buffer يتم تحويله بشكل تلقائي الى  json اذا تمت اضافته بشكل  Buffer المفتاح الخاص بالتشفير يجب ان يكون نوعه
   */
  setKye(key) {
    if (!Buffer.isBuffer(key)) this.key = Buffer.from(key.data);
    else this.key = key;
  }
  /**
   * @param {Buffer} iv -Buffer يتم تحويله بشكل تلقائي الى  json اذا تمت اضافته بشكل  Buffer مفتاح خاص تتطلبه خورزمية التشفير المستعملة  يجب ان يكون نوعه
   */
  setIv(iv) {
    if (!Buffer.isBuffer(iv)) this.iv = Buffer.from(iv.data);
    else this.iv = iv;
  }

  /**
   * key و iv تابع لتشفير الداتا حسب
   * <br>
   * json object وتوابع التشفير المدعومة بالمكتبة لا تسطيع تشفير سوا النصوص لذلك عند ادخل josn object  نظامنا يعتمد على تبادل البيانات بشكل
   *<br />
   *  stringify نقوم بتحويله الى نص عن طريق عملية
   * @param {String} data -النص المراد تشفيره
   * @return {Object} {iv:Buffer,encryptedData:String }; -المعتمد بالتشفير iv  الداتا المشفرة و
   */
  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);
    let cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString("hex"),
      encryptedData: encrypted.toString("hex")
    };
  }

  /**
   * key و iv تابع لفك تشفير الداتا حسب
   * <br>
   * @param {Object} data - الابجيكت المراد فك تشفيره
   * @param {Boolean} returnJson -والا يرده كنص Json يرد الخرج   True متغير افتراضي في حال
   * @return {Object} ; نتيجة فك التشفير
   */
  decrypt(data, returnJson = true) {
    let encryptedText = Buffer.from(data.encryptedData, "hex");
    let decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return returnJson ? JSON.parse(decrypted.toString()) : decrypted.toString();
  }
}

export default SymmetricCryptography;
