const express = require('express');
const bodyParser = require('body-parser');

const TrasactionService = require('./services/TransactionService');
const mailsController = require('./controllers/mailsController');
const bankApiController = require('./controllers/bankApiController');
const CARDS_ID = require('./config/CARDS_ID');
const categories = require('./config/MCC_TYPES');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function getCardsTransaction() {
  try {
    const blackCardData = await bankApiController.getThisMonthAccountData(CARDS_ID.BLACK_CARD_ID);
    const whiteCardData = await bankApiController.getThisMonthAccountData(CARDS_ID.WHITE_CARD_ID);

    const blackCardService = new TrasactionService(blackCardData).getTransactionsByCattegory(categories.RETAIL);
    const blackCardOutcomes = blackCardService.getSumOfAllOutcomes();
    const topBlackCardOutcomes = blackCardService.getTop(5);

    const whiteCardService = new TrasactionService(whiteCardData).getTransactionsButCattegory(categories.SERVICE_PROVIDER);
    const whiteCardOutcomes = whiteCardService.getSumOfAllOutcomes();
    const topWhiteCardOutcomes = whiteCardService.getTop(5);
    
    return [
      {
        name: 'Food Card (Black)',
        limit: blackCardService.limit,
        outcomes: blackCardOutcomes,
        top: topBlackCardOutcomes,
      },
      {
        name: 'Eating-out Card (White)',
        limit: whiteCardService.limit,
        outcomes: whiteCardOutcomes,
        top: topWhiteCardOutcomes,
      },
    ]
  } catch (error) {
    console.error('Get cards transactions failed with:', error);
    throw error; // Re-throw the error to be caught by the error handling middleware
  }
}

function renderTopTransactions(top) {
  return top.map((transaction, index) => { 
    const { description, time, amount } = transaction;
    const roundedAmount = `${Math.floor(amount / 100)}`;
    const decodedTime = new Date(time * 1000).toLocaleString();
    return `${index + 1}. ${description}: ${roundedAmount}₴ \t(${decodedTime})`
  }).join('\n\t')
}

function setupMessage(transactionsData) {
  return transactionsData.map(element => {
    const { name, limit, outcomes, top } = element; 
    const left = Math.floor(limit + outcomes); //outcomes are negative
    return `
      ${name}\n
      ${limit ? `Your limit for the month is:${limit}₴` : ''}\n 
      You've spent already: ${outcomes}₴ \n
      Your top transactions: \n
      ${renderTopTransactions(top)}\n
      ${left > 0 ? `${left}₴: left` : `${left}₴: for the next month debt`}
    `
  }).join('\n\n\n')
}

async function sendStatisticForThisMonth() {
  try {
    const transactions = await getCardsTransaction();
    const message = setupMessage(transactions);

    mailsController.sendEmail(message, 'Monthly expenses');
  } catch (error) {
    console.error('Sending monthly statistics failed with:', error);
  }
}

async function startApp() {
  try {
    await sendStatisticForThisMonth();
  } catch (error) {
    console.error('App startup failed with:', error);
  }
}

startApp()

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;