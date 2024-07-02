import Entity, { Trait } from "../Entity.js";

export default class Jump extends Trait {
  constructor() {
    super("jump");

    /**
     * @type {number}
     */
    this.duration = 0.5;
    /**
     * @type {number}
     */
    this.engageTime = 0;

    /**
     * @type {number}
     */
    this.velocity = 200;
  }

  start() {
    this.engageTime = this.duration;
  }

  cancel() {
    this.engageTime = 0;
  }

  /**
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  update(entity, deltaTime) {
    if (this.engageTime > 0) {
      entity.vel.y = -this.velocity;
      this.engageTime -= deltaTime;
    }
  }
}
