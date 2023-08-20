const express = require('express');
const bodyParser = require('body-parser');
const bankApiController = require('./controllers/bankApiController');
const MCC_DECODED = require('./config/MCC_DECODED');
// const apiRoutes = require('./routes/apiRoutes'); // Import your API routes
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// app.use('/api', apiRoutes); // Mount API routes under /api

async function getBankData(){
    const respones = await bankApiController.getUserData();

    const {accounts} = respones;
    const [blackCard, whiteCard] = accounts;

    const blackCardTransactions = await bankApiController.getAccountData(whiteCard.id);
    const importantInfo = blackCardTransactions.map(transaction => {
        const {id, time, description, operationAmount, mcc} = transaction;
        const correspondeningMCC = MCC_DECODED.find(code => +code.mcc === +mcc)
        const newMCC = correspondeningMCC ?correspondeningMCC.fullDescription.en : 'Else';
        return {id, time, description, operationAmount, category: newMCC};
    }).sort((a, b) => a.mcc - b.mcc)

}

getBankData()



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;