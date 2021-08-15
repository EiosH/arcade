import Peer from "@/util/pure-rtx";

import { sendToClient } from "./sendData";
import { sendToRoomPeer } from "./room";

const createPeer = (client) => {
  const peer = new Peer();

  peer.on("signal", (signal: any) => {
    sendToClient(client, {
      type: "signal",
      data: signal,
    });
  });

  peer.on("data", (data: any) => {
    sendToRoomPeer(client, data);
  });

  peer.on("close", () => {
    sendToRoomPeer(client, { type: "close" });
  });

  client._peer = peer;

  return peer;
};

const releasePeer = (client) => {
  if (!client?._peer) return;
  client._peer?.close();
  client._peer = null;
};

const transferPeerSignal = (client, data) => {
  data && client?._peer?.signal(data);
};

export { createPeer, releasePeer, transferPeerSignal };
