const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const usersRouter = require('./src/routers/users')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(usersRouter)
app.use(express.static(__dirname + '/uploads'))

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

require('./src/socket/consumer')(io)

const port = 5000
httpServer.listen(port, () => {
    console.log(`Service Running on port ${port}`)
})

module.exports = app