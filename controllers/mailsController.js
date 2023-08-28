const MailService = require('../services/MailService');
const EMAILS = require('../config/EMAILS');

const mailsController = {
    mailService: new MailService(),

    renderTopTransactions(top) {
        return top.map((transaction, index) => { 
          const { description, time, amount } = transaction;
          const roundedAmount = `${Math.floor(amount / 100)}`;
          const decodedTime = new Date(time * 1000).toLocaleString();
          return `${index + 1}. ${description}: ${roundedAmount}₴ \t(${decodedTime})`
        }).join('\n\t')
    },
      
    setupMontlyMessage(transactionsData) {
        return transactionsData.map(element => {
          const { name, limit, outcomes, top } = element; 
          const left = Math.floor(limit + outcomes); //outcomes are negative
          return `
            ${name}\n
            ${limit ? `Your limit for the month is:${limit}₴` : ''}\n 
            You've spent already: ${outcomes}₴ \n
            Your top transactions: \n
            ${this.renderTopTransactions(top)}\n
            ${left > 0 ? `${left}₴: left` : `${left}₴: for the next month debt`}
          `
        }).join('\n\n\n')
    },
    
    // setupWeaklyMessage(transactionsData) {
    //   return transactionsData.map(element => {
    //     const { name, limit, outcomes, top } = element; 
    //     const left = Math.floor(limit + outcomes); //outcomes are negative
    //     return `
    //       ${name}\n
    //       ${limit ? `Your limit for the month is:${limit}₴` : ''}\n 
    //       You've spent already: ${outcomes}₴ \n
    //       Your top transactions: \n
    //       ${this.renderTopTransactions(top)}\n
    //       ${left > 0 ? `${left}₴: left` : `${left}₴: for the next month debt`}
    //     `
    //   }).join('\n\n\n')
    // },
    
    sendEmail(text, subject) {
        const mailOptions = {
            from: EMAILS.FROM,
            to: EMAILS.TO,
            subject,
            text,
        }

        this.mailService.sendEmail(mailOptions);
    },

    sendMontlyMail(transactionsData) {
        const message = this.setupMontlyMessage(transactionsData);
        this.sendEmail(message, 'Monthly expenses');
    }

}

module.exports = mailsController;