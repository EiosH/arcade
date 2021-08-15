import EventEmitter from "events";

import { Data } from "@/type";
import getRandom from "@/util/random";

import { addPlayer, sendToPlayer, releasePlayer } from "./player";
import { createPeer, releasePeer } from "./peer";
import { leaveRoom } from "./room";
import { sendToClient } from "./sendData";

const gameEvent = new EventEmitter();

const enterGame = (client) => {
  client._id = getRandom();

  const playerEvent = new EventEmitter();
  const eventListener = (data) => {
    sendToClient(client, data);
  };
  playerEvent.on("data", eventListener);

  addPlayer({
    id: client._id,
    event: playerEvent,
    eventListener,
  });

  gameEvent.on("data", (data) => {
    sendToClient(client, data);
  });

  sendToPlayer(client, {
    type: "welcome",
    data: "welcome to my game",
  });

  createPeer(client);
};

const leaveGame = (client) => {
  leaveRoom(client);
  releasePlayer(client);
  releasePeer(client);
};

const sendToGame = (data: Data) => {
  if (!data) return;
  gameEvent?.emit("data", data);
};

export { enterGame, leaveGame, sendToGame };
