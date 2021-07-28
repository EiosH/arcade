import getRandom from "@/util/random";

interface Room {
  id: string;
  name: string;
  users: Set<string>;
  createTime: string;
  size: number;
  master: string;
}

enum UserStatus {
  READR,
  NOT_READR,
}

const RoomMap: {
  [roomId: string]: Room;
} = {};

const userStatusMap: {
  [userId: string]: UserStatus;
} = {};

const DEFAULT_ROOM_SIZE = 10;

const Room = function (data: Partial<Room>) {
  this.name = data.name;
  this.master = data.master;
  this.id = data.id;
  this.size = data?.size || DEFAULT_ROOM_SIZE;

  this.createTime = Date.now();
  this.users = new Set();
};

const getRoomList = () => Object.keys(RoomMap);

const getRoomByUserId = (userId: string) => {
  return Object.values(RoomMap).find((item) => {
    return item.users.has(userId);
  });
};

const getRoom = (roomId: string) => {
  return RoomMap[roomId];
};

const releaseRoom = (roomId: string) => {
  Reflect.deleteProperty(RoomMap, roomId);
};

const roomCount = getRoomList().length;

const createRoom = (userId: string) => {
  const roomName = `房间${roomCount}`;
  const roomId = getRandom();
  const room = new Room({
    name: roomName,
    master: userId,
    id: roomId,
  });

  RoomMap[roomId] = room;

  console.log("RoomMap", RoomMap);
};

const joinRoom = (roomId: string, userId) => {
  const room = getRoom(roomId);
  const userList = room.users;
  if (userList.size < room.size) userList.add(userId);
};

const isMaster = (roomId: string, userId: string) => {
  return getRoom(roomId).master === userId;
};

const leaveRoom = (userId: string) => {
  const room = getRoomByUserId(userId);

  if (room.users.size - 1) {
    if (isMaster(room.id, userId)) {
      const nextOne = room.users.values().next()!;
      // @ts-ignore
      room.master = nextOne;
    }
  } else {
    releaseRoom(room.id);
  }
};

const ready = (userId: string) => {
  userStatusMap[userId] = UserStatus.READR;
};

const unReady = (userId: string) => {
  userStatusMap[userId] = UserStatus.NOT_READR;
};

const getUserStatus = (userId: string) => userStatusMap[userId];

const setRoomStatus = (userId: string) => {
  const room = getRoomByUserId(userId);
  const userStatus = {};
  for (const i of room.users.values()) {
    userStatus[i] = getUserStatus(i);
  }
  return {
    room,
    userStatus,
  };
};

export { createRoom, joinRoom, leaveRoom, ready, unReady };
