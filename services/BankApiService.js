const get = require('./requestService');

const weekInASeconds = 604800 * 4;
const today = Math.floor((new Date())/1000);
const weekBefore = today - weekInASeconds;

class BankApiService { 
    constructor(apiKey){ 
        this._apiKey = apiKey;
    }

    get apiKey(){ 
        return this._apiKey;
    }

    setNewApiKey(apiKey){
        if(!apiKey) throw new Error(`You can't set empty api key`);

        this._apiKey = apiKey;
    }

    async getPersonalData(){ 
        const response = await get('https://api.monobank.ua/personal/client-info', this.apiKey);
        return response
    }

    async getAccountData(account, from = weekBefore, to = today){//by deafult returns data per passed week
        console.log(account, from, to)
        const response = await get(`https://api.monobank.ua/personal/statement/${account}/${from}/${to}`, this.apiKey);
        return response
    }
}

module.exports = BankApiService;