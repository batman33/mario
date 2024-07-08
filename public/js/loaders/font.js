import SpriteSheet from "../SpriteSheet.js";
import { loadImage } from "../loaders.js";

const CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

class Font {
  constructor(sprites, size = 8) {
    /**
     * @type {SpriteSheet}
     */
    this.sprites = sprites;
    /**
     * @type {number}
     */
    this.size = size;
  }

  print(text, context, x, y) {
    [...text].forEach((char, pos) => {
      this.sprites.draw(char, context, x + pos * this.size, y);
    });
  }
}

export function loadFont() {
  return loadImage("./img/font.png").then((image) => {
    const fontSprite = new SpriteSheet(image);

    const size = 8;
    const rowLength = image.width;

    console.log(rowLength);

    for (let [index, char] of [...CHARS].entries()) {
      const x = (index * size) % rowLength;
      const y = Math.floor((index * size) / rowLength) * size;
      fontSprite.define(char, x, y, size, size);
    }

    return new Font(fontSprite, size);
  });
}
