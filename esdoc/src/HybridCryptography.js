import crypto from "crypto";
import SymmetricCryptography from "./SymmetricCryptography";
import AsymmetricCryptography from "./AsymmetricCryptography";

/**
 * وبالاعتماد على  Node js الموجودة داخل  crypto  تشفير البيانات بطريقة هجينة تم بناءه بالاعتماد على مكتبة

 * <ul>
 * <li>  SymmetricCryptography class</li>
 * <li>  AsymmetricCryptography class</li>
 * </ul>
 * <br>
 *  decrypt وتابع فك التشفير encrypt يحتوي تابعين رئيسين تابع تشفير
 * <br/>
 *
 *<br>
 *
 * @example
 * const hybrid = new HybridCryptography();
 * const kye = crypto.randomBytes(32);
 * const iv = crypto.randomBytes(16);
 * hybrid.setKye(key);
 * hybrid.setIv(iv);
 * hybrid.setPublicKey(MyPublickey);
 * hybrid.setPrivateKey(MyPrivetKey);
 * hybrid.setReceiverPublicKey(ReceiverPublicKey);
 * // can encrypt plain text or json object
 * const data = "...."
 * const enc = hybrid.encrypt(data)
 * // default return data as json object if you wont return as text we have add option pramiter false
 * const dec = hybrid.decrypt(enc)
 *
 *
 */

class HybridCryptography {
  constructor() {
    /**
     * @type {Object}
     */
    this.symmetric = new SymmetricCryptography();
    /**
     * @type {Object}
     */
    this.asymmetric = new AsymmetricCryptography();
  }

  /**
   * @param {String} key  المفتاح العام بالمستقبل الذي سيتم تشفير مفتاح تشفير المتناظر بواستطه
   */
  setReceiverPublicKey(key) {
    this.asymmetric.setReceiverPublicKey(key);
  }
  /**
   * @param {String} key  المفتاح العام لي  الذي سيتم اعطائه للمستقبل لتشفير مفتاح التشفير المتناظر في الرسالة المرسلة  الي
   */
  setPublicKey(key) {
    this.asymmetric.setPublicKey(key);
  }

  /**
   * @param {String} key  المفتاح الخاص لي  الذي سيتم عن طريقه فك مفتاح التشفير المتناظر   في الرسالة  المرسلة الي
   */
  setPrivateKey(key) {
    this.asymmetric.setPrivateKey(key);
  }

  /**
   * @return {String} المفتاح العام لي  الذي سيتم اعطائه للمستقبل لتشفير مفتاح التشفير المنتاظر في الرسالة المرسلة الي
   */
  getPublicKey() {
    return this.asymmetric.getPublicKey();
  }

  /**
   * @param {Buffer} key -Buffer يتم تحويله بشكل تلقائي الى  json اذا تمت اضافته بشكل  Buffer المفتاح الخاص بالتشفير يجب ان يكون نوعه
   */

  setKye(key) {
    this.symmetric.setKye(key);
  }
  /**
   * @param {Buffer} iv -Buffer يتم تحويله بشكل تلقائي الى  json اذا تمت اضافته بشكل  Buffer مفتاح خاص تتطلبه خورزمية التشفير المستعملة  يجب ان يكون نوعه
   */
  setIv(iv) {
    this.symmetric.setIv(iv);
  }

  /**
   *  تابع لتشفير الداتا بطريقة هجينة  تتم عملية التشفير بعدة مراحل
   * <ul>
   * <li>بشكل عشوائي key , iv  توليد </li>
   * <li>المولد  key , iv  تشفير مضمون الرسالة حسب </li>
   * <li> للمستقبل publick key حسب  key , iv تشفير </li>
   * </ul>
   * <br>
   * stringify نقوم بتحويله الى نص عن طريق عملية  json object وتوابع التشفير المدعومة بالمكتبة لا تسطيع تشفير سوا النصوص لذلك عند ادخل josn object  نظامنا يعتمد على تبادل البيانات بشكل
   * @param {String} data -النص المراد تشفيره
   * @return {object}  الداتا مشفرة بشكل متناظر مع مفتاح التشفير مشفر بشكل غير متناظر
   */

  encrypt(data) {
    if (typeof data == "object") data = JSON.stringify(data);
    const _kye = crypto.randomBytes(32);
    const _iv = crypto.randomBytes(16);
    this.setKye(_kye);
    this.setIv(_iv);
    const dataEncrypt = this.symmetric.encrypt(data);
    const keyEncrypt = this.asymmetric.encrypt({ _kye, _iv });

    return { dataEncrypt, keyEncrypt };
  }

  /**
   *   تابع لفك تشفير الداتا حسب التشفير الهجين
   * <br />
   * تتم عملية فك التهجين بعدة مراحل 
   * <ul>
   * <li> privet key فك مفتاح التشفير حسب </li>
   * <li>   فك الرسالة حسب مفتاح التشفير  </li>

   * </ul>
   * @param {Object} data - الابجيكت المراد فك تشفيره
   * @param {Boolean} returnJson -والا يرده كنص Json يرد الخرج   True متغير افتراضي في حال  
   * @return {Object} ; نتيجة فك التشفير
   */

  decrypt(data, returnJson = true) {
    const { dataEncrypt, keyEncrypt } = data;

    const { _kye, _iv } = this.asymmetric.decrypt(keyEncrypt);
    this.setKye(_kye);
    this.setIv(_iv);
    return returnJson
      ? this.symmetric.decrypt(dataEncrypt)
      : this.symmetric.decrypt(dataEncrypt, false);
  }
}

export default HybridCryptography;
