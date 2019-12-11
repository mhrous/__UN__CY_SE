/**
 *
 * express , sokcket io الخاص بالسيرفر تم بنائه بالاعتماد على  sokcet
 *<br>
 *
 *مراحل عمله
 *
 * <ul>
 * <li>ينتظر اتصال كلاينت </li>
 * <li>Object عند اتصال كلاينت ينشى تلات
 * <ul>
 * <li>AsymmetricCryptography</li>
 * <li>HybridCryptography</li>
 * <li>SymmetricCryptography</li>
 * </ul>
 *
 *  </li>
 * <li> يرسل الببليك كي الخاص به الى الكليبت ليستطيع الكلاينت تشفير الداتا وارسالها اليه</li>

 * <li> ينتظر الكلاينت ليرسل له الببليك كي لكي يهيى المتغيرات</li>
 * <li> ينتظر حوالة من الكلينت ليقوم بمعالجتها</li>

 * </ul>
 */
class SocketServer {
  constructor() {
    // const { publicKey, privateKey } = generateKeys();
    // this.publicKey = publicKey;
    // this.privateKey = privateKey;
    // this.init();
  }

  /**
   *
   * @emits {THIS_IS_MY_PUBLIC_KEY} يتم اطلاق هذا الحدث عند بدية كل اتصال بهدف ارسال مفتاح التشفير العام للسيرفر لكلينت المتصل
   * @emits {ERROR} بعد معالجة الحوالة في حال وجود خطا يتم اطلاق هذا الحدث مع رسالة مشفرة تعبر عن الخطا.
   * @emits {NO_ERROE} بعد معالجة الحوالة في حال  عدم وجود خطا يتم اطلاق هذا الحدث مع رسالة مشفرة تعبر عن كمية الرصيد المتبقي.
   * @listens {connection} ينتظر حتى يتم الاتصال مع كلينت جديد
   * @listens {disconnect} ينتظر حتى يتم قطع الاتصال
   * @listens {THIS_IS_MY_PUBLIC_KEY} ينتظر حتى يرسل اللكليت الببلك كي الخاص به
   * @listens {SEND_TRANSACTION} ينتظر حتى يقوم المستخدم بارسال حوالة جديدة
   */

  init() {
    io.use(async (socket, next) => {
      // console.log(socket.handshake.query);
      // for authentication
      next();
    }).on("connection", socket => {
      const symmetric = new SymmetricCryptography();
      const asymmetric = new AsymmetricCryptography();
      asymmetric.setPrivateKey(this.privateKey);
      asymmetric.setPublicKey(this.publicKey);
      const hybrid = new HybridCryptography();
      hybrid.setPrivateKey(this.privateKey);
      hybrid.setPublicKey(this.publicKey);

      const { key, iv } = JSON.parse(KEY);
      symmetric.setKye(key);
      symmetric.setIv(iv);

      socket.emit(THIS_IS_MY_PUBLIC_KEY, this.publicKey);

      socket.on(THIS_IS_MY_PUBLIC_KEY, data => {
        asymmetric.setReceiverPublicKey(data);
        hybrid.setReceiverPublicKey(data);
      });

      socket.on(SEND_TRANSACTION, async data => {
        if (REQUEST == 1) {
          symmetric.setKye(key);
          symmetric.setIv(iv);
          data = symmetric.decrypt(data);
        } else if (REQUEST == 2) {
          data = hybrid.decrypt(data);
          symmetric.setKye(hybrid.symmetric.key);
          symmetric.setIv(hybrid.symmetric.iv);
        }

        let { validate, _from, _to, rest } = await this.validate(data);
        if (validate == NO_ERROR) {
          Transaction.create(Object.assign({}, data, { to: _to, from: _from }));
          rest = symmetric.encrypt(rest);
          socket.emit(NO_ERROR, rest);
        } else {
          validate = symmetric.encrypt(validate);
          socket.emit(ERROR, validate);
        }
      });

      socket.on("disconnect", reason => {});
    });
  }

  start() {
    server.close();
    server.listen(PORT);
  }
}
export default SocketServer;
