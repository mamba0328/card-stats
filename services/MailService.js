const nodemailer = require("nodemailer");
const MAIL_PASSWORD = require('../config/MAIL_PASSWORD');
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            port: 465,
            secure: true,
            service: "gmail",
            auth: {
              user: "valentindjejylej@gmail.com",
              pass: MAIL_PASSWORD, // If you generated an app password
            },
        });
    }

    sendEmail(mailOptions) {
        // Send the email
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error:", error);
            } else {
              console.log("Email sent:", info.response);
            }
        });
    }
}

module.exports = MailService; 
