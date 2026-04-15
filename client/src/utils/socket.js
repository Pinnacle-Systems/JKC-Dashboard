import { io } from "socket.io-client";
import { BASE_URL } from "../constants/apiUrl";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(BASE_URL, {
      autoConnect: false,
     withCredentials: false,  
      reconnection: true,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function connectSocket(userId) {
  const s = getSocket();

  const joinRoom = () => {
    s.emit("join", String(userId));
    console.log("📤 Joined room for userId:", userId);
  };

  // Remove any previous connect listeners to avoid duplicates
  s.off("connect");

  if (s.connected) {
    // Already connected — emit join immediately
    joinRoom();
  } else {
    // Wait for connection then join
    s.once("connect", joinRoom);
    s.connect();
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.off("connect");
    socket.disconnect();
    socket = null;
  }
}