import { players } from "./create";
import { peer, ws, sendToPeer } from "../../online";

let init = false;
let ready = false;
const idMap = {};
let bullets = [];

enum MoveDirection {
  LEFT = "left",
  UP = "up",
  DOWN = "down",
  RIGHT = "right",
}

export default function () {
  players.getStaff().map((item) => {
    if (item.y >= 670) {
      item.destroy();
    }
  });
  bullets.map((item) => {
    if (item.y >= 670) {
      item.destroy();
    }
  });

  const createBullet = (player) => {
    const direction = player.direction;
    const bullet = this.physics.add.sprite(
      player.x + 15 * (direction === "left" ? -1 : 1),
      player.y,
      "bullet"
    );

    bullet.setVelocityX((direction === "left" ? -1 : 1) * 500);

    bullet.direction = direction;

    players.getStaff().map((item) => {
      const hit = () => {
        if (bullet.direction === "left") {
          item.setVelocityX(-300);
        } else {
          item.setVelocityX(300);
        }
        bullet.destroy();
      };

      this.physics.add.overlap(bullet, item, hit);
    });

    bullets.push(bullet);

    return bullet;
  };

  const movePlayer = (player, direction: MoveDirection, type = "press") => {
    if (type !== "press" && type !== "release") return;
    const isPress = type === "press";

    if (player?.body.touching.down) {
      player.jumpTime = 0;
    }

    const turn = () => {
      player.setVelocityX(0);
      // player.anims.play("turn");
    };

    const canJump = () => {
      return player.jumpTime < 2 && !player.lockJump;
    };

    const jump = () => {
      player.lockJump = true;
      player.setVelocityY(-330);
      player.jumpTime += 1;
    };

    if (direction === MoveDirection.LEFT) {
      if (isPress) {
        player.direction = "left";
        player.setVelocityX(-160);
        player.anims.play("left", true);
      } else {
        turn();
      }
    } else if (direction === MoveDirection.RIGHT) {
      if (isPress) {
        player.direction = "right";
        player.setVelocityX(160);
        player.anims.play("right", true);
      } else {
        turn();
      }
    } else if (direction === MoveDirection.UP) {
      if (isPress) {
        if (canJump()) {
          jump();
        }
      } else {
        player.lockJump = false;
      }
    } else if (direction === MoveDirection.DOWN) {
    }
  };

  const fire = (player) => {
    createBullet(player);
  };

  const cursorKeys = this.input.keyboard.createCursorKeys();

  cursorKeys["space"].onDown = () => {
    sendToPeer({
      type: "fire",
      data: { playerId: players.major.id },
    });
  };

  Object.values(MoveDirection).map((item) => {
    cursorKeys[item].onDown = () => {
      sendToPeer({
        type: "move",
        data: { playerId: players.major.id, moveDirection: item },
      });
    };
  });

  Object.values(MoveDirection).map((item) => {
    cursorKeys[item].onUp = () => {
      sendToPeer({
        type: "move",
        data: {
          playerId: players.major.id,
          moveDirection: item,
          type: "release",
        },
      });
    };
  });

  const crazy = () => {
    const random = Math.floor(Math.random() * 100);
    if (random > 11) return;

    const type =
      random === 11
        ? MoveDirection.UP
        : random % 2
        ? MoveDirection.LEFT
        : MoveDirection.RIGHT;
    const isFile = random > 3;

    if (isFile) {
      sendToPeer({
        type: "fire",
        data: { playerId: players.major.id },
      });
    }

    sendToPeer({
      type: "move",
      data: {
        playerId: players.major.id,
        moveDirection: type,
      },
    });

    if (type === MoveDirection.UP) {
      sendToPeer({
        type: "move",
        data: {
          playerId: players.major.id,
          moveDirection: MoveDirection.UP,
          type: "release",
        },
      });
    }
  };

  // @ts-ignore
  if (window?.arcade?.crazy) {
    crazy();
  }

  if (!init && ready) {
    players.getStaff().map((player) => {
      player.jumpTime = 0;
      player.lockJump = false;
    });

    peer.on("data", (originData: any) => {
      const { type, data, _id } = originData;

      if (
        type === "move" ||
        type === "join" ||
        type === "sync" ||
        type === "close"
      ) {
        const { playerId } = data || {};

        if (playerId && _id) {
          if (!idMap[_id]) {
            idMap[_id] = playerId;
          }
        }

        let player = players.getStaff().find((item) => item.id === playerId);

        if (!player) {
          if (playerId && playerId !== players.major.id) {
            player = players.createPlayer(playerId);
          }
        }

        if (type === "move") {
          const { moveDirection, type } = data;
          movePlayer(player, moveDirection, type);
        } else if (type === "join") {
          syncStatus();
        } else if (type === "sync") {
          const { x, y, time } = data;

          player.setX(x);
          player.setY(y);
        }
      } else if (type === "fire") {
        const { playerId } = data || {};
        const player = players.getPlayer(playerId);

        fire(player);
      }
    });

    const syncStatus = () => {
      const { id, x, y } = players.major;
      sendToPeer({
        type: "sync",
        data: {
          playerId: id,
          x,
          y,
        },
      });
    };

    const startGame = () => {
      const { id, x, y } = players.major;
      sendToPeer({
        type: "join",
        data: {
          playerId: id,
          x,
          y,
        },
      });
    };

    startGame();
    syncStatus();

    setInterval(() => {
      syncStatus();
    }, 3000);

    init = true;
  }
}

ws.addOnMessage((originData) => {
  const { type } = originData;

  switch (type) {
    case "join":
      ready = true;
      return;
  }
});
