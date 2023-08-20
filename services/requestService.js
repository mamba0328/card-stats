const axios = require('axios').default;

const get = (url, XToken) => { 
    return axios({
        method: 'get',
        url, 
        ...(XToken && {headers: {'X-Token': XToken,}})
    })
}

module.exports = get; 