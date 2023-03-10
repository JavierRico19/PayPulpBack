const LoginManager = require("../../model/loginModel");
const jwt = require("jsonwebtoken");
const newClient = require("../../model/newClient");
const CryptoJS = require("crypto-js");
const UserDataManager = require("../../model/userData");
const PaymentMethodManager = require("../../model/paymentMethod");

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const md5Password = CryptoJS.MD5(password).toString();

  const dbEmail = await LoginManager.compareEmail(email);
  if (dbEmail.rows.length === 0) {
    return res.status(401).json("User not found!").end();
  }
  const dbPassword = dbEmail.rows[0].password;
  const userUuid = dbEmail.rows[0].user_uuid;
  if (email != dbEmail.rows[0].email || md5Password != dbPassword) {
    return res.status(401).json("Invalid user or password!").end();
  }

  const dbUserData = await UserDataManager.getUserData(userUuid);

  const paymentMethods = await PaymentMethodManager.getPaymentMethods(userUuid, {ispreferred: true})

  const userInfo = {
    email: dbEmail.rows[0].email,
    userUuid: dbEmail.rows[0].user_uuid,
    accountType: dbEmail.rows[0].account_type,
    ...dbUserData,
  };

  const token = jwt.sign({ userUuid }, process.env.SECRET, {
    algorithm: "HS256",
    expiresIn: 3000,
  });
  res.json({ token, userInfo, paymentMethods });
};

module.exports = loginController;
