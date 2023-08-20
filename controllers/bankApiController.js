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
            const userData = await this.bankApiService.getAccountData(account, from, to);
            return userData.data
        } catch(e){ 
            console.log(e)
        }
    }
}

module.exports = bankApiController;
