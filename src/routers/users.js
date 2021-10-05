const express = require('express')
const usersController = require("../controllers/user")
const authentic = require('../middleware/authentic')
const upload = require('../middleware/upload')

const usersRouter = express.Router()
usersRouter.get('/users/:id', authentic, usersController.getList)
usersRouter.get('/user/:id', authentic, usersController.getDetails)
usersRouter.post('/register', usersController.register)
usersRouter.post('/login', usersController.login)
usersRouter.patch('/user/:id', authentic, upload, usersController.update)
usersRouter.delete('/user/:id', authentic, usersController.destroy)

module.exports = usersRouter