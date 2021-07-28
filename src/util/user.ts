const userMap: {
  [socketId: string]: string;
} = {};

const getUserList = () => Object.values(userMap);
const getSocketIdList = () => Object.keys(userMap);

const isSocketIdRepeat = (socketId: string) =>
  getSocketIdList().includes(socketId);

const addUser = (userName: string, socketId: string) => {
  if (!userName || !socketId) return;
  userMap[socketId] = userName;
};

const deleteUer = (socketId: string) => {
  if (!socketId) return;
  Reflect.deleteProperty(userMap, socketId);
};

export { userMap, addUser, deleteUer, getSocketIdList, isSocketIdRepeat };
