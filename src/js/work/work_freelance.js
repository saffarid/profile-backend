const api = require('../../api/api_desc')
const f = require('../../datas/freelance')

const get = () => {
    return new Promise((resolve, reject) => {
        resolve({
            ...api.CODES_RESPONSE.ok,
            datas: f.f
        })
    })
}

const execute = (url, data) => {
    const request = url.split('/')
    switch (request[3]) {
        case api.ESSENCE.freelance.actions.get : {
            return get()
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