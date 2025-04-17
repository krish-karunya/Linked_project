import { Server } from "socket.io";

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log(socket);

    socket.on("joinChat", ({ receiverId, senderId }) => {
      // console.log(data);

      const roomId = [receiverId, senderId].sort().join("_");

      console.log(roomId);
      // here we are creating a room for two user :
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ receiverId, senderId, userName, message }) => {
      console.log(userName, "-", message);
      console.log("------------------");

      const roomId = [receiverId, senderId].sort().join("_");
      console.log(roomId);

      io.to(roomId).emit("receivedMessage", {
        senderId,
        receiverId,
        userName,
        message,
      });
    });

    socket.on("disconnect", (socket) => {
      console.log(socket, "disconnected");
    });
  });
}

export default initializeSocket;
