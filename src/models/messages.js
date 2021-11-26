const connection = require("../config/db");

const messages = {
  insert: (sender, receiver, msg) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO messages (sender, receiver, msg) VALUE ('${sender}', '${receiver}', '${msg}')`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),

  getAllMessages: (sender, receiver) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT m.id ,u1.id AS idSender, u2.id AS idReceiver, u1.image AS sender, u2.image AS receiver, msg FROM messages AS m INNER JOIN users AS u1 ON m.sender = u1.id INNER JOIN users AS u2 ON m.receiver = u2.id
        WHERE
        (sender='${sender}' AND receiver='${receiver}')
        OR
        (sender='${receiver}' AND receiver='${sender}') ORDER BY id ASC`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),

  deleteMsg: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM messages WHERE id = ${id}`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
};

module.exports = messages;
