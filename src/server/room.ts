import EventEmitter from "events";
import { remove } from "lodash";

import { Data } from "@/type";
import getRandom from "@/util/random";

import { sendToGame } from "./game";
import { sendToPlayer } from "./player";
import { sendToClient, sendToPeer } from "./sendData";

interface Room {
  id: string;
  master: string;
  event: EventEmitter;
}

const rooms = new Array<Room>();

const createRoom = (client, roomId?: string) => {
  const roomEvent = new EventEmitter();

  roomId = roomId ?? getRandom();
  const newRoom = {
    id: roomId,
    master: client._id,
    event: roomEvent,
  };

  rooms.push(newRoom);

  sendToGame({
    type: "create",
    data: newRoom,
  });

  joinRoom(client, roomId);
};

const getRooms = () => {
  return rooms;
};

const getRoom = (roomId: string) => {
  if (!roomId) return;
  return rooms.find(({ id }) => id === roomId);
};

const isJoinedRoom = (client) => !!client._roomId;

const joinRoom = (client, roomId: string) => {
  const room = getRoom(roomId);

  if (!room) {
    createRoom(client, roomId);
    return;
  }
  if (client._roomId === roomId) {
    sendToPlayer(client, {
      type: "join",
      data: {
        description: "你已经在此房间",
      },
    });
    return;
  }

  leaveRoom(client);

  const roomEvent = room?.event;

  const roomDataEventListener = (data) => {
    sendToClient(client, data);
  };

  const roomPeerEventListener = (data) => {
    sendToPeer(client, data);
  };

  roomEvent?.on("data", roomDataEventListener);
  roomEvent?.on("peer", roomPeerEventListener);

  client._roomEventListeners = [
    {
      eventName: "data",
      eventListener: roomDataEventListener,
    },
    {
      eventName: "peer",
      eventListener: roomPeerEventListener,
    },
  ];

  client._roomId = roomId;

  sendToPlayer(client, {
    type: "join",
    data: {
      succeed: Boolean(roomEvent),
      info: { roomId, rooms: getRooms() },
    },
  });
};

const isRoomMaster = (roomMaster, client) => {
  return roomMaster === client._id;
};

const releaseRoom = (client) => {
  const roomId = client._roomId;
  const { event, master } = getRoom(roomId);

  if (isRoomMaster(master, client)) {
    remove(rooms, (item) => {
      return item.id === roomId;
    });

    sendToRoom(client, {
      type: "release",
    });

    sendToGame({ type: "release", data: { roomId } });
    event.removeAllListeners();
  }
};

const leaveRoom = (client) => {
  if (!isJoinedRoom(client)) return;
  const roomId = client._roomId;
  const room = getRoom(roomId);

  const roomEvent = room?.event;
  const master = room?.master;
  if (!roomEvent || !master) return;

  if (isRoomMaster(master, client)) {
    releaseRoom(client);
  }

  const roomEventListeners = client?._roomEventListeners;
  roomEventListeners?.forEach(({ eventName, eventListener }) => {
    roomEvent.removeListener(eventName, eventListener);
  });
};

const chatInRoom = (client, data) => {
  sendToRoom(client, {
    type: "chat",
    data,
  });
};

const sendRoom = (client, data: Data, eventName = "data") => {
  if (!client || !data) return;

  const roomId = client._roomId;
  const roomEvent = getRoom(roomId)?.event;

  roomEvent?.emit(eventName, data);
};

const sendToRoom = (client, data: Data) => {
  sendRoom(client, data);
};

const sendToRoomPeer = (client, data: Data) => {
  sendRoom(client, data, "peer");
};

export {
  createRoom,
  joinRoom,
  leaveRoom,
  releaseRoom,
  chatInRoom,
  sendToRoomPeer,
};
