export function socketMain(client) {
  console.log("New socket connected:", client.id);

  client.on("newPatient", function (data) {
    console.log(data, "socket data");
    client.broadcast.emit("newPatient", data);
  });

  client.on("join", (userId) => {
    if (userId) {
      client.join(String(userId));
      // Check server terminal — this must print when user logs in
      console.log(`✅ User ${userId} joined room. All rooms:`, client.rooms);
    }
  });

  client.on("disconnect", () => {
    console.log("❌ disconnected:", client.id);
  });
}