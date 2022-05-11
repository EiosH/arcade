import { joinRoom, chatInRoom, peer } from "./online";
import { initGame } from "./game";

peer.on("dataChannelReady", () => {
  initGame();
});

window["arcade"] = { joinRoom, chatInRoom };
