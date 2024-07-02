import { Vec2 } from "./math.js";

export default class Camera {
  constructor() {
    /**
     * @type {Vec2}
     */
    this.pos = new Vec2(0, 0);
    /**
     * @type {Vec2}
     */
    this.size = new Vec2(256, 224);
  }
}
