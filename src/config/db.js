const mysql = require('mysql2')
const { HOST, DB_USERNAME, DB_PASSWORD } = require('../helpers/env')

const db = mysql.createConnection({
    host: HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'telegram',
})

db.connect((err) => {
    if (err) {
        console.log('connected failed')
    } else {
        console.log('connected success')
    }
})

module.exports = db