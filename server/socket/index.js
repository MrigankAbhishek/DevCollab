const Room = require("../models/Room");

const initSocket = (io) => {
  const roomUsers = {};

  io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomId, user }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userData = user;

      if (!roomUsers[roomId]) roomUsers[roomId] = [];
      const existing = roomUsers[roomId].find((u) => u._id === user._id);
      if (!existing) roomUsers[roomId].push(user);

      io.to(roomId).emit("room-users", roomUsers[roomId]);

      try {
        const room = await Room.findById(roomId);
        if (room) socket.emit("initial-code", { code: room.code, language: room.language });
      } catch {}
    });

    socket.on("code-change", async ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
      try {
        await Room.findByIdAndUpdate(roomId, { code });
      } catch {}
    });

    socket.on("language-change", ({ roomId, language }) => {
      io.to(roomId).emit("language-update", language);
    });

    socket.on("send-message", ({ roomId, message, user, timestamp }) => {
      io.to(roomId).emit("new-message", { message, user, timestamp });
    });

    socket.on("task-update", ({ roomId, tasks }) => {
      socket.to(roomId).emit("tasks-updated", tasks);
    });

    socket.on("cursor-move", ({ roomId, position, user }) => {
      socket.to(roomId).emit("cursor-update", { position, user });
    });

    socket.on("disconnect", () => {
      const { roomId, userData } = socket;
      if (roomId && roomUsers[roomId]) {
        roomUsers[roomId] = roomUsers[roomId].filter((u) => u._id !== userData?._id);
        io.to(roomId).emit("room-users", roomUsers[roomId]);
      }
    });
  });
};

module.exports = initSocket;
