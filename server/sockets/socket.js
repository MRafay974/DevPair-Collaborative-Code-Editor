const jwt = require("jsonwebtoken");

// roomId -> Map<userId, { username, socketIds }>
const roomUsers = new Map();

function getRoomData(roomId) {
  if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map());
  return roomUsers.get(roomId);
}

function broadcastUsers(io, roomId) {
  const roomData = getRoomData(roomId);
  const usersList = Array.from(roomData.values()).map(user => ({
    userId: user.userId,
    username: user.username
  }));
  io.to(roomId).emit("room-users", usersList);
}

function broadcastUserLeft(io, roomId, userData) {
  // Broadcast to all users in the room that someone left
  io.to(roomId).emit("user-left-room", {
    userId: userData.userId,
    username: userData.username,
    leftAt: Date.now()
  });
}

const handleSocket = (socket, io) => {
  // Authentication
  const token = socket.handshake.auth?.token;
  let user;
  try {
    if (!token) throw new Error("No token");
    user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user?._id || !user?.username) throw new Error("Bad token payload");
  } catch (e) {
    socket.emit("auth-error", e.message || "Unauthorized socket");
    return socket.disconnect(true);
  }

  // Join room handler
  socket.on("join-room", (rawRoomId) => {
    const roomId = String(rawRoomId || "").trim();
    if (!roomId) return;

    // Initialize user data structure if it doesn't exist
    const roomData = getRoomData(roomId);
    if (!roomData.has(user._id)) {
      roomData.set(user._id, {
        userId: user._id,
        username: user.username,
        socketIds: new Set()
      });
    }

    // Add this socket to the user's connections
    const userData = roomData.get(user._id);
    userData.socketIds.add(socket.id);
    socket.join(roomId);

    broadcastUsers(io, roomId);
  });

  // Leave room handler - modified to support acknowledgment
  socket.on("leave-room", (rawRoomId, acknowledgment) => {
    const roomId = String(rawRoomId || "").trim();
    if (!roomId) return;

    const roomData = getRoomData(roomId);
    if (roomData.has(user._id)) {
      const userData = roomData.get(user._id);
      
      // Store user data before removal for broadcasting
      const userLeftData = {
        userId: userData.userId,
        username: userData.username
      };
      
      // Remove this socket from the user's connections
      userData.socketIds.delete(socket.id);
      
      // If no more sockets for this user, remove them completely and broadcast
      if (userData.socketIds.size === 0) {
        roomData.delete(user._id);
        // Broadcast that user left the room
        broadcastUserLeft(io, roomId, userLeftData);
      }

      socket.leave(roomId);
      broadcastUsers(io, roomId);
      
      // Clean up empty rooms
      if (roomData.size === 0) {
        roomUsers.delete(roomId);
      }

      // Send acknowledgment to the client
      if (typeof acknowledgment === 'function') {
        acknowledgment();
      }
    }
  });

  // Disconnect handler - enhanced to broadcast user left
  socket.on("disconnect", () => {
    for (const [roomId, roomData] of roomUsers.entries()) {
      if (roomData.has(user._id)) {
        const userData = roomData.get(user._id);
        userData.socketIds.delete(socket.id);
        
        if (userData.socketIds.size === 0) {
          // Store user data before removal for broadcasting
          const userLeftData = {
            userId: userData.userId,
            username: userData.username
          };
          
          roomData.delete(user._id);
          broadcastUsers(io, roomId);
          // Broadcast that user left the room
          broadcastUserLeft(io, roomId, userLeftData);
        }
        
        if (roomData.size === 0) {
          roomUsers.delete(roomId);
        }
      }
    }
  });

  // Heartbeat mechanism to detect inactive users
  let heartbeatInterval;
  
  const startHeartbeat = () => {
    heartbeatInterval = setInterval(() => {
      socket.emit("heartbeat");
    }, 30000); // Every 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
  };

  // Start heartbeat when socket connects
  startHeartbeat();

  // Handle heartbeat response
  socket.on("heartbeat-response", () => {
    // User is still active, do nothing special
    console.log(`Heartbeat received from user ${user.username}`);
  });

  // Clean up heartbeat on disconnect
  socket.on("disconnect", () => {
    stopHeartbeat();
  });

  // Other event handlers...
  socket.on("code-change", ({ roomId, code }) => {
    if (!roomId) return;
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("chat-message", ({ roomId, message }) => {
    if (!roomId || !message) return;
    socket.to(roomId).emit("chat-message", {
      message,
      from: user.username,
      ts: Date.now(),
    });
  });
};

module.exports = { handleSocket };