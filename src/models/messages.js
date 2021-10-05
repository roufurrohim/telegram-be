const connection = require('../config/db')

const messages = {
    insert: (sender, receiver, msg) => new Promise((resolve, reject) =>  {
        connection.query(`INSERT INTO messages (sender, receiver, msg) VALUE ('${sender}', '${receiver}', '${msg}')`, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    }),

    getAllMessages: (sender,receiver) => new Promise((resolve, reject) => {
        connection.query(`SELECT a.username AS sender, b.username AS receiver, msg FROM messages INNER JOIN users AS a ON messages.sender = a.id INNER JOIN users AS b ON messages.receiver = b.id WHERE 
        (sender='${sender}' AND receiver='${receiver}')
        OR
        (sender='${receiver}' AND receiver='${sender}')`, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = messages