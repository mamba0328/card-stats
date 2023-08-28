const BankApiService = require('../services/BankApiService');
const apiKey = require('../config/API_KEY');




const bankApiController = { 
    bankApiService : new BankApiService(apiKey),

    async getUserData() {
        try{
            const userData = await this.bankApiService.getPersonalData();
            return userData.data
        } catch(e){ 
            console.log(e)
        }
    },

    async getAccountData(account, from, to){
        try{
            const accountData = await this.bankApiService.getAccountData(account, from, to);
            return accountData
        } catch(e){ 
            console.log(e)
        }
    },

    async getThisMonthAccountData(account){
        try {
            const date = new Date();
            const startOfTheMonthInUnix = Math.floor(new Date(date.getFullYear(), date.getMonth(), 1) / 1000);
            const todayInUnix = Math.floor(new Date() / 1000);
            const accountData = await this.bankApiService.getAccountData(account, startOfTheMonthInUnix, todayInUnix);
            return accountData
        } catch(e){ 
            console.log(e)
        }
    }
}

module.exports = bankApiController;
