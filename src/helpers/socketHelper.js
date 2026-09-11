import { Server } from "socket.io";
import jsonWebToken from "jsonwebtoken";
let io;
const onlineUsers = new Map();

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie.split("; ");

      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
      const token = tokenCookie.split("=")[1];
      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_KEY);

      // Attach authenticated user ID to this socket
      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const existingSockets = onlineUsers.get(socket.userId);

    if (existingSockets) {
      existingSockets.push(socket.id);
      onlineUsers.set(socket.userId, existingSockets);
    } else {
      const socketIds = [];
      socketIds.push(socket.id);
      onlineUsers.set(socket.userId, socketIds);
    }

    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const existingSockets = onlineUsers.get(socket.userId);

      if (existingSockets) {
        const remainingSockets = existingSockets.filter(
          (socketId) => socketId !== socket.id,
        );

        if (remainingSockets.length > 0) {
          onlineUsers.set(socket.userId, remainingSockets);
        } else {
          onlineUsers.delete(socket.userId);
        }
      }
    });
  });

  return { io, onlineUsers };
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}

export function getOnlineUsers() {
  return onlineUsers;
}
