import sky from "@/assets/sky.png";
import platform from "@/assets/platform.png";
import star from "@/assets/star.png";
import bomb from "@/assets/bomb.png";
import dude from "@/assets/dude.png";

export default function () {
  this.load.image("sky", sky);
  this.load.image("ground", platform);
  this.load.image("star", star);
  this.load.image("bullet", bomb);
  this.load.spritesheet("dude", dude, {
    frameWidth: 32,
    frameHeight: 48,
  });
}
