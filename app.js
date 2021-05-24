const express = require("express");
const socket = require("socket-io");
const http = require("http");
const server = http.createServer(app);
const io = server(server);

io.on("connection", (socket) => {
    socket.on("error", (err) => {
        console.error(`CONNECTION FAILED: ${socket.id} : ${err}`);
    });

    socket.on("disconnect", (data) => {
        console.log(`CONNECTION ${socket.id}`);
    });

    socket.on("callPeer", (data) => {
        //TODO
    });

    socket.on("answerCall", (data) => {
        //TODO
    });
});

server.listen(3000, () => {
    console.log("Server UP on port 3000");
});
