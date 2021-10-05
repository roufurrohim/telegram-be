const jwt = require('jsonwebtoken')
const { KEY_SECRET } = require('../helpers/env')
const { failed, errLogin } = require('../helpers/response')

const authentic = ( req, res, next ) => {
    try {
        const { token } = req.headers
        if (token === undefined) {
            errLogin(res, "Anda Harus Login")
        } else {
            jwt.verify(token, KEY_SECRET, (err) => {
                if (err) {
                    errLogin(res, 'Anda Harus Login')
                } else {
                    next()
                }
            })
        }
    } catch (error) {
        failed(res, 502, error)
    }
}

module.exports = authentic