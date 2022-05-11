//@ts-nocheck

import { HOST, PORT } from "@/constant";

import Peer from "@/utils/pure-rtc";
import WS from "@/utils/ws";

const ws = new WS(`ws://${HOST}:${PORT}`);

const peer = new Peer({ isManual: true });

peer.on("signal", (signal: any) => {
  ws.sendData({
    type: "signal",
    data: signal,
  });
});

const getSignal = (data: any) => {
  peer.signal(data);
};

ws.addOnMessage((originData) => {
  const { data, type } = originData;
  console.log("收到信息类型", type, "内容:", data);

  switch (type) {
    case "join":
      return;

    case "signal":
      getSignal(data);
      return;

    case "establish":
      peer.start();
      return;
  }
});

const createRoom = () => {
  ws.sendData({
    type: "create",
  });
};

const joinRoom = (roomId: string) => {
  ws.sendData({
    type: "join",
    data: roomId,
  });
};

const chatInRoom = (data: string) => {
  ws.sendData({
    type: "chat",
    data,
  });
};

const sendToPeer = (data: any) => {
  peer?.send(data);
};

window._arcade = {
  createRoom,
  joinRoom,
  chatInRoom,
  crazy: false,
};

export { createRoom, joinRoom, chatInRoom, sendToPeer, peer, ws };
