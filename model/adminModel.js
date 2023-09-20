const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });
const bcrypt = require("bcryptjs");
// const otpGene = require("otp-generator");
// const sendmail = require("../config/common");

var Admin = function (data) {};

Admin.login = async function (postdata) {
  return new Promise((resolve, reject) => {
    var queryString = "SELECT * FROM tg_admindata where email  = ?";
    var filter = [postdata.email];
    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.log("error", err);
        return reject(err);
      } else {
        if (res.length === 0) {
          return resolve(null);
        }
        const userData = res[0];
        bcrypt.compare(postdata.password, userData.password, function (bcryptErr, bcryptRes) {
            if (bcryptErr) {
              console.log("bcrypt Error:", bcryptErr);
              return reject(bcryptErr);
            } else if (bcryptRes) {
              return resolve(userData);
            } else {
              return resolve(null);
            }
          }
        );
      }
    });
  });
};

Admin.sessionToken = async (data) => {
  return new Promise((resolve, reject) => {
    var tokenData = { id: data.id, email: data.email, password: data.password };
    var token = jwt.sign({ tokenData }, process.env.SECRET_KEY, {
      algorithm: process.env.ALGORITHAM,
    });
    data.sessionToken = token;
    var queryString = `UPDATE tg_admindata SET token= ? WHERE id = '${data.id}' `;

    var filter = [data.sessionToken];
    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.log("erty", err);
        return reject(err);
      } else {
        return resolve(token);
      }
    });
  });
};

Admin.logout = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.authorization) {
      return reject("Authorization token is missing");
    }

    var token = postdata.authorization;
    var queryString = `SELECT * FROM tg_admindata where token = ?`;
    var filter = [token];

    db.query(queryString, filter, (error, results) => {
      if (error) {
        console.error("Error logging out user:", error);
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
};

Admin.logOutUserData = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.id) {
      return reject("User ID is missing");
    }
    const userId = postdata.id;
    const queryString = "UPDATE tg_admindata SET token = NULL WHERE id = ?";
    const filter = [userId];

    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.error("Error logging out user:", err);
        return reject(err);
      } else {
        if (res.affectedRows === 0) {
          return reject("User not found");
        }
        return resolve({ message: "User logged out successfully" });
      }
    });
  });
};

Admin.passwordChange = async function (postdata) {
  return new Promise(async (resolve, reject) => {
    const userEmail = postdata.email;
    const userPswd = postdata.password;
    const queryString = "UPDATE tg_admindata SET password = ? WHERE email = ?";
    var hashedPassword = await bcrypt.hash(userPswd, 12);

    const filter = [hashedPassword, userEmail];
    db.query(queryString, filter, function (err, res) {
      if (err) {
        return reject(err);
      } else {
        console.log("Resp :-", res);
        return resolve(res);
      }
    });
  });
};

module.exports = Admin;
