const { socketGetCampaign } = require("../controllers/campaign");

module.exports.respond = (endpoint, socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnect");
    socket.disconnect();
  });

  socket.on("load fund", async () => {
    try {
      console.log("test");
      const id = socket.handshake.query.id;
      const fund = await socketGetCampaign(id);
      socket.emit("fund", fund);
    } catch (error) {
      console.log(error);
    }
  });
};
