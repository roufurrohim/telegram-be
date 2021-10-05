require('dotenv').config()

const env = {
    HOST: process.env.HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    KEY_SECRET: process.env.KEY_SECRET
}

module.exports = env