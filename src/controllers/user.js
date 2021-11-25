const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const _ = require("lodash");
const fs = require("fs");
const usersModel = require("../models/users_model");
const {
  KEY_SECRET,
  REDIS_HOSTNAME,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../helpers/env");

const client = redis.createClient({
  host: REDIS_HOSTNAME,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});
const redisAction = require("../helpers/redis");

const { success, sucLog, failed, errLogin } = require("../helpers/response");

const users = {
  getList: (req, res) => {
    try {
      const { query } = req;
      const { id } = req.params;
      const search = query.search === undefined ? "" : query.search;
      const field = query.field === undefined ? "id" : query.field;
      const typeSort = query.sort === undefined ? "ASC" : query.sort;
      const limit = query.limit === undefined ? "10" : parseInt(query.limit);
      const offset =
        query.page === undefined || query.page === 1
          ? 0
          : (query.page - 1) * limit;

      client.get("users", (err, resultRedis) => {
        if (!resultRedis) {
          usersModel
            .getList(search, field, typeSort, limit, offset)
            .then(async (result) => {
              const allData = await usersModel.getAll();
              redisAction.set("users", JSON.stringify(allData));

              const filter = result.filter((e) => {
                if (e.id != id) {
                  return e;
                }
              });

              const output = {
                data: filter,
                totalPage: Math.ceil(filter.length / limit),
                search,
                limit,
                page: req.query.page,
              };

              success(res, output, 200, "Get All Users Success");
            })
            .catch((error) => {
              failed(res, 404, error);
            });
        } else {
          const dataRedis = JSON.parse(resultRedis);
          const dataFilter = _.filter(dataRedis, (e) =>
            e.id != id ? e : undefined
          );
          const pagination = _.slice(dataFilter, offset, offset + limit);
          const output = {
            data: pagination,
            totalPage: Math.ceil(dataFilter.length / limit),
            search,
            limit,
            page: req.query.page,
          };
          success(res, output, 200, "Get All Users Success");
        }
      });
    } catch (error) {
      failed(res, 404, error);
    }
  },
  getDetails: (req, res) => {
    try {
      const { id } = req.params;
      client.get("users", (err, resultRedis) => {
        if (!resultRedis) {
          usersModel
            .getDetails(id)
            .then((result) => {
              success(res, result, 200, "Get Details User Success");
            })
            .catch((err) => {
              failed(res, 404, err);
            });
        } else {
          const dataRedis = JSON.parse(resultRedis);
          const dataFilter = _.filter(dataRedis, (e) =>
            e.id == id ? e : undefined
          );
          success(res, dataFilter, 200, "Get details user Succes");
        }
      });
    } catch (error) {
      failed(res, 404, error);
    }
  },
  register: (req, res) => {
    try {
      const { body } = req;
      const hash = bycrypt.hashSync(body.password, 10);

      usersModel.getDetailsWithEmail(body.email).then((result) => {
        if (result.length === 0) {
          usersModel
            .insert(body, hash)
            .then((result) => {
              client.del("users");
              const payload = {
                id: result.insertId,
                email: body.email,
              };
              const token = jwt.sign(payload, KEY_SECRET);
              return sucLog(res, result, token, 200, "Register Success");
            })
            .catch((err) => {
              return failed(res, 400, err);
            });
        } else {
          errLogin(res, "Email or Username already in use");
        }
      });
    } catch (error) {
      failed(res, 400, error);
    }
  },
  login: (req, res) => {
    try {
      const { body } = req;
      usersModel.login(body).then((result) => {
        if (result.length <= 0) {
          errLogin(res, "Wrong Email or Password");
        } else {
          const idUser = result[0];
          const payload = {
            id: idUser.id,
            email: idUser.email,
          };
          const token = jwt.sign(payload, KEY_SECRET);
          const hash = idUser.password;
          const pwd = bycrypt.compareSync(body.password, hash);
          if (pwd === true) {
            sucLog(res, result, token, 200, "Login Success");
          } else {
            errLogin(res, "Wrong Email or Password");
          }
        }
      });
    } catch (error) {
      failed(res, 400, error);
    }
  },
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req;

      if (req.file === undefined) {
        usersModel
          .update(id, body, body.image)
          .then((result) => {
            client.del("users");
            success(res, result, 200, "Update Success");
          })
          .catch((error) => {
            failed(res, 400, error);
          });
      } else {
        const img = req.file.filename;
        usersModel
          .getDetails(id)
          .then((result) => {
            const data = result[0];
            const nameImage = data.image;
            if (nameImage !== "default.jpg") {
              fs.unlink(`./uploads/${nameImage}`, (err) => {
                if (err) {
                  errLogin(res, err);
                }
              });
            }
          })
          .catch((error) => {
            failed(res, 502, error);
          });

        usersModel
          .update(id, body, img)
          .then((result) => {
            client.del("users");
            success(res, result, 200, "Update Success");
          })
          .catch((error) => {
            failed(res, 400, error);
          });
      }
    } catch (error) {
      failed(res, 400, error);
    }
  },
  destroy: (req, res) => {
    try {
      const { id } = req.params;
      usersModel
        .getDetails(id)
        .then((result) => {
          const data = result[0];
          const nameImage = data.image;
          if (nameImage !== "default.jpg") {
            fs.unlink(`./uploads/${nameImage}`, (err) => {
              if (err) {
                errLogin(res, err);
              }
            });
          }
        })
        .catch((error) => {
          failed(res, 400, error);
        });
      usersModel
        .destroy(id)
        .then((result) => {
          client.del("users");
          success(res, result, 200, "Delete data users success");
        })
        .catch((err) => {
          failed(res, 404, err);
        });
    } catch (error) {
      failed(res, 404, error);
    }
  },
};

module.exports = users;
