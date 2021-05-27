const express = require("express");
const socket = require("socket.io");
const http = require("http");
const server = http.createServer(express);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("userConnected", socket.id);

  socket.on("error", (err) => {
    console.error(`CONNECTION FAILED: ${socket.id} : ${err}`);
  });

  socket.on("disconnect", (data) => {
    io.emit("callEnded");
  });

  socket.on("callUser", (payload) => {
    io.to(payload.callRecipient).emit("calling", {
      callerSignal: payload.signalData,
      callerId: payload.callerId,
      callerName: payload.callerName,
    });
  });

  socket.on("answerCall", (payload) => {
    io.to(payload.recipient).emit("callAnswered", payload);
  });

  socket.on("cancelCall", (payload) => {
    io.to(payload.recipient).emit("callCanceled");
  });

  socket.on("decline", (payload) => {
    io.to(payload.recipient).emit("callDeclined");
  });

  socket.on("endCall", (payload) => {
    io.to(payload.recipient).emit("callEnded");
  });
});

server.listen(3001, () => {
  console.log("Server UP on port 3001");
});
