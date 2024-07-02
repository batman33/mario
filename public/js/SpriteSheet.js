export default class SpriteSheet {
  /**
   *
   * @param {Image} image
   * @param {number} width
   * @param {number} height
   */
  constructor(image, width, height) {
    /**
     * @type {Image}
     */
    this.image = image;
    /**
     * @type {number}
     */
    this.width = width;
    /**
     * @type {number}
     */
    this.height = height;
    /**
     * @type {Map<string, HTMLCanvasElement>}
     */
    this.tiles = new Map();
    /**
     * @type {Map<string, function>}
     */
    this.animations = new Map();
  }

  /**
   * @param {string} name
   * @param {function} animation
   */
  defineAnimation(name, animation) {
    this.animations.set(name, animation);
  }

  /**
   * @param {string} name
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  define(name, x, y, width, height) {
    const buffers = [false, true].map((flip) => {
      const buffer = document.createElement("canvas");
      buffer.width = width;
      buffer.height = height;
      const context = buffer.getContext("2d");

      if (flip) {
        context.scale(-1, 1);
        context.translate(-width, 0);
      }

      context.drawImage(this.image, x, y, width, height, 0, 0, width, height);

      return buffer;
    });

    this.tiles.set(name, buffers);
  }

  /**
   * @param {string} name
   * @param {number} x
   * @param {number} y
   */
  defineTile(name, x, y) {
    this.define(name, x * this.width, y * this.height, this.width, this.height);
  }

  /**
   * @param {string} name
   * @param {CanvasRenderingContext2D} context
   * @param {number} x
   * @param {number} y
   */
  draw(name, context, x, y, flip = false) {
    const buffer = this.tiles.get(name)[+flip];
    context.drawImage(buffer, x, y);
  }

  drawAnimation(name, context, x, y, distance) {
    const animation = this.animations.get(name);
    this.drawTile(animation(distance), context, x, y);
  }

  /**
   * @param {string} name
   * @param {CanvasRenderingContext2D} context
   * @param {number} x
   * @param {number} y
   */
  drawTile(name, context, x, y) {
    this.draw(name, context, x * this.width, y * this.height);
  }
}
