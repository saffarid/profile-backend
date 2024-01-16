const api = require('../../api/api_desc')
const freelance = require('./work_freelance')


const execute = (url, data) => {
    const request = url.split('/')
    switch (request[2]) {
        case api.ESSENCE.freelance.name : {
            return freelance.execute(url, data)
        }
        default: {
            return new Promise((resolve, reject) => {
                reject(api.CODES_RESPONSE.notFound)
            })
        }
    }
}

module.exports = {
    execute
}