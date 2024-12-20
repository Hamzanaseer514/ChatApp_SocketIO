const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("new-user-joined", (name) => {
    console.log("New user: ", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    console.log("User disconnected");
    socket.broadcast.emit("left", {name:users[socket.id]});
    delete users[socket.id];

  });

  // socket.on('disconnect', () => {
  // });
});
