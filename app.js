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

async function getWeeklyCardsTransaction() {  
  try {
    const blackCardData = await bankApiController.getThisMonthAccountData(CARDS_ID.BLACK_CARD_ID);
    const whiteCardData = await bankApiController.getThisMonthAccountData(CARDS_ID.WHITE_CARD_ID);

    const blackCardService = new TrasactionService(blackCardData).getTransactionsByCattegory(categories.RETAIL);
    const blackCardTotalOutcomes = blackCardService.getSumOfAllOutcomes();
    const blackCardOutcomesPreviousWeek = blackCardService.getPreviousWeekTransactions().getSumOfAllOutcomes();
    const blackCardTransactionsThisWeek = blackCardService.getThisWeekTransactions();
    const blackCardOutcomesThisWeek = blackCardTransactionsThisWeek.getSumOfAllOutcomes();
    const topBlackCardOutcomesThisWeek = blackCardTransactionsThisWeek.getTop(3);

    const whiteCardService = new TrasactionService(whiteCardData).getTransactionsButCattegory(categories.SERVICE_PROVIDER);
    const whiteCardTotalOutcomes = whiteCardService.getSumOfAllOutcomes();
    const whiteCardServicePreviousWeek = whiteCardService.getPreviousWeekTransactions().getSumOfAllOutcomes();
    const whiteCardTransactionsThisWeek = whiteCardService.getThisWeekTransactions();
    const whiteCardOutcomesThisWeek = whiteCardTransactionsThisWeek.getSumOfAllOutcomes();
    const topWhiteCardOutcomesThisWeek = whiteCardTransactionsThisWeek.getTop(3);
    
    return [
      {
        name: 'Food Card (Black)',
        limit: blackCardService.limit,
        outcomes: blackCardOutcomesThisWeek,
        prevOutcomes: blackCardOutcomesPreviousWeek,
        totalOutcomes:blackCardTotalOutcomes, 
        top: topBlackCardOutcomesThisWeek,
      },
      {
        name: 'Eating-out Card (White)',
        limit: whiteCardService.limit,
        outcomes: whiteCardOutcomesThisWeek,
        prevOutcomes: whiteCardServicePreviousWeek,
        totalOutcomes:whiteCardTotalOutcomes,
        top: topWhiteCardOutcomesThisWeek,
      },
    ]
  } catch (error) {
    console.error('Get cards transactions failed with:', error);
    throw error; // Re-throw the error to be caught by the error handling middleware
  }
}

async function getMontlyCardsTransaction() {//make conrtoller, logic inside is duplicated AND ABOVE!!!!!
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

async function sendStatisticForThisWeek() {
  try {
    const transactions = await getWeeklyCardsTransaction();
    mailsController.sendWeeklyMail(transactions);
  } catch (error) {
    console.error('Sending monthly statistics failed with:', error);
  }
}

async function sendStatisticForThisMonth() {
  try {
    const transactions = await getMontlyCardsTransaction();
    mailsController.sendMontlyMail(transactions);
  } catch (error) {
    console.error('Sending monthly statistics failed with:', error);
  }
}

async function startApp() {
  try {
    // setTimeout(sendStatisticForThisMonth, 60000)
    setTimeout(sendStatisticForThisWeek, 60000)
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