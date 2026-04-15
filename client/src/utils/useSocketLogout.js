import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { connectSocket, disconnectSocket, getSocket } from "./socket";

const useSocketLogout = (onLogout, isLoggedIn) => {
  useEffect(() => {
    if (!isLoggedIn) {
      disconnectSocket();
      return;
    }

  const sessionId = sessionStorage.getItem("sessionId");
const userId = secureLocalStorage.getItem(sessionId + "userId");
const isSuperAdmin = secureLocalStorage.getItem(sessionId + "superAdmin");

console.log("🔍 sessionId:", sessionId);
console.log("🔍 userId:", userId);
console.log("🔍 isSuperAdmin:", isSuperAdmin);

// ✅ Skip socket entirely for superAdmin
if (isSuperAdmin === true || isSuperAdmin === "true") {
  console.log("⚠️ SuperAdmin — skipping socket logout");
  return;
}

if (!userId || userId === false || userId === "false") {
  console.log("⚠️ No valid userId, skipping socket");
  return;
}

    connectSocket(userId);
    const socket = getSocket();

    const handleForceLogout = () => {
      console.log("🚨 force-logout received!");
      disconnectSocket();
      onLogout();
    };

    const handleReconnect = () => {
      console.log("🔄 Reconnected, rejoining room:", userId);
      socket.emit("join", String(userId));
    };

    socket.on("force-logout", handleForceLogout);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("force-logout", handleForceLogout);
      socket.off("reconnect", handleReconnect);
    };
  }, [isLoggedIn]);
};

export default useSocketLogout;