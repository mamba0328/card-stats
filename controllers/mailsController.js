const MailService = require('../services/MailService');
const EMAILS = require('../config/EMAILS');

const mailsController = {
    mailService: new MailService(),

    sendEmail(text, subject) {
        const mailOptions = {
            from: EMAILS.FROM,
            to: EMAILS.TO,
            subject,
            text,
        }

        this.mailService.sendEmail(mailOptions);
    }
}

module.exports = mailsController;