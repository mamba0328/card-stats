const MCC_DECODED = require('../config/MCC_DECODED');

const weekInASeconds = 604800;
const today = Math.floor((new Date())/1000);
const weekBefore = today - weekInASeconds;
const twoWeeksBefore = today - weekInASeconds * 2;
class TrasactionService { 
    constructor(transactions, limit = 8500){
        if(!Array.isArray(transactions)) throw new Error(`transaction should be in array and you provided ${typeof transactions}`);

        this._transactions = transactions;
        this.limit = limit;
    }

    get transactions(){
        return this._transactions; 
    }

    set transactions(arrOfTransactions){
        if(!Array.isArray(transactions)) throw new Error(`transaction should be in array and you provided ${typeof transactions}`);

        this._transactions = arrOfTransactions;
    }
    
    
    getTransactionsByCattegory(...category){ 
        const matchingCategoriesCodes = this.getCategoryCodes(...category)
        
        // return new TrasactionService(this._transactions.filter(transaction => matchingCategoriesCodes.includes(+transaction.mcc)));
        const filterCallback = (transaction) =>  matchingCategoriesCodes.includes(+transaction.mcc);
        return this.filterTransactions(filterCallback);
    }
    
    getTransactionsButCattegory(...category){ 
        const matchingCategoriesCodes = this.getCategoryCodes(...category)

        // new TrasactionService(this._transactions.filter(transaction => !matchingCategoriesCodes.includes(+transaction.mcc)));
        const filterCallback = (transaction) => !matchingCategoriesCodes.includes(+transaction.mcc);
        return this.filterTransactions(filterCallback);
    }
    
    getOutcomesByCattegory(...category){ 
        const matchingCategoriesCodes = this.getCategoryCodes(...category)
        
        // return new TrasactionService(transactionsByCattegory.filter(transaction => transaction.amount < 0));
        const filterCallback = (transaction) =>  matchingCategoriesCodes.includes(+transaction.mcc) && transaction.amount < 0;
        return this.filterTransactions(filterCallback);
    }
    
    getCategoryCodes(...category) {
        const matchingCategoriesCodes = MCC_DECODED.filter(transaction => category.includes(transaction.group.type)).map(transaction => +transaction.mcc);
        return matchingCategoriesCodes
    }
    
    getSumOfAllOutcomes(transactions = this.transactions) { 
        return transactions.reduce((accumulator, next) => {
            const amount = next.amount < 0 ? Math.floor(next.amount/100) : 0;
            return amount + accumulator; 
        }, 0)
    }

    getPreviousWeekTransactions() {
        const filterCallback = (transaction) => transaction.time >= twoWeeksBefore && transaction.time <= weekBefore;
        return this.filterTransactions(filterCallback);
    }

    getThisWeekTransactions() {
        const filterCallback = (transaction) => transaction.time >= weekBefore && transaction.time <= today;
        return this.filterTransactions(filterCallback);
    }

    getTop(amount = 3) { 
        return this.transactions.sort((prev, next) => prev.amount - next.amount).slice(0, amount);
    }

    getSumOfAllTransactions(transactions = this.transactions) { 
        return transactions.reduce((accumulator, next) => {
            return next.amount/100 + accumulator; 
        }, 0)
    }

    filterTransactions(callback) { 
        return new TrasactionService(this.transactions.filter(transaction => callback(transaction)));
    }
}

module.exports = TrasactionService;