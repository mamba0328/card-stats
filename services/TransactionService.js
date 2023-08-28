const MCC_DECODED = require('../config/MCC_DECODED');

class TrasactionService { 
    constructor(transactions, limit = 8500){
        if(!Array.isArray(transactions)) throw new Error('transaction should be in array');

        this._transactions = transactions;
        this.limit = limit;
    }

    get transactions(){
        return this._transactions; 
    }

    setNewTransactions(transaction){
        if(!Array.isArray(transactions)) throw new Error('transaction should be in array');

        this._transactions = transaction;
    }

    getCategoryCodes(...category) {
        const matchingCategoriesCodes = MCC_DECODED.filter(transaction => category.includes(transaction.group.type)).map(transaction => +transaction.mcc);
        return matchingCategoriesCodes
    }
    
    getTransactionsByCattegory(...category){ 
        const matchingCategoriesCodes = this.getCategoryCodes(...category)

        return new TrasactionService(this._transactions.filter(transaction => matchingCategoriesCodes.includes(+transaction.mcc)));
    }

    getTransactionsButCattegory(...category){ 
        const matchingCategoriesCodes = this.getCategoryCodes(...category)

        return new TrasactionService(this._transactions.filter(transaction => !matchingCategoriesCodes.includes(+transaction.mcc)));
    }

    getOutcomesByCattegory(...category){ 
        const transactionsByCattegory = this.getTransactionsByCattegory(...category);

        return new TrasactionService(transactionsByCattegory.filter(transaction => transaction.amount < 0));
    }

    getSumOfAllOutcomes(transactions = this.transactions) { 
        return transactions.reduce((accumulator, next) => {
            const amount = next.amount < 0 ? Math.floor(next.amount/100) : 0;
            return amount + accumulator; 
        }, 0)
    }

    getTop(amount = 3) { 
        return this.transactions.sort((prev, next) => prev.amount - next.amount).slice(0, amount);
    }

    getSumOfAllTransactions(transactions = this.transactions) { 
        return transactions.reduce((accumulator, next) => {
            return next.amount/100 + accumulator; 
        }, 0)
    }
}

module.exports = TrasactionService;