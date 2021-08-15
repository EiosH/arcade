const WebSocket = require("ws");

import { enterGame, leaveGame } from "./server/game";
import {
  createRoom,
  leaveRoom,
  releaseRoom,
  joinRoom,
  chatInRoom,
} from "./server/room";

import { transferPeerSignal } from "./server/peer";
import { PORT } from "./constant";

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", function (client) {
  enterGame(client);

  client.on("close", function (e) {
    console.log("断开链接", e);
    leaveGame(client);
    client._peer = null;
  });

  client.on("message", function (originMessage: Buffer) {
    const message = JSON.parse(originMessage.toString()) as {
      type: string;
      data: any;
    };

    const { type, data } = message || {};

    switch (type) {
      case "create":
        createRoom(client);
        return;
      case "join":
        joinRoom(client, data as string);
        return;
      case "leave":
        leaveRoom(client);
        return;

      case "release":
        releaseRoom(client);
        return;
      case "chat":
        chatInRoom(client, data);
        return;
      case "signal":
        transferPeerSignal(client, data);
        return;
    }
  });
});
