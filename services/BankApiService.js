const get = require('./requestService');

const weekInASeconds = 604800;
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

    async getAccountData(account, from = weekBefore, to = today) {//by deafult returns data per passed week
        const fullResponse = [];
        const response = await get(`https://api.monobank.ua/personal/statement/${account}/${from}/${to}`, this.apiKey);
        fullResponse.push(...response.data)
        if (response.length >= 500) { 
            while (response.length >= 500) {
                const lastTransactionTime = fullResponse[fullResponse.length - 1].time
                const newResponse = await get(`https://api.monobank.ua/personal/statement/${account}/${lastTransactionTime}/${to}`, this.apiKey);
                fullResponse.push(...newResponse.data);
            }
        }

        return fullResponse
    }
}

module.exports = BankApiService;