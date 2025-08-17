// Add this to your existing socket client file (usually sockets/socket.js)

import { io } from "socket.io-client";

export const createSocket = () => {
  const token = localStorage.getItem("token"); // Adjust based on your auth implementation
  
  const socket = io("http://localhost:5000", {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  // Handle heartbeat from server
  socket.on("heartbeat", () => {
    // Respond to server heartbeat to show we're still active
    socket.emit("heartbeat-response");
  });

  // Handle connection events
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  // Handle authentication errors
  socket.on("auth-error", (message) => {
    console.error("Socket authentication error:", message);
    // Optionally redirect to login or refresh token
    // window.location.href = "/login";
  });

  return socket;
};