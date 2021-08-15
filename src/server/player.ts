import EventEmitter from "events";
import { remove } from "lodash";

import { Data } from "@/type";

export type Player = {
  id: string;
  name?: string;
  event: EventEmitter;
  eventListener: (data: any) => void;
};
const players = new Array<Player>();

const getPlayer = (client) => {
  return players.find((item) => {
    return item.id === client._id;
  });
};

const addPlayer = (player: Player) => {
  players.push(player);
};

const sendToPlayer = (client, data: Data) => {
  if (!client || !data) return;

  const playerEvent = getPlayer(client)?.event;
  playerEvent?.emit("data", data);
};

const releasePlayer = (client) => {
  const { event, eventListener } = getPlayer(client);
  event.removeListener("data", eventListener);

  remove(players, (item) => {
    return item.id === client._id;
  });
};

export { getPlayer, sendToPlayer, addPlayer, releasePlayer };
