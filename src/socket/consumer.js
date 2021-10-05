// const { failed } = require('../helpers/response')
const messages = require('../models/messages')

module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("a client connected")

        socket.on("login", (room) => {
            console.log("user joined room " + room)            
            socket.join(room)
        })

        socket.on('send-message', (payload) => {
            const { idsender, idreceiver, sender, receiver, msg } = payload
            const data = {
                sender,
                receiver,
                msg,
            }
            messages.insert(idsender, idreceiver, msg).then((result) => {
                console.log(result)
                io.to(receiver).emit('list-messages', data)
            }).catch((err) => {
                console.log(err)
            })

        })


        socket.on('get-messages', ({idsender, receiver, sender}) => {
            messages.getAllMessages(idsender, receiver).then((result) => {
                
                io.to(sender).emit('history-messages', result)
            }).catch((err) => {
                console.log(err)
            })
        })

        // socket.on('send-message-private', (payload) => {
        //     const { room, msg, username } = payload
        //     console.log(payload)
        //     io.to(room).emit("get-message-private", {msg, username})
        // })

        socket.on('disconnect', () => {
            console.log("a client disconnected")
        })

    })

}