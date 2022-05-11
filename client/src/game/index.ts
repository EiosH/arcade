import Phaser from "phaser";

import { preload, create, update } from "./functions";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const initGame = () => {
  new Phaser.Game(config);
};

export { initGame };
