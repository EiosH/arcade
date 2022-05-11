import getRandom from "@/utils/random";

let platforms;

let players: {
  major: any;
  otherPlayer: any[];
  getStaff: () => any[];
  createPlayer: (...info: any) => void;
  removePlayer: (id: string) => void;
  getPlayer: (id: string) => any | undefined;
} = {
  major: undefined,
  otherPlayer: [],
  createPlayer: undefined,
  getStaff() {
    return [...this.otherPlayer, this.major];
  },
  removePlayer(id) {
    this.otherPlayer = this.otherPlayer.filter((item) => item.id === id);
  },
  getPlayer(id) {
    return this.getStaff().find((item) => item.id === id);
  },
};

let stars = [];

let score = 0;
let scoreText;

export default function () {
  const id = getRandom();
  this.add.image(400, 300, "sky").setScale(2);
  // this.add.image(400, 300, "star");

  const createPlatforms = () => {
    const platforms = this.physics.add.staticGroup();

    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
    platforms.create(280, 600, "ground");
    platforms.create(1000, 560, "ground");
    platforms.create(200, 688, "ground");
    platforms.create(400, 688, "ground");
    platforms.create(600, 688, "ground");
    platforms.create(800, 688, "ground");
    platforms.create(1000, 688, "ground");

    return platforms;
  };
  const createPlayer = (id: string, character?: string) => {
    const player = this.physics.add.sprite(
      1000 * Math.random(),
      600 * Math.random(),
      "dude"
    );

    player.id = id;
    player.direction = "left";

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(400);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(player, platforms);

    if (character === "self") {
      players.major = player;
    } else {
      players.otherPlayer.push(player);
    }

    addOverlapOfStar();

    return player;
  };

  const createStar = () => {
    const stars = this.physics.add.group({
      key: "star",
      repeat: 16,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);

    return stars;
  };

  const addOverlapOfStar = () => {
    const addScore = (player) => {
      if (player.id === players.major.id) {
        score += 10;
        scoreText.setText("score: " + score);
      }
    };

    function collectStar(player, star) {
      star.disableBody(true, true);
      addScore(player);
    }

    players.getStaff().map((player) => {
      this.physics.add.overlap(player, stars, collectStar);
    });
  };

  const createScoreText = () => {
    const scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    return scoreText;
  };

  platforms = createPlatforms();

  stars = createStar();

  createPlayer(id, "self");

  players.createPlayer = createPlayer;

  scoreText = createScoreText();
}

export { platforms, players, stars };
