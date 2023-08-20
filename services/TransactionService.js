const MCC_DECODED = require('../config/MCC_DECODED');


class TrasactionService { 
    constructor(transactions){
        if(!Array.isArray(transactions)) throw new Error('transaction should be in array');

        this._transactions = transactions; 
    }

    get transactions(){
        return this._transactions; 
    }


    setNewTransactions(transaction){
        if(!Array.isArray(transactions)) throw new Error('transaction should be in array');

        this._transactions = transaction;
    }

    getTransactionsByCattegory(...category){ 
        const matchingCategoriesCodes = MCC_DECODED.filter(transaction => category.includes(transaction.group.type)).map(transaction => transaction.mcc);

        return this._transactions.filter(transaction => matchingCategoriesCodes.includes(transaction.mcc));
    }
}

module.exports = TrasactionService;