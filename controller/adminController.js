var db = require("../config/db");
var adminModel = require("../model/adminModel");
const { check, validationResult, matchedData, oneOf, body } = require('express-validator');
// const sendmail = require("../config/common")


exports.login = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const x = matchedData(req);
        return res.send({ message: 'Invalid Values', status: 'invalid', err: errors.mapped() });
    }
    try {
        db.beginTransaction()
        var loginData = await adminModel.login(req.body); 
        if(loginData.id){
            var generateToken = await adminModel.sessionToken(loginData)
            db.commit();
            res.json({message: "Admin Login Successfull", token : generateToken})

        }else{
            db.rollback();
            res.status(401).json({error : "Datas Error"})
        }

    } catch (error) {
        db.rollback();
        res.status(401).json({error : "Data Error"})
    }
}

exports.logOutAdmin = async (req, res) => {
    try {
        db.beginTransaction()
        var loginData = await adminModel.logout(req.headers) 
        const loginDataValue = loginData[0] 
        if(loginDataValue){
             var logOutUser = await adminModel.logOutUserData(loginDataValue)
            db.commit();
            res.json({message: "User Successfull", logOutUser})
        }else{
            db.rollback();
            res.status(401).json({error : "Datas Errorsssss"})
        }
    } catch (error) {
        db.rollback();
        res.status(401).json({ error: "Data Error" });
    }
}

exports.chnagePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const x = matchedData(req);
        return res.send({ message: 'Invalid Values', status: 'invalid', err: errors.mapped() });
    }
    try {
        db.beginTransaction() 
        var changePswd = await adminModel.passwordChange(req.body)
        if(changePswd){
            db.commit()
            res.status(200).json({message: "Password changed has been successfull"})
        }else{
            db.rollback();
            res.status(401).json({message: "Email is not Found:"})
        }
    } catch (error) {
        db.rollback();
        res.status(401).json({ error: "Data Error" });
    }
}