const express = require('express');
const bodyParser = require('body-parser');

const TrasactionService = require('./services/TransactionService');
const bankApiController = require('./controllers/bankApiController');

const CARDS_ID = require('./config/CARDS_ID');
const categories = require('./config/MCC_TYPES');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// app.use('/api', apiRoutes); // Mount API routes under /api

async function getBankData(){
  // const blackCardData = await bankApiController.getAccountData(CARDS_ID.BLACK_CARD_ID);
  const whiteCardData = await bankApiController.getThisMonthAccountData(CARDS_ID.WHITE_CARD_ID);
  // const blackCardTransactions = new TrasactionService(blackCardData).getTransactionsByCattegory(categories.RETAIL);
  const whiteCardTransactions = new TrasactionService(whiteCardData ?? []).getTransactionsButCattegory(categories.SERVICE_PROVIDER).getSumOfAllOutcomes();
  console.log(whiteCardTransactions)
}

getBankData()



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;