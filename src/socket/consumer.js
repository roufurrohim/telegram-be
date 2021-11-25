// const { failed } = require('../helpers/response')
const messages = require("../models/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a client connected");

    socket.on("login", (room) => {
      console.log("user joined room " + room);
      socket.join(room);
    });

    socket.on("send-message", (payload) => {
      const { idSender, idReceiver, msg } = payload;
      // const data = {
      //   sender,
      //   receiver,
      //   msg,
      // };
      messages
        .insert(idSender, idReceiver, msg)
        .then((result) => {
          console.log(result);
          io.to(idReceiver).emit("list-messages", payload);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("get-messages", ({ idsender, receiver }) => {
      messages
        .getAllMessages(idsender, receiver)
        .then((result) => {
          console.log(result);
          io.to(idsender).emit("history-messages", result);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("del-message", ({ id, idsender, receiver }) => {
      messages
        .deleteMsg(id)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          console.log(res);
          messages
            .getAllMessages(idsender, receiver)
            .then((result) => {
              io.to(idsender).emit("history-after-delete", result);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    // socket.on('send-message-private', (payload) => {
    //     const { room, msg, username } = payload
    //     console.log(payload)
    //     io.to(room).emit("get-message-private", {msg, username})
    // })

    socket.on("disconnect", () => {
      console.log("a client disconnected");
    });
  });
};
