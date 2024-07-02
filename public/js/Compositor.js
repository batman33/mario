import Camera from "./Camera.js";

export default class Compositor {
  constructor() {
    /**
     * @type {function[]}
     */
    this.layers = [];
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {Camera} camera
   */
  draw(context, camera) {
    this.layers.forEach((layer) => {
      layer(context, camera);
    });
  }
}
