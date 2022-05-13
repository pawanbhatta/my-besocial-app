const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // When connecting
  console.log("A user Connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Send and receive message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", { senderId, text });
  });

  // Notification handler
  socket.on("sendNotification", ({ sender, receiver, type }) => {
    const receiverUser = getUser(receiver);

    if (receiverUser)
      io.to(receiverUser.socketId).emit("getNotification", { sender, type });
  });

  // Text Notification handler
  socket.on("sendText", ({ sender, receiver, text }) => {
    const receiverUser = getUser(receiver);

    if (receiverUser)
      io.to(receiverUser.socketId).emit("getText", { sender, text });
  });

  // When disconnecting
  socket.on("disconnect", () => {
    console.log("A User disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
