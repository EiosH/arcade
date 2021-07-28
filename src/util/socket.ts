import { Server } from "socket.io";
import { DataType, SignalType, SignalData, MessageData } from "@/type";

import { addUser, deleteUer } from "./user";
import { createSignalMessage } from "./createMessage";

let io;

const initSocket = (server) => {
  // @ts-ignore
  io = new Server(server, { cors: true });

  io.on("connection", (socket) => {
    const socketId = socket.id;

    console.log("a user connected", socketId);

    socket.on("disconnect", () => {
      deleteUer(socketId);
    });

    socket.on(DataType.MESSAGE, (msg: MessageData) => {
      console.log("message: " + msg);
    });

    socket.on(DataType.SIGNAL, (origin: SignalData) => {
      const { type, data } = origin || {};
      switch (type) {
        case SignalType.LOGIN:
          addUser(data, socketId);
          return;
        case SignalType.OFFER_CALL:
          socket.broadcast.emit(
            DataType.SIGNAL,
            createSignalMessage({
              type: SignalType.OFFER_CALL,
              data: data,
            }),
          );
          return;
        case SignalType.OFFER_ANSWER:
          socket.broadcast.emit(
            DataType.SIGNAL,
            createSignalMessage({
              type: SignalType.OFFER_ANSWER,
              data: data,
            }),
          );
          return;
        case SignalType.ICE_CANDIDATE:
          socket.broadcast.emit(
            DataType.SIGNAL,
            createSignalMessage({
              type: SignalType.ICE_CANDIDATE,
              data: data,
            }),
          );
          return;
      }
    });
  });
};

const broadcast = (type, data) => {
  io.emit(type, data);
};

export { initSocket, broadcast };
