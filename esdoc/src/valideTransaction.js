/**
 *  تابع لفحص الحوالة المالية اذا كانت صالحة او لا
 * <br>
 * قمنا بمناقشة عدة حالات 
 * <ul>
 * <li>انا يكون المرسل ليس لديه حساب </li>
 * <li>ان تكون كلمة سر حساب المرسل خطا</li>
 * <li>ان يكون المستقبل ليس لديه حساب</li>
*  <li>عدم وجود رصيد كافي</li>
*  <li>ارسال حوالة سالبة</li>
*  <li>ان يرسل الشخص لنفسه</li>
*  <li>ان تكون االحوالة مضافة من قبل</li>

 * </ul>
 *

 */
export async function validate({
  from,
  password,
  amount,
  to,
  clientTransactionId
}) {
  try {
    //
    const user = await User.findOne({ userName: from }).exec();
    if (user == null) return { validate: "this acount dont exist" };
    //
    const truePassword = user.checkPassword(password);
    if (!truePassword) return { validate: "password is error" };
    //
    const isSame = to == from;
    if (isSame) return { validate: "cont transform to your self" };

    //
    const resiver = await User.findOne({ userName: to })
      .lean()
      .exec();
    if (resiver == null) return { validate: "this no resever accont" };

    //
    const haveMony = user.accountBalance >= amount;
    if (!haveMony) return { validate: "dont have envf mony" };

    const negativAmount = 0 >= amount;
    if (negativAmount)
      return { validate: "Negative trainsaction cannot be transferred" };

    const TransactionId = await Transaction.findOne({
      from: user._id,
      clientTransactionId
    })
      .lean()
      .exec();

    if (TransactionId)
      return {
        validate:
          "A transfer has been added with this id. You cannot add it again"
      };

    return {
      validate: NO_ERROR,
      _from: user._id,
      _to: resiver._id,
      rest: `Done ...\nYour account remains${user.accountBalance - amount}`
    };
  } catch (e) {
    console.error(e);
    return { validate: "error" };
  }
}
