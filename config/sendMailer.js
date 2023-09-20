const nodemailer = require("nodemailer")
require("dotenv").config({ path: "./.env" })


const sendmail = async function (email, mailsubject, content) {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailoptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: mailsubject,
            html: content,
        }
        transport.sendMail(mailoptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Mail sent successfully :- ", info.response)
            }
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = sendmail