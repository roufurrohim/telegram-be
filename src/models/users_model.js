const connection = require("../config/db");

const usersModel = {
  getList: (search, field, typeSort, limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE username LIKE "%${search}%" ORDER BY ${field} ${typeSort} LIMIT ${limit} OFFSET ${offset}`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  getAll: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),
  getDetails: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE id='${id}'`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  getDetailsWithEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  insert: (body, hash) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO users (username, fullname, email, password, image) VALUE ("@${body.username}", "${body.username}", "${body.email}", "${hash}", "${body.image}")`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  login: (body) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE email LIKE "${body.email}"`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  update: (id, body, image) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET username='${body.username}', fullname='${body.fullname}', email='${body.email}', image='${image}', phone='${body.phone}', bio='${body.bio}' WHERE id=${id}`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  destroy: (id) =>
    new Promise((resolve, reject) => {
      connection.query(`DELETE FROM users WHERE id= '${id}'`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),
};

module.exports = usersModel;
