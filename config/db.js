const mysql = require('mysql');
require("dotenv").config({ path: "./.env" })

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
})

connection.connect((error)=>{
    if(error){
        console.log("error")
    } else{
        console.log("db connection success")
    }
})

module.exports = connection